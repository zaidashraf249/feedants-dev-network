import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Send } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { Spinner } from '../ui/Spinner';
import useAuth from '../../hooks/useAuth';
import { useGetPostCommentsQuery, useAddPostCommentMutation } from '../../store/api/postsApi';
import { formatRelativeTime } from '../../utils/formatters';
import { openAuthModal } from '../../store/slices/uiSlice';

const CommentThread = ({ postId }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { data, isLoading } = useGetPostCommentsQuery(postId);
  const [addComment, { isLoading: isPosting }] = useAddPostCommentMutation();
  const [value, setValue] = useState('');

  const comments = data?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(openAuthModal('signin'));
      return;
    }
    if (!value.trim()) return;
    await addComment({ postId, content: value.trim() });
    setValue('');
  };

  return (
    <div className="mt-4 pt-4 border-t border-brand-line flex flex-col gap-3.5 w-full max-w-full overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size={20} />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-body-sm text-brand-slate text-center py-2">No comments yet — be the first to reply.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id || comment.id} className="flex items-start gap-2 sm:gap-2.5 w-full min-w-0">
            <Link to={`/profile/${comment.author?.username}`} className="shrink-0 mt-0.5">
              <Avatar src={comment.author?.avatar} name={comment.author?.name} size="xs" />
            </Link>
            <div className="min-w-0 flex-1 bg-surface-container-low rounded-2xl sm:rounded-lg px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                <Link to={`/profile/${comment.author?.username}`} className="text-body-sm font-semibold hover:underline truncate max-w-[140px] sm:max-w-none">
                  {comment.author?.name}
                </Link>
                <span className="text-[11px] sm:text-body-sm text-outline shrink-0">{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p className="text-body-sm text-on-surface mt-0.5 break-words [overflow-wrap:anywhere]">{comment.content}</p>
            </div>
          </div>
        ))
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full pt-1">
        <Avatar src={user?.avatar} name={user?.name} size="xs" className="shrink-0" />
        <div className="flex-1 flex items-center bg-surface-container-low border border-transparent focus-within:border-brand-line focus-within:bg-surface-container-lowest rounded-full px-3 py-0.5 transition-all min-w-0">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isAuthenticated ? 'Write a reply…' : 'Sign in to comment'}
            className="w-full bg-transparent text-body-sm outline-none placeholder:text-outline py-1.5 min-w-0"
          />
          <button
            type="submit"
            disabled={isPosting || !value.trim()}
            className="p-1 rounded-full text-primary-container hover:bg-primary-fixed disabled:opacity-30 transition-colors shrink-0 ml-1"
            aria-label="Send comment"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentThread;