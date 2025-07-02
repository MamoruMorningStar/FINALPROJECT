import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NoteCard from '../components/NoteCard/NoteCard';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TITLE_MAX = 50;
const CONTENT_MAX = 500;

export default function Diary() {
  const token = useSelector(state => state.user.token);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get('http://localhost:8000/notes/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setNotes(res.data))
      .catch(() => setError('Ошибка загрузки заметок.'));
  }, [token, navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (title.length > TITLE_MAX || content.length > CONTENT_MAX) {
      setError(`Заголовок до ${TITLE_MAX} символов, заметка до ${CONTENT_MAX} символов.`);
      return;
    }
    try {
      const res = await axios.post('http://localhost:8000/notes/', { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes([res.data, ...notes]);
      setTitle('');
      setContent('');
    } catch {
      setError('Ошибка добавления заметки.');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#f7f7fa', padding: 40, borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', color: '#222', minHeight: '80vh' }}>
      <h2 style={{ textAlign: 'center', color: '#23232b', fontSize: 32, marginBottom: 24 }}>Мои заметки</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 32 }}>
        <Input placeholder="Заголовок" value={title} onChange={e => setTitle(e.target.value)} required maxLength={TITLE_MAX} />
        <div style={{ height: 8 }} />
        <textarea placeholder="Текст заметки" value={content} onChange={e => setContent(e.target.value)} required maxLength={CONTENT_MAX} style={{ width: '100%', minHeight: 60, borderRadius: 4, border: '1px solid #ccc', padding: 8, fontSize: 16, resize: 'vertical', marginBottom: 8, color: '#222', background: '#fff' }} />
        <div style={{ height: 8 }} />
        <Button type="submit">Добавить</Button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {notes.map(note => (
        <NoteCard key={note.id} {...note} />
      ))}
    </div>
  );
} 