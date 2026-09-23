import { useState } from 'react';
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { useToggleLikePostMutation, useToggleBookmarkPostMutation } from '../../store/api/postsApi';
import { formatCompactNumber } from '../../utils/formatters';
import { openAuthModal } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

/**
 * The like / comment / share / bookmark row shown at the bottom of
 * every PostCard. Likes and bookmarks use RTK Query mutations with
 * optimistic updates (see store/api/postsApi.js), so the UI reacts
 * instantly regardless of network latency.
 */
const EngagementActions = ({ post, onCommentClick }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [toggleLike] = useToggleLikePostMutation();
  const [toggleBookmark] = useToggleBookmarkPostMutation();
  const [shareCopied, setShareCopied] = useState(false);

  const postId = post._id || post.id;

  const requireAuth = (action) => () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('signin'));
      return;
    }
    action();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      // clipboard may be unavailable — silently ignore
    }
  };

  return (
    <div className="flex items-center justify-between pt-3 mt-1 border-t border-brand-line text-brand-slate">
      <button
        type="button"
        onClick={requireAuth(() => toggleLike(postId))}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-error-container/30 transition-colors text-body-sm font-medium',
          post.isLiked && 'text-error'
        )}
        aria-pressed={post.isLiked}
      >
        <Heart className={cn('w-[18px] h-[18px]', post.isLiked && 'fill-current')} />
        {formatCompactNumber(post.likeCount || 0)}
      </button>

      <button
        type="button"
        onClick={() => onCommentClick?.(post)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-primary-fixed/40 hover:text-primary-container transition-colors text-body-sm font-medium"
      >
        <MessageCircle className="w-[18px] h-[18px]" />
        {formatCompactNumber(post.commentCount || 0)}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-surface-container transition-colors text-body-sm font-medium"
      >
        <Share2 className="w-[18px] h-[18px]" />
        {shareCopied ? 'Link copied' : formatCompactNumber(post.shareCount || 0)}
      </button>

      <button
        type="button"
        onClick={requireAuth(() => toggleBookmark(postId))}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-primary-fixed/40 transition-colors',
          post.isBookmarked && 'text-primary-container'
        )}
        aria-pressed={post.isBookmarked}
        aria-label="Bookmark post"
      >
        <Bookmark className={cn('w-[18px] h-[18px]', post.isBookmarked && 'fill-current')} />
      </button>
    </div>
  );
};

export default EngagementActions;
