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
    <article className="card-surface p-space-md">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${author.username}`} className="shrink-0">
          <Avatar src={author.avatar} name={author.name} size="md" />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Link
                to={`/profile/${author.username}`}
                className="inline-flex items-center gap-1 font-semibold text-on-surface hover:underline truncate"
              >
                {author.name}
                {author.verified && <BadgeCheck className="w-4 h-4 text-primary-container shrink-0" />}
              </Link>
              <p className="text-body-sm text-brand-slate truncate">
                @{author.username} · {formatRelativeTime(post.createdAt)}
              </p>
            </div>

            {isOwner && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1.5 rounded-full text-brand-slate hover:bg-surface-container-low"
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
                        className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-error hover:bg-error-container/40"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 text-body-lg text-on-surface whitespace-pre-wrap break-words">{post.content}</p>

          <CodeSnippetBlock codeSnippet={post.codeSnippet} />

          {post.image && (
            <img
              src={post.image}
              alt=""
              className="mt-3 w-full max-h-[420px] object-cover rounded-lg border border-brand-line"
              loading="lazy"
            />
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/explore?tag=${tag}`}>
                  <Badge variant="primary" className="normal-case font-medium">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <EngagementActions post={post} onCommentClick={() => setShowComments((v) => !v)} />

          {showComments && <CommentThread postId={postId} />}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
