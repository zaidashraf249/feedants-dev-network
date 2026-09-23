import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT (if present) to every outgoing request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('feedants_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// A single place other modules (e.g. the auth slice) can subscribe to
// so a 401 anywhere in the app triggers one consistent logout flow.
let onUnauthorized = null;
export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-logout on 401s from protected endpoints.
    // A 401 from /auth/login or /auth/register means "wrong credentials" —
    // it must NOT wipe the token of an already-authenticated session.
    const isAuthEndpoint =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('feedants_token');
      localStorage.removeItem('feedants_user');
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
