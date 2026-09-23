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
    <div className="mt-4 pt-4 border-t border-brand-line flex flex-col gap-4">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size={20} />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-body-sm text-brand-slate text-center py-2">No comments yet — be the first to reply.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id || comment.id} className="flex items-start gap-2.5">
            <Link to={`/profile/${comment.author?.username}`} className="shrink-0">
              <Avatar src={comment.author?.avatar} name={comment.author?.name} size="xs" />
            </Link>
            <div className="min-w-0 flex-1 bg-surface-container-low rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${comment.author?.username}`} className="text-body-sm font-semibold hover:underline">
                  {comment.author?.name}
                </Link>
                <span className="text-body-sm text-outline">{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p className="text-body-sm text-on-surface mt-0.5 break-words">{comment.content}</p>
            </div>
          </div>
        ))
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        <Avatar src={user?.avatar} name={user?.name} size="xs" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isAuthenticated ? 'Write a reply…' : 'Sign in to comment'}
          className="flex-1 h-9 px-3 rounded-full bg-surface-container-low border border-transparent text-body-sm focus:bg-surface-container-lowest focus:border-brand-line outline-none transition-all"
        />
        <button
          type="submit"
          disabled={isPosting || !value.trim()}
          className="p-2 rounded-full text-primary-container hover:bg-primary-fixed disabled:opacity-40 transition-colors"
          aria-label="Send comment"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default CommentThread;
