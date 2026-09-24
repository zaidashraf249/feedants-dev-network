import { useDispatch, useSelector } from 'react-redux';
import { closeAuthModal, setAuthModalMode } from '../../store/slices/uiSlice';
import Modal from '../ui/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { cn } from '../../utils/cn';

const AuthModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isAuthModalOpen);
  const mode = useSelector((state) => state.ui.authModalMode);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeAuthModal())}
      title="Sign in to Feedants"
      className="w-[calc(100vw-24px)] max-w-[420px] mx-auto overflow-hidden"
    >
      <div className="p-4 sm:p-space-lg w-full max-w-full">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <span className="w-8 h-8 rounded-md bg-primary-container flex items-center justify-center text-on-primary font-bold text-lg shrink-0">
            F
          </span>
          <span className="text-title-md font-bold text-on-surface truncate">Feedants</span>
        </div>

        <div className="flex bg-surface-container rounded-lg p-1 mb-5 sm:mb-6 w-full">
          {['signin', 'signup'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => dispatch(setAuthModalMode(tab))}
              className={cn(
                'flex-1 py-2 rounded-md text-body-md sm:text-title-md font-semibold transition-all text-center',
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