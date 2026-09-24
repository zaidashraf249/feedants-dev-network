import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, MoreHorizontal, Trash2 } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import CodeSnippetBlock from './CodeSnippetBlock';
import EngagementActions from './EngagementActions';
import CommentThread from './CommentThread';
import { formatRelativeTime } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';
import { useDeletePostMutation } from '../../store/api/postsApi';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [deletePost] = useDeletePostMutation();
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const postId = post._id || post.id;
  const author = post.author || {};
  const isOwner = user && (user._id === author._id || user.id === author._id || user.username === author.username);

  const handleDelete = async () => {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      await deletePost(postId);
    }
    setMenuOpen(false);
  };

  return (
    <article className="card-surface p-3 sm:p-space-md w-full max-w-full overflow-hidden">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <Link to={`/profile/${author.username}`} className="shrink-0">
          <Avatar src={author.avatar} name={author.name} size="md" />
        </Link>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0">
                <Link
                  to={`/profile/${author.username}`}
                  className="inline-flex items-center gap-1 font-semibold text-on-surface hover:underline truncate text-body-md sm:text-body-lg max-w-full"
                >
                  <span className="truncate">{author.name}</span>
                  {author.verified && <BadgeCheck className="w-4 h-4 text-primary-container shrink-0" />}
                </Link>
                <span className="text-body-sm text-brand-slate truncate max-w-full">
                  @{author.username} · {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>

            {isOwner && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1.5 rounded-full text-brand-slate hover:bg-surface-container-low transition-colors"
                  aria-label="Post options"
                >
                  <MoreHorizontal className="w-[18px] h-[18px]" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 w-40 bg-surface-container-lowest border border-brand-line rounded-lg shadow-level3 py-1 z-20">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-error hover:bg-error-container/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 text-body-md sm:text-body-lg text-on-surface whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {post.content}
          </p>

          <div className="mt-3 w-full overflow-x-auto">
            <CodeSnippetBlock codeSnippet={post.codeSnippet} />
          </div>

          {post.image && (
            <div className="mt-3 w-full overflow-hidden rounded-lg border border-brand-line bg-surface-container-low">
              <img
                src={post.image}
                alt=""
                className="w-full max-h-[320px] sm:max-h-[420px] object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 w-full">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/explore?tag=${tag}`} className="max-w-full truncate">
                  <Badge variant="primary" className="normal-case font-medium truncate max-w-full">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-2 w-full">
            <EngagementActions post={post} onCommentClick={() => setShowComments((v) => !v)} />
          </div>

          {showComments && (
            <div className="mt-3 w-full border-t border-brand-line pt-3">
              <CommentThread postId={postId} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;