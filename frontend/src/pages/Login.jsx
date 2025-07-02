import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/token', new URLSearchParams({
        username,
        password,
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      dispatch(setUser({ token: res.data.access_token, username }));
      navigate('/diary');
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 320, margin: '40px auto' }}>
      <h2>Вход</h2>
      <Input placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} required />
      <div style={{ height: 12 }} />
      <Input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
      <div style={{ height: 12 }} />
      <Button type="submit">Войти</Button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
} 