import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import NoteCard from '../components/NoteCard/NoteCard';
import Button from '../components/Button/Button';
import { setUser, setTheme } from '../store';

const AVATAR_PLACEHOLDER = 'https://api.dicebear.com/7.x/identicon/svg?seed=deardiary';

export default function Profile() {
  const username = useSelector(state => state.user.username);
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();
  const [user, setUserData] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', status: '', avatar_url: '' });
  const [success, setSuccess] = useState('');
  const fileInput = useRef();
  const theme = useSelector(state => state.theme.value);

  useEffect(() => {
    if (!username) return;
    axios.get(`http://localhost:8000/users`)
      .then(res => {
        const u = res.data.find(u => u.username === username);
        setUserData(u);
        if (u) {
          setForm({ username: u.username, status: u.status || '', avatar_url: u.avatar_url || '' });
          axios.get(`http://localhost:8000/users/${u.id}/notes`)
            .then(res2 => setNotes(res2.data))
            .catch(() => setNotes([]));
        }
      })
      .catch(() => setError('Ошибка загрузки профиля.'));
  }, [username]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    // Для простоты: используем base64, в реальном проекте лучше хранить url на сервере
    const reader = new FileReader();
    reader.onload = () => {
      setForm(f => ({ ...f, avatar_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.patch('http://localhost:8000/users/me', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
      setSuccess('Профиль обновлён!');
      dispatch(setUser({ token, username: res.data.username }));
    } catch {
      setError('Ошибка обновления профиля.');
    }
  };

  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!user) return <div style={{ textAlign: 'center', marginTop: 40 }}>Загрузка...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', justifyContent: 'center' }}>
      <div style={{ maxWidth: 600, width: '100%', background: 'var(--bg)', padding: 40, borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', color: 'var(--text)', margin: '40px 0' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--text)', fontSize: 32, marginBottom: 24 }}>
          Личный кабинет
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <img src={form.avatar_url || AVATAR_PLACEHOLDER} alt="avatar" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, border: '2px solid var(--accent)' }} />
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInput} onChange={handleAvatarChange} />
          <Button type="button" onClick={() => fileInput.current.click()} style={{ marginBottom: 8 }}>Загрузить аватарку</Button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label>
            Никнейм:
            <input name="username" value={form.username} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid var(--accent)', marginTop: 4, background: 'var(--bg)', color: 'var(--text)' }} maxLength={32} required />
          </label>
          <label>
            Статус:
            <input name="status" value={form.status} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid var(--accent)', marginTop: 4, background: 'var(--bg)', color: 'var(--text)' }} maxLength={64} />
          </label>
          <label>
            Тема сайта:
            <select value={theme} onChange={e => {
              dispatch(setTheme(e.target.value));
              if (e.target.value === 'auto') {
                document.documentElement.removeAttribute('data-theme');
              } else {
                document.documentElement.setAttribute('data-theme', e.target.value);
              }
            }} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid var(--accent)', marginTop: 4, background: 'var(--bg)', color: 'var(--text)' }}>
              <option value="auto">Авто</option>
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
              <option value="strawberry">Клубничная</option>
              <option value="beach">Пляжная</option>
              <option value="club">Клубная</option>
            </select>
          </label>
          <Button type="submit">Сохранить</Button>
        </form>
        {success && <div style={{ color: 'green', marginTop: 12, textAlign: 'center' }}>{success}</div>}
        {error && <div style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{error}</div>}
        <div style={{ margin: '24px 0 0 0', color: 'var(--text)', textAlign: 'center' }}>
          <b>ID:</b> {user.id}
        </div>
      </div>
      <div style={{ maxWidth: 900, width: '100%', background: 'var(--bg)', padding: 40, borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', color: 'var(--text)', marginBottom: 40 }}>
        <h3 style={{ color: 'var(--text)', marginBottom: 16, textAlign: 'center' }}>Мои заметки</h3>
        {notes.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>Нет заметок</div>}
        {notes.map(note => (
          <NoteCard key={note.id} {...note} />
        ))}
      </div>
    </div>
  );
} 