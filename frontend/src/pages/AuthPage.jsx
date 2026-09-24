import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Github, Lock, Shield, Zap } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { setAuthModalMode } from '../store/slices/uiSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { cn } from '../utils/cn';

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.ui.authModalMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-3 sm:px-4 overflow-hidden bg-surface">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[300px] sm:w-[720px] h-[300px] sm:h-[450px] bg-gradient-to-tr from-primary-container/15 via-surface-container-high/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-24 left-1/3 w-[250px] sm:w-[500px] h-[200px] sm:h-[360px] bg-gradient-to-bl from-primary-fixed/20 via-transparent to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="w-full max-w-md flex flex-col items-center">
        <span className="text-label-sm font-semibold px-3 py-1 rounded-full bg-primary-fixed text-primary-container normal-case mb-4">
          Developer Platform v2.4
        </span>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-9 h-9 rounded-md bg-primary-container flex items-center justify-center text-on-primary font-bold text-xl">
            F
          </span>
          <span className="text-title-md font-bold text-on-surface">Feedants</span>
        </div>
        <h1 className="text-title-lg sm:text-headline-md text-center font-bold text-on-surface tracking-tight px-2">
          {mode === 'signin' ? 'Welcome back to Feedants' : 'Create your developer account'}
        </h1>
        <p className="text-body-sm sm:text-body-md text-brand-slate text-center mt-2 max-w-xs sm:max-w-sm">
          The home for technical writers, creators, and engineering builders.
        </p>

        <div className="w-full card-surface mt-6 sm:mt-8 p-4 sm:p-space-lg">
          <div className="flex bg-surface-container rounded-lg p-1 mb-6">
            {['signin', 'signup'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => dispatch(setAuthModalMode(tab))}
                className={cn(
                  'flex-1 py-2 rounded-md text-body-md sm:text-title-md font-semibold transition-all',
                  mode === tab ? 'bg-surface-container-lowest shadow-level1 text-primary-container' : 'text-brand-slate'
                )}
              >
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              className="h-10 flex items-center justify-center gap-2 rounded border border-brand-line text-body-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors opacity-70 cursor-not-allowed w-full"
              disabled
            >
              <Github className="w-4 h-4" /> GitHub
            </button>
            <button
              type="button"
              className="h-10 flex items-center justify-center gap-2 rounded border border-brand-line text-body-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors opacity-70 cursor-not-allowed w-full"
              disabled
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z" />
                <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.93z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-brand-line" />
            <span className="text-body-xs sm:text-body-sm text-outline whitespace-nowrap">or continue with email</span>
            <div className="flex-1 h-px bg-brand-line" />
          </div>

          {mode === 'signin' ? <LoginForm /> : <RegisterForm />}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-brand-slate">
          <span className="flex items-center gap-1.5 text-body-xs sm:text-body-sm">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> SOC-2 Type II
          </span>
          <span className="flex items-center gap-1.5 text-body-xs sm:text-body-sm">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 256-bit TLS
          </span>
          <span className="flex items-center gap-1.5 text-body-xs sm:text-body-sm">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 99.99% Uptime
          </span>
        </div>

        <div className="flex items-center gap-4 mt-4 text-body-xs sm:text-body-sm text-outline">
          <Link to="/" className="hover:text-primary-container">
            Privacy Policy
          </Link>
          <Link to="/" className="hover:text-primary-container">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;