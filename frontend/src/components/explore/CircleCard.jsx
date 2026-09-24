import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import useAuth from '../../hooks/useAuth';
import { useToggleJoinCircleMutation } from '../../store/api/circlesApi';
import { openAuthModal } from '../../store/slices/uiSlice';
import { formatCompactNumber } from '../../utils/formatters';
import { CIRCLE_DOT_COLORS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const CircleCard = ({ circle }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [toggleJoin, { isLoading }] = useToggleJoinCircleMutation();

  const circleId = circle._id || circle.id;

  const handleJoin = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('signin'));
      return;
    }
    toggleJoin(circleId);
  };

  return (
    <div className="card-surface p-3.5 sm:p-space-md flex flex-col justify-between gap-3 w-full max-w-full overflow-hidden">
      <div className="flex flex-col gap-3">
        {/* Top bar: Avatar & Category Badge Fix */}
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div
            className={cn(
              'w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center text-on-primary font-bold text-md sm:text-lg shrink-0',
              CIRCLE_DOT_COLORS[circle.category] || 'bg-slate-400'
            )}
          >
            {circle.name?.[0]}
          </div>

          <div className="min-w-0 flex-1 flex justify-end">
            <Badge 
              variant="outline" 
              className="truncate max-w-full text-[10px] sm:text-label-sm px-2 py-0.5 text-right uppercase tracking-wider"
              title={circle.category}
            >
              <span className="truncate">{circle.category}</span>
            </Badge>
          </div>
        </div>

        <div>
          <Link to={`/explore?circle=${circleId}`} className="font-semibold text-title-md text-on-surface hover:underline line-clamp-1 break-words">
            {circle.name}
          </Link>
          <p className="text-body-sm text-brand-slate mt-1 line-clamp-2 break-words [overflow-wrap:anywhere]">{circle.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-1 pt-1">
        <span className="flex items-center gap-1.5 text-body-xs sm:text-body-sm text-brand-slate truncate">
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">{formatCompactNumber(circle.memberCount || 0)} members</span>
        </span>
        <Button
          size="sm"
          variant={circle.isJoined ? 'secondary' : 'primary'}
          isLoading={isLoading}
          onClick={handleJoin}
          className="shrink-0"
        >
          {circle.isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </div>
  );
};

export default CircleCard;