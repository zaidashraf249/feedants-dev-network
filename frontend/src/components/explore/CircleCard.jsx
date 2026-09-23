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
    <div className="card-surface p-space-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'w-11 h-11 rounded-lg flex items-center justify-center text-on-primary font-bold text-lg',
            CIRCLE_DOT_COLORS[circle.category] || 'bg-slate-400'
          )}
        >
          {circle.name?.[0]}
        </div>
        <Badge variant="outline">{circle.category}</Badge>
      </div>

      <div>
        <Link to={`/explore?circle=${circleId}`} className="font-semibold text-title-md text-on-surface hover:underline">
          {circle.name}
        </Link>
        <p className="text-body-sm text-brand-slate mt-1 line-clamp-2">{circle.description}</p>
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="flex items-center gap-1.5 text-body-sm text-brand-slate">
          <Users className="w-4 h-4" />
          {formatCompactNumber(circle.memberCount || 0)} members
        </span>
        <Button
          size="sm"
          variant={circle.isJoined ? 'secondary' : 'primary'}
          isLoading={isLoading}
          onClick={handleJoin}
        >
          {circle.isJoined ? 'Joined' : 'Join'}
        </Button>
      </div>
    </div>
  );
};

export default CircleCard;
