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
    <div className="card-surface p-space-md flex flex-col items-center text-center gap-2">
      <Link to={`/profile/${creator.username}`}>
        <Avatar src={creator.avatar} name={creator.name} size="lg" />
      </Link>
      <Link to={`/profile/${creator.username}`} className="inline-flex items-center gap-1 font-semibold text-on-surface hover:underline">
        {creator.name}
        {creator.verified && <BadgeCheck className="w-4 h-4 text-primary-container" />}
      </Link>
      <p className="text-body-sm text-brand-slate line-clamp-1">{creator.title || `@${creator.username}`}</p>

      {creator.techStack?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          {creator.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="text-label-sm font-medium px-2 py-0.5 rounded bg-surface-container text-brand-slate normal-case">
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
          className="mt-2 w-full"
        >
          {creator.isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </div>
  );
};

export default CreatorCard;
