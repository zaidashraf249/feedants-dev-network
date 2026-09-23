import { cn } from '../../utils/cn';

const VARIANT_CLASSES = {
  default: 'bg-surface-container text-brand-slate',
  primary: 'bg-primary-fixed text-primary-container',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-error-container text-on-error-container',
  outline: 'bg-transparent border border-brand-line text-brand-slate',
};

/**
 * Small pill/tag primitive used for role badges, status chips, and tags.
 */
const Badge = ({ variant = 'default', className, children, as: Comp = 'span', ...props }) => (
  <Comp
    className={cn(
      'inline-flex items-center gap-1 rounded px-2 py-0.5 text-label-sm font-semibold uppercase tracking-wider',
      VARIANT_CLASSES[variant],
      className
    )}
    {...props}
  >
    {children}
  </Comp>
);

export default Badge;
