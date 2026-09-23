import asyncWrapper from '../middlewares/asyncWrapper.js';
import ApiError from '../utils/ApiError.js';
import dataStore from '../utils/dataStore.js';

const sanitizeUser = (user) => {
  const obj = typeof user.toPublicJSON === 'function' ? user.toPublicJSON() : { ...user };
  delete obj.password;
  return obj;
};

// @desc    List curated/featured technical creators
// @route   GET /api/v1/users/creators
// @access  Public (Optional Auth for isFollowing flag)
export const getCreators = asyncWrapper(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 30);
  const creators = await dataStore.users.listCreators(limit);

  // User ke following array IDs get karna
  let followingIds = [];
  if (req.user) {
    const me = await dataStore.users.findById(req.user.id);
    followingIds = (me?.following || []).map((id) => String(id?._id || id));
  }

  // Har creator ke saath explicit `isFollowing` boolean match karna
  const creatorsWithFollowing = creators.map((creator) => {
    const sanitized = sanitizeUser(creator);
    const creatorId = String(creator._id || creator.id);
    sanitized.isFollowing = followingIds.includes(creatorId);
    return sanitized;
  });

  res.status(200).json({ success: true, data: creatorsWithFollowing });
});

// @desc    Get a public profile by username
// @route   GET /api/v1/users/:username
// @access  Public
export const getUserProfile = asyncWrapper(async (req, res) => {
  const user = await dataStore.users.findByUsername(req.params.username);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const userId = user._id || user.id;
  const { items: posts } = await dataStore.posts.list({ author: userId, page: 1, limit: 20 });

  let isFollowing = false;
  if (req.user) {
    const me = await dataStore.users.findById(req.user.id);
    isFollowing = (me?.following || []).some((id) => String(id?._id || id) === String(userId));
  }

  res.status(200).json({
    success: true,
    data: {
      user: { ...sanitizeUser(user), isFollowing },
      posts,
      stats: {
        postCount: posts.length,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
      },
    },
  });
});

// @desc    Update the authenticated user's own profile
// @route   PATCH /api/v1/users/me
// @access  Private
export const updateMyProfile = asyncWrapper(async (req, res) => {
  const updated = await dataStore.users.updateById(req.user.id, req.body);
  if (!updated) throw ApiError.notFound('User not found');
  res.status(200).json({ success: true, message: 'Profile updated', data: { user: sanitizeUser(updated) } });
});

// @desc    Toggle following another user
// @route   POST /api/v1/users/:id/follow
// @access  Private
export const toggleFollowUser = asyncWrapper(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw ApiError.badRequest('You cannot follow yourself');
  }
  const result = await dataStore.users.toggleFollow(req.user.id, req.params.id);
  if (!result) throw ApiError.notFound('User not found');
  res.status(200).json({ success: true, data: result });
});

// @desc    Search users by name or username
// @route   GET /api/v1/users/search?q=
// @access  Public
export const searchUsers = asyncWrapper(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(200).json({ success: true, data: [] });
  }
  const results = await dataStore.users.search(q.trim(), 10);
  res.status(200).json({ success: true, data: results.map(sanitizeUser) });
});
