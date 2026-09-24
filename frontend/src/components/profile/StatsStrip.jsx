const StatsStrip = ({ stats }) => {
  const items = [
    { label: 'Posts', value: stats?.postCount || 0 },
    { label: 'Followers', value: stats?.followersCount || 0 },
    { label: 'Following', value: stats?.followingCount || 0 },
  ];

  return (
    <div className="card-surface grid grid-cols-3 divide-x divide-brand-line p-0 overflow-hidden w-full">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center justify-center py-3 sm:py-4 px-1 min-w-0">
          <span className="text-title-md sm:text-headline-sm font-bold text-on-surface truncate max-w-full">{item.value}</span>
          <span className="text-body-xs sm:text-body-sm text-brand-slate truncate max-w-full">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;