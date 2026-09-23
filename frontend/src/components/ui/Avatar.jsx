import { useState } from 'react';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-label-md',
  lg: 'w-16 h-16 text-headline-sm',
  xl: 'w-24 h-24 text-headline-md',
};

/**
 * Circular avatar with graceful fallback to initials-on-gradient when
 * no image is available or the image fails to load.
 */
const Avatar = ({ src, name = '', size = 'md', online = false, ring = true, className }) => {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <div className={cn('relative shrink-0', SIZE_CLASSES[size], className)}>
      {showImage ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setErrored(true)}
          className={cn(
            'w-full h-full rounded-full object-cover bg-surface-container',
            ring && 'ring-4 ring-surface-container-lowest'
          )}
        />
      ) : (
        <div
          className={cn(
            'w-full h-full rounded-full flex items-center justify-center font-bold text-on-primary bg-gradient-to-br from-primary-container to-tertiary-container',
            ring && 'ring-4 ring-surface-container-lowest'
          )}
        >
          {getInitials(name) || '?'}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-1/4 h-1/4 min-w-[10px] min-h-[10px] bg-emerald-500 rounded-full ring-2 ring-surface-container-lowest" />
      )}
    </div>
  );
};

export default Avatar;
