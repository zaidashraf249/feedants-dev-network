import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPostsQuery } from '../store/api/postsApi';
import { useGetCreatorsQuery } from '../store/api/usersApi';
import { useGetCirclesQuery } from '../store/api/circlesApi';
import PostComposer from '../components/feed/PostComposer';
import PostCard from '../components/feed/PostCard';
import { PostCardSkeleton } from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { Link } from 'react-router-dom';
import { setFeedFilter } from '../store/slices/uiSlice';
import { FEED_FILTERS } from '../utils/constants';
import { cn } from '../utils/cn';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const feedFilter = useSelector((state) => state.ui.feedFilter);
  const [page, setPage] = useState(1);

  const queryArgs = useMemo(() => {
    if (feedFilter === 'following' && isAuthenticated) {
      return { page, limit: 8, author: undefined };
    }
    return { page, limit: 8 };
  }, [page, feedFilter, isAuthenticated]);

  const { data, isLoading, isFetching } = useGetPostsQuery(queryArgs);
  const { data: creatorsData } = useGetCreatorsQuery(8);
  const { data: circlesData } = useGetCirclesQuery();

  const posts = data?.data || [];
  const hasMore = data?.pagination ? data.pagination.page < data.pagination.pages : false;

  const handleFilterChange = (id) => {
    dispatch(setFeedFilter(id));
    setPage(1);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full max-w-full overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <PostComposer />

        <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1 w-full sm:w-fit overflow-x-auto no-scrollbar">
          {FEED_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => handleFilterChange(filter.id)}
              className={cn(
                'flex-1 sm:flex-initial px-3.5 py-1.5 rounded-md text-body-sm font-semibold transition-all whitespace-nowrap text-center',
                feedFilter === filter.id
                  ? 'bg-surface-container-lowest shadow-level1 text-primary-container'
                  : 'text-brand-slate hover:text-on-surface'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="card-surface p-6 sm:p-8 text-center text-brand-slate text-body-sm sm:text-body-md">
            No posts yet. Be the first to share something with the community.
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {posts.map((post) => (
              <PostCard key={post._id || post.id} post={post} />
            ))}
          </div>
        )}

        {hasMore && (
          <Button
            variant="secondary"
            isLoading={isFetching && page > 1}
            onClick={() => setPage((p) => p + 1)}
            className="self-center mt-2 w-full sm:w-auto"
          >
            Load more
          </Button>
        )}
      </div>

      <aside className="hidden xl:flex xl:w-72 shrink-0 flex-col gap-4">
        <div className="card-surface p-space-md">
          <h3 className="text-title-md font-bold mb-3">Creators to follow</h3>
          <div className="flex flex-col gap-3">
            {(creatorsData?.data || []).slice(0, 4).map((creator) => (
              <Link key={creator._id || creator.id} to={`/profile/${creator.username}`} className="flex items-center gap-2.5 min-w-0">
                <Avatar src={creator.avatar} name={creator.name} size="sm" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-semibold truncate">{creator.name}</p>
                  <p className="text-body-sm text-brand-slate truncate">@{creator.username}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/explore" className="block mt-3 text-body-sm font-semibold text-primary-container hover:underline">
            See more creators →
          </Link>
        </div>

        <div className="card-surface p-space-md">
          <h3 className="text-title-md font-bold mb-3">Popular circles</h3>
          <div className="flex flex-col gap-2.5">
            {(circlesData?.data || []).slice(0, 4).map((circle) => (
              <Link
                key={circle._id || circle.id}
                to={`/explore?circle=${circle._id || circle.id}`}
                className="text-body-sm text-brand-slate hover:text-primary-container truncate"
              >
                {circle.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default HomePage;