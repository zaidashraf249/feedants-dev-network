import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  primary:
    'bg-primary-container text-on-primary hover:bg-tertiary shadow-md shadow-primary-container/20 active:scale-[0.99]',
  secondary:
    'bg-surface-container-lowest text-on-surface border border-brand-line hover:bg-surface-container-low hover:border-brand-border-tint',
  ghost: 'bg-transparent text-brand-slate hover:bg-primary-fixed hover:text-primary-container',
  danger: 'bg-error text-on-error hover:opacity-90 active:scale-[0.99]',
  link: 'bg-transparent text-primary-container hover:underline p-0 h-auto',
};

const SIZE_CLASSES = {
  sm: 'h-9 px-3 text-label-md gap-1.5',
  md: 'h-[42px] px-4 text-title-md gap-2',
  lg: 'h-12 px-6 text-title-md gap-2',
  icon: 'h-9 w-9 p-0 justify-center',
};

/**
 * Reusable primitive button. `variant` controls color treatment,
 * `size` controls dimensions, `isLoading` swaps in a spinner and
 * disables interaction.
 */
const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded font-semibold tracking-tight transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none',
        VARIANT_CLASSES[variant],
        variant !== 'link' && SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export default Button;
