import { useDispatch, useSelector } from 'react-redux';
import { closeAuthModal, setAuthModalMode } from '../../store/slices/uiSlice';
import Modal from '../ui/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { cn } from '../../utils/cn';

/**
 * Global sign-in / sign-up dialog. Its open/closed state and active tab
 * live in the ui slice so any part of the app (a "Sign in" button, a
 * protected action) can trigger it via `dispatch(openAuthModal(...))`.
 */
const AuthModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isAuthModalOpen);
  const mode = useSelector((state) => state.ui.authModalMode);

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(closeAuthModal())} title="Sign in to Feedants" className="max-w-[420px]">
      <div className="p-space-lg">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-8 h-8 rounded-md bg-primary-container flex items-center justify-center text-on-primary font-bold text-lg">
            F
          </span>
          <span className="text-title-md font-bold text-on-surface">Feedants</span>
        </div>

        <div className="flex bg-surface-container rounded-lg p-1 mb-6">
          {['signin', 'signup'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => dispatch(setAuthModalMode(tab))}
              className={cn(
                'flex-1 py-2 rounded-md text-title-md font-semibold transition-all',
                mode === tab ? 'bg-surface-container-lowest shadow-level1 text-primary-container' : 'text-brand-slate'
              )}
            >
              {tab === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {mode === 'signin' ? <LoginForm /> : <RegisterForm />}
      </div>
    </Modal>
  );
};

export default AuthModal;
