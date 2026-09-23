import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LayoutWrapper from './components/common/LayoutWrapper';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import BookmarksPage from './pages/BookmarksPage';
import NotFoundPage from './pages/NotFoundPage';
import useTheme from './hooks/useTheme';
import { registerUnauthorizedHandler } from './services/axiosInstance';
import { clearCredentials } from './store/slices/authSlice';

function App() {
  useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Any 401 response anywhere in the app (expired/invalid token) clears
  // local credentials and sends the user back to sign in.
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      dispatch(clearCredentials());
      navigate('/auth');
    });
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/*"
        element={
          <LayoutWrapper>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <BookmarksPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </LayoutWrapper>
        }
      />
    </Routes>
  );
}

export default App;
