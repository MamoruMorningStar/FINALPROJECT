import { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:8000/register', { username, password });
      setSuccess('Регистрация успешна! Теперь войдите.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Ошибка регистрации. Возможно, пользователь уже существует.');
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 320, margin: '40px auto' }}>
      <h2>Регистрация</h2>
      <Input placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} required />
      <div style={{ height: 12 }} />
      <Input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
      <div style={{ height: 12 }} />
      <Button type="submit">Зарегистрироваться</Button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </form>
  );
} 