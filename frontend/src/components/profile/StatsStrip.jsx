const StatsStrip = ({ stats }) => {
  const items = [
    { label: 'Posts', value: stats?.postCount || 0 },
    { label: 'Followers', value: stats?.followersCount || 0 },
    { label: 'Following', value: stats?.followingCount || 0 },
  ];

  return (
    <div className="card-surface grid grid-cols-3 divide-x divide-brand-line p-0 overflow-hidden">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center justify-center py-4">
          <span className="text-headline-sm font-bold text-on-surface">{item.value}</span>
          <span className="text-body-sm text-brand-slate">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;
