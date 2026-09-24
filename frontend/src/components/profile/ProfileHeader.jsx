import { useDispatch } from 'react-redux';
import { BadgeCheck, Link2, MapPin } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';
import { useToggleFollowUserMutation } from '../../store/api/usersApi';
import { openAuthModal } from '../../store/slices/uiSlice';

const ProfileHeader = ({ user, isOwnProfile, onEditClick }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [toggleFollow, { isLoading }] = useToggleFollowUserMutation();

  const handleFollow = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('signin'));
      return;
    }
    toggleFollow(user._id || user.id);
  };

  return (
    <div className="card-surface overflow-hidden w-full max-w-full">
      <div
        className="h-28 sm:h-36 md:h-48 bg-gradient-to-br from-primary-container via-tertiary-container to-secondary-container"
        style={user.coverImage ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />
      <div className="px-3 sm:px-space-md pb-3 sm:pb-space-md">
        <div className="flex flex-wrap sm:flex-nowrap items-end justify-between gap-3 -mt-8 sm:-mt-10">
          <div className="ring-4 ring-surface-container-lowest rounded-full shrink-0">
            <Avatar src={user.avatar} name={user.name} size="xl" />
          </div>
          <div className="pb-1 sm:pb-2 ml-auto sm:ml-0 shrink-0">
            {isOwnProfile ? (
              <Button variant="secondary" onClick={onEditClick} size="sm" className="sm:size-md">
                Edit profile
              </Button>
            ) : (
              <Button variant={user.isFollowing ? 'secondary' : 'primary'} isLoading={isLoading} onClick={handleFollow} size="sm" className="sm:size-md">
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 w-full">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-title-lg sm:text-headline-sm font-bold text-on-surface break-words max-w-full">{user.name}</h1>
            {user.verified && <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary-container shrink-0" />}
          </div>
          <p className="text-body-sm sm:text-body-md text-brand-slate truncate">@{user.username}</p>
          {user.title && <p className="text-body-sm sm:text-body-md text-on-surface mt-1 break-words">{user.title}</p>}
          {user.bio && <p className="text-body-sm sm:text-body-md text-brand-slate mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{user.bio}</p>}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-body-xs sm:text-body-sm text-brand-slate w-full">
            {user.location && (
              <span className="flex items-center gap-1 truncate max-w-full">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-primary-container hover:underline truncate max-w-full"
              >
                <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;