// import { useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useGetUserProfileQuery } from '../store/api/usersApi';
// import { useGetPostsQuery } from '../store/api/postsApi';
// import ProfileHeader from '../components/profile/ProfileHeader';
// import StatsStrip from '../components/profile/StatsStrip';
// import TechStackBadges from '../components/profile/TechStackBadges';
// import PostCard from '../components/feed/PostCard';
// import { CenteredSpinner } from '../components/ui/Spinner';
// import { setProfileTab } from '../store/slices/uiSlice';
// import { PROFILE_TABS } from '../utils/constants';
// import { cn } from '../utils/cn';
// import useAuth from '../hooks/useAuth';

// const ProfilePage = () => {
//   const { username } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user: authUser } = useAuth();
//   const activeTab = useSelector((state) => state.ui.profileTab);

//   const { data, isLoading, error } = useGetUserProfileQuery(username);
//   const { data: allPostsData } = useGetPostsQuery({ page: 1, limit: 50 }, { skip: activeTab !== 'saved' });

//   const isOwnProfile = authUser?.username === username;

//   const posts = data?.posts || [];
//   const codeSnippetPosts = useMemo(() => posts.filter((p) => p.codeSnippet?.code), [posts]);
//   const savedPosts = useMemo(() => {
//     if (!isOwnProfile || !authUser?.bookmarks) return [];
//     const bookmarkIds = new Set(authUser.bookmarks.map(String));
//     return (allPostsData?.data || []).filter((p) => bookmarkIds.has(String(p._id || p.id)));
//   }, [allPostsData, authUser, isOwnProfile]);

//   if (isLoading) return <CenteredSpinner label="Loading profile…" />;

//   if (error || !data?.user) {
//     return (
//       <div className="card-surface p-8 text-center">
//         <p className="text-title-md font-semibold">User not found</p>
//         <p className="text-body-sm text-brand-slate mt-1">The profile @{username} doesn't exist.</p>
//       </div>
//     );
//   }

//   const { user, stats } = data;

//   const tabContent = {
//     posts: posts.length ? posts.map((p) => <PostCard key={p._id || p.id} post={p} />) : (
//       <EmptyState message="No posts yet." />
//     ),
//     snippets: codeSnippetPosts.length ? codeSnippetPosts.map((p) => <PostCard key={p._id || p.id} post={p} />) : (
//       <EmptyState message="No code snippets shared yet." />
//     ),
//     saved: savedPosts.length ? savedPosts.map((p) => <PostCard key={p._id || p.id} post={p} />) : (
//       <EmptyState message="Bookmark posts to find them here later." />
//     ),
//   };

//   return (
//     <div className="max-w-2xl mx-auto flex flex-col gap-4">
//       <ProfileHeader user={user} isOwnProfile={isOwnProfile} onEditClick={() => navigate('/settings')} />
//       <StatsStrip stats={stats} />

//       {user.techStack?.length > 0 && (
//         <div className="card-surface p-space-md">
//           <h3 className="text-title-md font-bold mb-2">Tech stack</h3>
//           <TechStackBadges techStack={user.techStack} />
//         </div>
//       )}

//       <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1 w-fit">
//         {PROFILE_TABS.map((tab) => (
//           <button
//             key={tab.id}
//             type="button"
//             onClick={() => dispatch(setProfileTab(tab.id))}
//             className={cn(
//               'px-3.5 py-1.5 rounded-md text-body-sm font-semibold transition-all',
//               activeTab === tab.id
//                 ? 'bg-surface-container-lowest shadow-level1 text-primary-container'
//                 : 'text-brand-slate hover:text-on-surface'
//             )}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       <div className="flex flex-col gap-4">{tabContent[activeTab]}</div>
//     </div>
//   );
// };

// const EmptyState = ({ message }) => (
//   <div className="card-surface p-8 text-center text-brand-slate">{message}</div>
// );

// export default ProfilePage;



import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserProfileQuery } from '../store/api/usersApi';
import { useGetPostsQuery } from '../store/api/postsApi';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsStrip from '../components/profile/StatsStrip';
import TechStackBadges from '../components/profile/TechStackBadges';
import PostCard from '../components/feed/PostCard';
import { CenteredSpinner } from '../components/ui/Spinner';
import { setProfileTab } from '../store/slices/uiSlice';
import { PROFILE_TABS } from '../utils/constants';
import { cn } from '../utils/cn';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const activeTab = useSelector((state) => state.ui.profileTab);

  const { data: response, isLoading, error } = useGetUserProfileQuery(username);
  const profile = response?.data;
  const { data: allPostsData } = useGetPostsQuery({ page: 1, limit: 50 }, { skip: activeTab !== 'saved' });

  const isOwnProfile = authUser?.username === username;

  const posts = profile?.posts || [];
  const codeSnippetPosts = useMemo(() => posts.filter((p) => p.codeSnippet?.code), [posts]);
  const savedPosts = useMemo(() => {
    if (!isOwnProfile || !authUser?.bookmarks) return [];
    const bookmarkIds = new Set(authUser.bookmarks.map(String));
    return (allPostsData?.data || []).filter((p) => bookmarkIds.has(String(p._id || p.id)));
  }, [allPostsData, authUser, isOwnProfile]);

  if (isLoading) return <CenteredSpinner label="Loading profile…" />;

  if (error || !profile?.user) {
    return (
      <div className="card-surface p-6 sm:p-8 text-center max-w-2xl mx-auto w-full">
        <p className="text-title-md font-semibold">User not found</p>
        <p className="text-body-sm text-brand-slate mt-1">The profile @{username} doesn't exist.</p>
      </div>
    );
  }

  const { user, stats } = profile;

  const tabContent = {
    posts: posts.length ? posts.map((p) => <PostCard key={p._id || p.id} post={p} />) : (
      <EmptyState message="No posts yet." />
    ),
    snippets: codeSnippetPosts.length ? codeSnippetPosts.map((p) => <PostCard key={p._id || p.id} post={p} />) : (
      <EmptyState message="No code snippets shared yet." />
    ),
    saved: savedPosts.length ? savedPosts.map((p) => <PostCard key={p._id || p.id} post={p} />) : (
      <EmptyState message="Bookmark posts to find them here later." />
    ),
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 w-full overflow-hidden">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} onEditClick={() => navigate('/settings')} />
      <StatsStrip stats={stats} />

      {user.techStack?.length > 0 && (
        <div className="card-surface p-3.5 sm:p-space-md w-full">
          <h3 className="text-title-md font-bold mb-2">Tech stack</h3>
          <TechStackBadges techStack={user.techStack} />
        </div>
      )}

      <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1 w-full sm:w-fit overflow-x-auto no-scrollbar">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => dispatch(setProfileTab(tab.id))}
            className={cn(
              'flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md text-body-sm font-semibold transition-all whitespace-nowrap text-center',
              activeTab === tab.id
                ? 'bg-surface-container-lowest shadow-level1 text-primary-container'
                : 'text-brand-slate hover:text-on-surface'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full">{tabContent[activeTab]}</div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="card-surface p-6 sm:p-8 text-center text-brand-slate text-body-sm sm:text-body-md">{message}</div>
);

export default ProfilePage;