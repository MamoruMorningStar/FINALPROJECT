import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: 60, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', background: '#f7f7fa', padding: 48, borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}>
      <h1 style={{ color: '#23232b', fontSize: 38, marginBottom: 18 }}>Добро пожаловать в DearDiary!</h1>
      <p style={{ color: '#444', fontSize: 22 }}>Ваш личный дневник для заметок и воспоминаний.</p>
      <div style={{ marginTop: 36 }}>
        <Link to="/login"><Button>Войти</Button></Link>
        <span style={{ margin: '0 8px' }}></span>
        <Link to="/register"><Button>Регистрация</Button></Link>
      </div>
    </div>
  );
} 