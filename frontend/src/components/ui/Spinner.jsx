import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Spinner = ({ className, size = 24 }) => (
  <Loader2 className={cn('animate-spin text-primary-container', className)} size={size} />
);

export const CenteredSpinner = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-brand-slate">
    <Spinner size={28} />
    <span className="text-body-sm">{label}</span>
  </div>
);

export const SkeletonLine = ({ className }) => (
  <div className={cn('h-3 rounded bg-surface-container animate-pulse', className)} />
);

export const PostCardSkeleton = () => (
  <div className="card-surface p-space-md flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonLine className="w-1/3" />
        <SkeletonLine className="w-1/4" />
      </div>
    </div>
    <SkeletonLine className="w-full" />
    <SkeletonLine className="w-5/6" />
    <div className="h-28 rounded-lg bg-surface-container animate-pulse" />
  </div>
);

export default Spinner;
