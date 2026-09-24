// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { AtSign, Lock, Mail, User } from 'lucide-react';
// import Input from '../ui/Input';
// import Button from '../ui/Button';
// import useAuth from '../../hooks/useAuth';
// import { validateRegisterForm, getPasswordStrength } from '../../utils/validation';
// import { setAuthModalMode } from '../../store/slices/uiSlice';
// import { cn } from '../../utils/cn';
// import { AtSign, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

// const RegisterForm = () => {
//   const dispatch = useDispatch();
//   const { register, isRegistering, registerError } = useAuth();
//   const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [submitError, setSubmitError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);


//   const strength = getPasswordStrength(form.password);

//   const handleChange = (field) => (e) => {
//     let value = e.target.value;
//     if (field === 'username') value = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
//     setForm((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateRegisterForm(form);
//     if (Object.keys(validationErrors).length) {
//       setErrors(validationErrors);
//       return;
//     }
//     setSubmitError('');
//     try {
//       await register(form);
//     } catch (err) {
//       setSubmitError(err?.data?.message || 'Unable to create your account. Please try again.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//       <Input
//         label="Full name"
//         icon={User}
//         placeholder="Sarah Lin"
//         value={form.name}
//         onChange={handleChange('name')}
//         error={errors.name}
//         autoComplete="name"
//       />
//       <Input
//         label="Username"
//         icon={AtSign}
//         placeholder="sarahlin"
//         value={form.username}
//         onChange={handleChange('username')}
//         error={errors.username}
//         autoComplete="username"
//       />
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
//       <div>
//         <Input
//           label="Password"
//           type={showPassword ? 'text' : 'password'}
//           icon={Lock}
//           placeholder="At least 8 characters"
//           value={form.password}
//           onChange={handleChange('password')}
//           error={errors.password}
//           autoComplete="new-password"
//         />
//         {form.password && (
//           <div className="mt-2">
//             <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
//               <div
//                 className={cn('h-full transition-all duration-300', strength.colorClass)}
//                 style={{ width: `${strength.percent}%` }}
//               />
//             </div>
//             <p className="text-body-sm text-brand-slate mt-1">{strength.label} password</p>
//           </div>
//         )}
//       </div>

//       {(submitError || registerError) && (
//         <p className="text-body-sm text-error bg-error-container/30 rounded px-3 py-2">
//           {submitError || registerError}
//         </p>
//       )}

//       <Button type="submit" size="lg" isLoading={isRegistering} className="mt-1 w-full">
//         Create account
//       </Button>

//       <p className="text-body-sm text-center text-brand-slate">
//         Already have an account?{' '}
//         <button
//           type="button"
//           className="text-primary-container font-semibold hover:underline"
//           onClick={() => dispatch(setAuthModalMode('signin'))}
//         >
//           Sign in
//         </button>
//       </p>
//     </form>
//   );
// };

// export default RegisterForm;


import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AtSign, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';
import {
  validateRegisterForm,
  getPasswordStrength,
} from '../../utils/validation';
import { setAuthModalMode } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { register, isRegistering, registerError } = useAuth();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === 'username') {
      value = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(form);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitError('');

    try {
      await register(form);
    } catch (err) {
      setSubmitError(
        err?.data?.message ||
          'Unable to create your account. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 w-full">
      <Input
        label="Full name"
        icon={User}
        placeholder="Sarah Lin"
        value={form.name}
        onChange={handleChange('name')}
        error={errors.name}
        autoComplete="name"
      />

      <Input
        label="Username"
        icon={AtSign}
        placeholder="sarahlin"
        value={form.username}
        onChange={handleChange('username')}
        error={errors.username}
        autoComplete="username"
      />

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

      <div className="w-full">
        <div className="relative w-full">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            autoComplete="new-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[34px] p-1 z-10 text-brand-slate hover:text-primary-container transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {form.password && (
          <div className="mt-2 w-full">
            <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  strength.colorClass
                )}
                style={{ width: `${strength.percent}%` }}
              />
            </div>

            <p className="text-body-xs sm:text-body-sm text-brand-slate mt-1">
              {strength.label} password
            </p>
          </div>
        )}
      </div>

      {(submitError || registerError) && (
        <p className="text-body-xs sm:text-body-sm text-error bg-error-container/30 rounded px-3 py-2 break-words">
          {submitError || registerError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isRegistering}
        className="mt-1 w-full justify-center"
      >
        Create account
      </Button>

      <p className="text-body-xs sm:text-body-sm text-center text-brand-slate mt-1">
        Already have an account?{' '}
        <button
          type="button"
          className="text-primary-container font-semibold hover:underline"
          onClick={() => dispatch(setAuthModalMode('signin'))}
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;