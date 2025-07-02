import { createBrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Diary from './pages/Diary';
import AdminPanel from './pages/AdminPanel';
import Users from './pages/Users';
import UserNotes from './pages/UserNotes';
import Profile from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'diary', element: <Diary /> },
      { path: 'admin', element: <AdminPanel /> },
      { path: 'users', element: <Users /> },
      { path: 'users/:id', element: <UserNotes /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
]); 