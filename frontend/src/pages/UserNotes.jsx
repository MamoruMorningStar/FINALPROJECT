import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NoteCard from '../components/NoteCard/NoteCard';

export default function UserNotes() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/users/${id}`)
      .then(res => setUser(res.data))
      .catch(() => setError('Пользователь не найден.'));
    axios.get(`http://localhost:8000/users/${id}/notes`)
      .then(res => setNotes(res.data))
      .catch(() => setNotes([]));
  }, [id]);

  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!user) return <div style={{ textAlign: 'center', marginTop: 40 }}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#f7f7fa', padding: 40, borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', color: '#222', minHeight: '60vh' }}>
      <h2 style={{ textAlign: 'center', color: '#23232b', fontSize: 32, marginBottom: 24 }}>
        Заметки пользователя: {user.username}
      </h2>
      {notes.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>Нет заметок</div>}
      {notes.map(note => (
        <NoteCard key={note.id} {...note} />
      ))}
    </div>
  );
} 