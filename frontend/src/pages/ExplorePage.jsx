import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCirclesQuery } from '../store/api/circlesApi';
import { useGetCreatorsQuery } from '../store/api/usersApi';
import { useGetPostsQuery } from '../store/api/postsApi';
import TechRadarGrid from '../components/explore/TechRadarGrid';
import CircleCard from '../components/explore/CircleCard';
import CreatorCard from '../components/explore/CreatorCard';
import PostCard from '../components/feed/PostCard';
import { PostCardSkeleton } from '../components/ui/Spinner';
import { setExploreCategory } from '../store/slices/uiSlice';
import { EXPLORE_CATEGORIES } from '../utils/constants';
import { cn } from '../utils/cn';

const ExplorePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = useSelector((state) => state.ui.exploreCategory);

  const tag = searchParams.get('tag');
  const circleId = searchParams.get('circle');
  const isFiltered = Boolean(tag || circleId);

  const [searchInput, setSearchInput] = useState(tag || '');

  const { data: circlesData, isLoading: circlesLoading } = useGetCirclesQuery(
    activeCategory !== 'all' ? activeCategory : undefined
  );
  const { data: creatorsData } = useGetCreatorsQuery(8);
  const { data: filteredPosts, isLoading: postsLoading } = useGetPostsQuery(
    { tag, circle: circleId, limit: 10 },
    { skip: !isFiltered }
  );

  const handleCategoryChange = (id) => dispatch(setExploreCategory(id));

  const clearFilter = () => setSearchParams({});

  if (isFiltered) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-headline-sm font-bold">
            {tag ? `#${tag}` : 'Circle posts'}
          </h1>
          <button type="button" onClick={clearFilter} className="text-body-sm font-semibold text-primary-container hover:underline">
            Clear filter
          </button>
        </div>
        {postsLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPosts?.data?.length ? (
          filteredPosts.data.map((post) => <PostCard key={post._id || post.id} post={post} />)
        ) : (
          <div className="card-surface p-8 text-center text-brand-slate">No posts found for this filter yet.</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="text-center max-w-2xl mx-auto">
        <h1 className="text-headline-lg-mobile sm:text-headline-lg font-bold text-on-surface tracking-tight">
          Discover code, paradigms &amp; technical collectives
        </h1>
        <p className="text-body-lg text-brand-slate mt-2">
          Explore what the Feedants community is building, and find your people.
        </p>
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tags, snippets, or technologies…"
            className="w-full h-12 pl-12 pr-4 rounded-full border border-brand-line bg-surface-container-lowest text-body-md placeholder:text-outline focus:ring-2 focus:ring-primary-fixed outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchInput.trim()) {
                setSearchParams({ tag: searchInput.trim().toLowerCase() });
              }
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-headline-sm font-bold mb-4">Ecosystem Radar &amp; Velocity</h2>
        <TechRadarGrid />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline-sm font-bold">Active Guilds &amp; Technical Circles</h2>
        </div>
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {EXPLORE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-body-sm font-semibold whitespace-nowrap transition-all border',
                activeCategory === cat.id
                  ? 'bg-primary-container text-on-primary border-primary-container'
                  : 'border-brand-line text-brand-slate hover:border-brand-border-tint'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {circlesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(circlesData?.data || []).map((circle) => (
              <CircleCard key={circle._id || circle.id} circle={circle} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-headline-sm font-bold mb-4">Curated Technical Creators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(creatorsData?.data || []).map((creator) => (
            <CreatorCard key={creator._id || creator.id} creator={creator} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
