import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';
import { useToggleFollowUserMutation } from '../../store/api/usersApi';
import { openAuthModal } from '../../store/slices/uiSlice';

const CreatorCard = ({ creator }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const [toggleFollow, { isLoading }] = useToggleFollowUserMutation();

  const creatorId = creator._id || creator.id;
  const isSelf = user && (user._id === creatorId || user.id === creatorId);

  const handleFollow = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('signin'));
      return;
    }
    toggleFollow(creatorId);
  };

  return (
    <div className="card-surface p-3.5 sm:p-space-md flex flex-col items-center text-center gap-2 w-full max-w-full overflow-hidden">
      <Link to={`/profile/${creator.username}`} className="shrink-0">
        <Avatar src={creator.avatar} name={creator.name} size="lg" />
      </Link>
      <Link to={`/profile/${creator.username}`} className="inline-flex items-center justify-center gap-1 font-semibold text-on-surface hover:underline max-w-full">
        <span className="truncate">{creator.name}</span>
        {creator.verified && <BadgeCheck className="w-4 h-4 text-primary-container shrink-0" />}
      </Link>
      <p className="text-body-xs sm:text-body-sm text-brand-slate line-clamp-1 max-w-full truncate">{creator.title || `@${creator.username}`}</p>

      {creator.techStack?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mt-1 w-full max-w-full">
          {creator.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="text-[11px] sm:text-label-sm font-medium px-1.5 sm:px-2 py-0.5 rounded bg-surface-container text-brand-slate normal-case truncate max-w-[100px]">
              {tech}
            </span>
          ))}
        </div>
      )}

      {!isSelf && (
        <Button
          size="sm"
          variant={creator.isFollowing ? 'secondary' : 'primary'}
          isLoading={isLoading}
          onClick={handleFollow}
          className="mt-2 w-full justify-center"
        >
          {creator.isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </div>
  );
};

export default CreatorCard;