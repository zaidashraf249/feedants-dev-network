/**
 * Formats a number the way engagement metrics are usually shown:
 * 920 -> "920", 4800 -> "4.8k", 1250000 -> "1.3M"
 */
export const formatCompactNumber = (value) => {
  const num = Number(value) || 0;
  if (num < 1000) return String(num);
  if (num < 1_000_000) return `${(num / 1000).toFixed(num % 1000 >= 100 ? 1 : 0)}k`.replace('.0k', 'k');
  return `${(num / 1_000_000).toFixed(1)}M`;
};

/**
 * Formats an ISO timestamp as a short relative string: "2m", "3h", "5d",
 * falling back to a short date once it's more than a week old.
 */
export const formatRelativeTime = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Produces initials from a display name for avatar fallbacks: "Sarah Lin" -> "SL"
 */
export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
