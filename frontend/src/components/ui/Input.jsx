import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable text input primitive with an optional label, leading icon
 * (a lucide-react component), and inline error message.
 */
const Input = forwardRef(
  ({ label, icon: Icon, error, className, containerClassName, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-label-md font-semibold text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-outline pointer-events-none" />
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-11 rounded border bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline transition-colors outline-none',
              'focus:border-primary-container focus:ring-2 focus:ring-primary-fixed',
              Icon ? 'pl-10 pr-3' : 'px-3',
              error ? 'border-error focus:border-error focus:ring-error-container' : 'border-brand-line',
              className
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />
        </div>
        {error && <span className="text-body-sm text-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
