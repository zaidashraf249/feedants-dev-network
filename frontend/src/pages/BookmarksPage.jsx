import { useMemo } from 'react';
import { useGetPostsQuery } from '../store/api/postsApi';
import PostCard from '../components/feed/PostCard';
import { CenteredSpinner } from '../components/ui/Spinner';
import useAuth from '../hooks/useAuth';

const BookmarksPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useGetPostsQuery({ page: 1, limit: 50 });

  const savedPosts = useMemo(() => {
    return (data?.data || []).filter((p) => p.isBookmarked === true);
  }, [data]);

  if (isLoading) return <CenteredSpinner label="Loading your saved posts…" />;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-headline-sm font-bold">Saved posts</h1>
      {savedPosts.length === 0 ? (
        <div className="card-surface p-8 text-center text-brand-slate">
          Nothing saved yet — tap the bookmark icon on any post to keep it here.
        </div>
      ) : (
        savedPosts.map((post) => <PostCard key={post._id || post.id} post={post} />)
      )}
    </div>
  );
};

export default BookmarksPage;
