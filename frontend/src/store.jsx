import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

const userSlice = createSlice({
  name: 'user',
  initialState: { token: '', username: '' },
  reducers: {
    setUser(state, action) {
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    logout(state) {
      state.token = '';
      state.username = '';
    },
  },
});

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'auto';
  }
  return 'auto';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: { value: getInitialTheme() },
  reducers: {
    setTheme(state, action) {
      state.value = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export const { setTheme } = themeSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    theme: themeSlice.reducer,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector; 