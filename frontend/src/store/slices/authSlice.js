import { createSlice } from '@reduxjs/toolkit';

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem('feedants_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: loadStoredUser(),
  token: localStorage.getItem('feedants_token') || null,
  isAuthenticated: Boolean(localStorage.getItem('feedants_token')),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('feedants_token', token);
      localStorage.setItem('feedants_user', JSON.stringify(user));
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('feedants_user', JSON.stringify(state.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('feedants_token');
      localStorage.removeItem('feedants_user');
    },
  },
});

export const { setCredentials, updateUser, clearCredentials } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
