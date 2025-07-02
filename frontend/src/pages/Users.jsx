import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Ошибка загрузки пользователей.'));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#f7f7fa', padding: 40, borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', color: '#222', minHeight: '60vh' }}>
      <h2 style={{ textAlign: 'center', color: '#23232b', fontSize: 32, marginBottom: 24 }}>Пользователи</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(user => (
          <li key={user.id} style={{ marginBottom: 16, fontSize: 20 }}>
            <Link to={`/users/${user.id}`} style={{ color: '#4e54c8', textDecoration: 'none' }}>
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 