// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { Lock, Mail } from 'lucide-react';
// import Input from '../ui/Input';
// import Button from '../ui/Button';
// import useAuth from '../../hooks/useAuth';
// import { validateLoginForm } from '../../utils/validation';
// import { setAuthModalMode } from '../../store/slices/uiSlice';

// const LoginForm = () => {
//   const dispatch = useDispatch();
//   const { login, isLoggingIn, loginError } = useAuth();
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [submitError, setSubmitError] = useState('');

//   const handleChange = (field) => (e) => {
//     setForm((prev) => ({ ...prev, [field]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateLoginForm(form);
//     if (Object.keys(validationErrors).length) {
//       setErrors(validationErrors);
//       return;
//     }
//     setSubmitError('');
//     try {
//       await login(form);
//     } catch (err) {
//       setSubmitError(err?.data?.message || 'Unable to sign in. Please check your credentials.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//       <Input
//         label="Email"
//         type="email"
//         icon={Mail}
//         placeholder="you@company.com"
//         value={form.email}
//         onChange={handleChange('email')}
//         error={errors.email}
//         autoComplete="email"
//       />
//       <Input
//         label="Password"
//         type="password"
//         icon={Lock}
//         placeholder="••••••••"
//         value={form.password}
//         onChange={handleChange('password')}
//         error={errors.password}
//         autoComplete="current-password"
//       />

//       {(submitError || loginError) && (
//         <p className="text-body-sm text-error bg-error-container/30 rounded px-3 py-2">
//           {submitError || loginError}
//         </p>
//       )}

//       <Button type="submit" size="lg" isLoading={isLoggingIn} className="mt-1 w-full">
//         Sign in
//       </Button>

//       <p className="text-body-sm text-center text-brand-slate">
//         New to Feedants?{' '}
//         <button
//           type="button"
//           className="text-primary-container font-semibold hover:underline"
//           onClick={() => dispatch(setAuthModalMode('signup'))}
//         >
//           Create an account
//         </button>
//       </p>

//       <p className="text-body-sm text-center text-outline">
//         Demo login: <span className="font-mono">sarah@feedants.dev</span> / <span className="font-mono">Feedants@123</span>
//       </p>
//     </form>
//   );
// };

// export default LoginForm;



import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';
import { validateLoginForm } from '../../utils/validation';
import { setAuthModalMode } from '../../store/slices/uiSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { login, isLoggingIn, loginError } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(form);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError('');

    try {
      await login(form);
    } catch (err) {
      setSubmitError(
        err?.data?.message ||
          'Unable to sign in. Please check your credentials.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        icon={Mail}
        placeholder="you@company.com"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
        autoComplete="email"
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="current-password"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-10 text-brand-slate hover:text-primary-container transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>

      {(submitError || loginError) && (
        <p className="text-body-sm text-error bg-error-container/30 rounded px-3 py-2">
          {submitError || loginError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isLoggingIn}
        className="mt-1 w-full"
      >
        Sign in
      </Button>

      <p className="text-body-sm text-center text-brand-slate">
        New to Feedants?{' '}
        <button
          type="button"
          className="text-primary-container font-semibold hover:underline"
          onClick={() => dispatch(setAuthModalMode('signup'))}
        >
          Create an account
        </button>
      </p>

      <p className="text-body-sm text-center text-outline">
        Demo login:{' '}
        <span className="font-mono">sarah@feedants.dev</span> /{' '}
        <span className="font-mono">Feedants@123</span>
      </p>
    </form>
  );
};

export default LoginForm;