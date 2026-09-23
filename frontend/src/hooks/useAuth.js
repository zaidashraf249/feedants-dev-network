import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '../store/api/authApi';
import {
  setCredentials,
  clearCredentials,
  selectCurrentUser,
  selectIsAuthenticated,
} from '../store/slices/authSlice';
import { closeAuthModal } from '../store/slices/uiSlice';

/**
 * Central hook for auth actions and state. Components should use this
 * instead of touching the auth slice or authApi endpoints directly.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [loginMutation, loginState] = useLoginMutation();
  const [registerMutation, registerState] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(
    async (credentials) => {
      const response = await loginMutation(credentials).unwrap();
      dispatch(setCredentials(response.data));
      dispatch(closeAuthModal());
      return response;
    },
    [loginMutation, dispatch]
  );

  const register = useCallback(
    async (details) => {
      const response = await registerMutation(details).unwrap();
      dispatch(setCredentials(response.data));
      dispatch(closeAuthModal());
      return response;
    },
    [registerMutation, dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Even if the server call fails, clear local credentials
    }
    dispatch(clearCredentials());
    navigate('/');
  }, [logoutMutation, dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    isLoggingIn: loginState.isLoading,
    isRegistering: registerState.isLoading,
    loginError: loginState.error?.data?.message,
    registerError: registerState.error?.data?.message,
  };
};

export default useAuth;
