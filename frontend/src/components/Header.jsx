import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setTheme } from '../store';
import Button from './Button/Button';
import { useEffect } from 'react';

export default function Header() {
  const username = useSelector(state => state.user.username);
  const theme = useSelector(state => state.theme.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleThemeChange = (e) => {
    dispatch(setTheme(e.target.value));
    // Применяем тему к html
    if (e.target.value === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', e.target.value);
    }
  };

  useEffect(() => {
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: 'var(--bg)', color: 'var(--text)', marginBottom: 32 }}>
      <div style={{ marginRight: 40 }}>
        <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 'bold', fontSize: 24 }}>DearDiary</Link>
      </div>
      <nav style={{ display: 'flex', gap: 24 }}>
        <Link to="/diary" style={{ color: 'var(--text)', textDecoration: 'none' }}>Мои заметки</Link>
        <Link to="/users" style={{ color: 'var(--text)', textDecoration: 'none' }}>Пользователи</Link>
        {username && <Link to="/profile" style={{ color: 'var(--text)', textDecoration: 'none' }}>Профиль</Link>}
        {username && <Button onClick={handleLogout}>Выйти</Button>}
        <select value={theme} onChange={handleThemeChange} style={{ marginLeft: 16, borderRadius: 6, padding: '4px 8px' }}>
          <option value="auto">Авто</option>
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
          <option value="strawberry">Клубничная</option>
          <option value="beach">Пляжная</option>
          <option value="club">Клубная</option>
        </select>
      </nav>
    </header>
  );
} 