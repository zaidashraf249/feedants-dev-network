import { cn } from '../../utils/cn';

/**
 * Macro-container surface used for feed posts, sidebar modules, and
 * dashboard panels — 8px radius, Level 1 shadow, hover-to-Level-2 per
 * the Kinetic Indigo Precision design system.
 */
const Card = ({ className, hoverable = true, padded = true, children, ...props }) => (
  <div
    className={cn(
      'bg-surface-container-lowest rounded-xl border border-brand-line shadow-level1 transition-all duration-200',
      hoverable && 'hover:shadow-level2 hover:border-brand-border-tint',
      padded && 'p-space-md',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default Card;
