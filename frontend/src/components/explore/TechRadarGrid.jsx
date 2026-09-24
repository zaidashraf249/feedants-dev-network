import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { useGetTrendingTagsQuery } from '../../store/api/postsApi';

const TechRadarGrid = () => {
  const { data, isLoading } = useGetTrendingTagsQuery(12);
  const tags = data?.data || [];
  const maxCount = Math.max(...tags.map((t) => t.count), 1);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-surface-container animate-pulse" />
        ))}
      </div>
    );
  }

  if (tags.length === 0) {
    return <p className="text-body-sm sm:text-body-md text-brand-slate">No trending technologies yet — be the first to post!</p>;
  }

  return (
    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
      {tags.map((item, index) => (
        <Link
          key={item.tag}
          to={`/explore?tag=${item.tag}`}
          className="card-surface p-3.5 sm:p-4 flex flex-col gap-2 group w-full overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-title-md sm:text-headline-sm font-bold text-on-surface">#{index + 1}</span>
            {index < 3 && <Flame className="w-4 h-4 text-orange-500 shrink-0" />}
          </div>
          <p className="font-mono text-body-md sm:text-title-md text-primary-container truncate">#{item.tag}</p>
          <div className="h-1.5 rounded-full bg-surface-container overflow-hidden w-full">
            <div
              className="h-full bg-gradient-to-r from-primary-container to-tertiary-container transition-all duration-300 group-hover:opacity-80"
              style={{ width: `${Math.max((item.count / maxCount) * 100, 8)}%` }}
            />
          </div>
          <p className="text-body-xs sm:text-body-sm text-brand-slate">{item.count} posts</p>
        </Link>
      ))}
    </div>
  );
};

export default TechRadarGrid;