import asyncWrapper from '../middlewares/asyncWrapper.js';
import ApiError from '../utils/ApiError.js';
import dataStore from '../utils/dataStore.js';

const attachIsLiked = (post, userId) => {
  const plain = typeof post.toObject === 'function' ? post.toObject({ virtuals: true }) : { ...post };
  plain.id = plain.id || plain._id;
  plain.isLiked = userId ? (post.likes || []).some((id) => String(id?._id || id) === String(userId)) : false;
  plain.isBookmarked = userId
    ? (post.bookmarkedBy || []).some((id) => String(id?._id || id) === String(userId))
    : false;
  return plain;
};

// @desc    Get paginated feed posts (filterable by tag, circle, author, search)
// @route   GET /api/v1/posts
// @access  Public (optionally authenticated for isLiked/isBookmarked flags)
export const getPosts = asyncWrapper(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const { tag, circle, author, search } = req.query;

  const { items, total, pages } = await dataStore.posts.list({ page, limit, tag, circle, author, search });
  const data = items.map((post) => attachIsLiked(post, req.user?.id));

  res.status(200).json({
    success: true,
    data,
    pagination: { page, limit, total, pages },
  });
});

// @desc    Get a single post by id
// @route   GET /api/v1/posts/:id
// @access  Public
export const getPostById = asyncWrapper(async (req, res) => {
  const post = await dataStore.posts.getById(req.params.id);
  if (!post) {
    throw ApiError.notFound('Post not found');
  }
  res.status(200).json({ success: true, data: attachIsLiked(post, req.user?.id) });
});

// @desc    Create a new post
// @route   POST /api/v1/posts
// @access  Private
export const createPost = asyncWrapper(async (req, res) => {
  const { content, codeSnippet, image, tags, circle } = req.body;
  const post = await dataStore.posts.create({ authorId: req.user.id, content, codeSnippet, image, tags, circle });
  res.status(201).json({ success: true, message: 'Post published', data: attachIsLiked(post, req.user.id) });
});

// @desc    Update a post (author only)
// @route   PATCH /api/v1/posts/:id
// @access  Private
export const updatePost = asyncWrapper(async (req, res) => {
  const result = await dataStore.posts.updateById(req.params.id, req.body, req.user.id);
  if (result.error === 'not_found') throw ApiError.notFound('Post not found');
  if (result.error === 'forbidden') throw ApiError.forbidden('You can only edit your own posts');
  res.status(200).json({ success: true, message: 'Post updated', data: attachIsLiked(result.post, req.user.id) });
});

// @desc    Delete a post (author only)
// @route   DELETE /api/v1/posts/:id
// @access  Private
export const deletePost = asyncWrapper(async (req, res) => {
  const result = await dataStore.posts.deleteById(req.params.id, req.user.id);
  if (result.error === 'not_found') throw ApiError.notFound('Post not found');
  if (result.error === 'forbidden') throw ApiError.forbidden('You can only delete your own posts');
  res.status(200).json({ success: true, message: 'Post deleted' });
});

// @desc    Toggle like on a post (optimistic-update friendly)
// @route   POST /api/v1/posts/:id/like
// @access  Private
export const toggleLikePost = asyncWrapper(async (req, res) => {
  const result = await dataStore.posts.toggleLike(req.params.id, req.user.id);
  if (!result) throw ApiError.notFound('Post not found');
  res.status(200).json({ success: true, data: result });
});

// @desc    Toggle bookmark on a post
// @route   POST /api/v1/posts/:id/bookmark
// @access  Private
export const toggleBookmarkPost = asyncWrapper(async (req, res) => {
  const result = await dataStore.posts.toggleBookmark(req.params.id, req.user.id);
  if (!result) throw ApiError.notFound('Post not found');
  res.status(200).json({ success: true, data: result });
});

// @desc    Get top trending tags across all posts
// @route   GET /api/v1/posts/trending/tags
// @access  Public
export const getTrendingTags = asyncWrapper(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 6, 20);
  const tags = await dataStore.posts.trendingTags(limit);
  res.status(200).json({ success: true, data: tags });
});

// @desc    List comments for a post
// @route   GET /api/v1/posts/:id/comments
// @access  Public
export const getPostComments = asyncWrapper(async (req, res) => {
  const comments = await dataStore.comments.listForPost(req.params.id);
  res.status(200).json({ success: true, data: comments });
});

// @desc    Add a comment to a post
// @route   POST /api/v1/posts/:id/comments
// @access  Private
export const addPostComment = asyncWrapper(async (req, res) => {
  const post = await dataStore.posts.getById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');

  const comment = await dataStore.comments.create({
    postId: req.params.id,
    authorId: req.user.id,
    content: req.body.content,
    parentComment: req.body.parentComment || null,
  });

  res.status(201).json({ success: true, message: 'Comment added', data: comment });
});
