import asyncWrapper from '../middlewares/asyncWrapper.js';
import ApiError from '../utils/ApiError.js';
import dataStore from '../utils/dataStore.js';

// @desc    List all tech circles, optionally filtered by category
// @route   GET /api/v1/circles
// @access  Public (Optional Auth for isJoined flag)
export const getCircles = asyncWrapper(async (req, res) => {
  const { category } = req.query;
  const circles = await dataStore.circles.list({ category });
  const userId = req.user?.id;

  // Har circle ke saath explicit isJoined boolean pass kar rahe hain
  const enrichedCircles = circles.map((circle) => {
    const plain = typeof circle.toObject === 'function' ? circle.toObject({ virtuals: true }) : { ...circle };
    plain.id = plain.id || plain._id;

    // Check if logged-in user ID exists in members array
    plain.isJoined = userId
      ? (plain.members || []).some((mId) => String(mId?._id || mId) === String(userId))
      : false;

    return plain;
  });

  res.status(200).json({ success: true, data: enrichedCircles });
});

// @desc    Get a single circle by id or slug
// @route   GET /api/v1/circles/:idOrSlug
// @access  Public
export const getCircleById = asyncWrapper(async (req, res) => {
  const { idOrSlug } = req.params;
  const circle =
    (await dataStore.circles.getById(idOrSlug).catch(() => null)) || (await dataStore.circles.getBySlug(idOrSlug));
  if (!circle) throw ApiError.notFound('Circle not found');

  const userId = req.user?.id;
  const plain = typeof circle.toObject === 'function' ? circle.toObject({ virtuals: true }) : { ...circle };
  plain.id = plain.id || plain._id;
  plain.isJoined = userId
    ? (plain.members || []).some((mId) => String(mId?._id || mId) === String(userId))
    : false;

  res.status(200).json({ success: true, data: plain });
});

// @desc    Create a new circle
// @route   POST /api/v1/circles
// @access  Private
export const createCircle = asyncWrapper(async (req, res) => {
  const { name, description, category, icon, color } = req.body;
  const circle = await dataStore.circles.getBySlug(
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  );
  if (circle) throw ApiError.conflict('A circle with a similar name already exists');

  const CircleModel = (await import('../models/Circle.js')).default;
  const created = dataStore.isLive()
    ? await CircleModel.create({ name, description, category, icon, color, moderators: [req.user.id], members: [req.user.id] })
    : null;

  if (created) {
    return res.status(201).json({ success: true, message: 'Circle created', data: created });
  }

  const { mockCircles, genId } = await import('../utils/mockData.js');
  const newCircle = {
    _id: genId(),
    name,
    slug: name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    description: description || '',
    category,
    icon: icon || 'groups',
    color: color || '#533afd',
    members: [req.user.id],
    moderators: [req.user.id],
    postCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCircles.push(newCircle);
  res.status(201).json({ success: true, message: 'Circle created', data: newCircle });
});

// @desc    Toggle membership in a circle
// @route   POST /api/v1/circles/:id/join
// @access  Private
export const toggleJoinCircle = asyncWrapper(async (req, res) => {
  const result = await dataStore.circles.toggleJoin(req.params.id, req.user.id);
  if (!result) throw ApiError.notFound('Circle not found');
  res.status(200).json({ success: true, data: result });
});
