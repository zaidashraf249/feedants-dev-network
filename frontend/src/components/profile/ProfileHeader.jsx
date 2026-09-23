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
    <div className="card-surface overflow-hidden">
      <div
        className="h-36 sm:h-48 bg-gradient-to-br from-primary-container via-tertiary-container to-secondary-container"
        style={user.coverImage ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />
      <div className="px-space-md pb-space-md">
        <div className="flex items-end justify-between -mt-10">
          <Avatar src={user.avatar} name={user.name} size="xl" />
          <div className="pb-2">
            {isOwnProfile ? (
              <Button variant="secondary" onClick={onEditClick}>
                Edit profile
              </Button>
            ) : (
              <Button variant={user.isFollowing ? 'secondary' : 'primary'} isLoading={isLoading} onClick={handleFollow}>
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <h1 className="text-headline-sm font-bold text-on-surface">{user.name}</h1>
            {user.verified && <BadgeCheck className="w-5 h-5 text-primary-container" />}
          </div>
          <p className="text-body-md text-brand-slate">@{user.username}</p>
          {user.title && <p className="text-body-md text-on-surface mt-1">{user.title}</p>}
          {user.bio && <p className="text-body-md text-brand-slate mt-2 whitespace-pre-wrap">{user.bio}</p>}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-body-sm text-brand-slate">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-primary-container hover:underline"
              >
                <Link2 className="w-4 h-4" /> {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
