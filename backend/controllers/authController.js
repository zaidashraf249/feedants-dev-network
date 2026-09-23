import bcrypt from 'bcryptjs';
import asyncWrapper from '../middlewares/asyncWrapper.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/generateToken.js';
import dataStore from '../utils/dataStore.js';

const sanitizeUser = (user) => {
  const obj = typeof user.toPublicJSON === 'function' ? user.toPublicJSON() : { ...user };
  delete obj.password;
  return obj;
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncWrapper(async (req, res) => {
  const { name, username, email, password } = req.body;

  const existing = await dataStore.users.existsByEmailOrUsername(email, username);
  if (existing) {
    const field = existing.email === email.toLowerCase() ? 'email' : 'username';
    throw ApiError.conflict(`An account with this ${field} already exists`);
  }

  const user = await dataStore.users.create({ name, username, email, password });
  const token = generateToken(user._id || user.id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user: sanitizeUser(user), token },
  });
});

// @desc    Log in an existing user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await dataStore.users.findByEmail(email, { withPassword: true });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch =
    typeof user.comparePassword === 'function'
      ? await user.comparePassword(password)
      : await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken(user._id || user.id);

  res.status(200).json({
    success: true,
    message: 'Signed in successfully',
    data: { user: sanitizeUser(user), token },
  });
});

// @desc    Get the currently authenticated user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncWrapper(async (req, res) => {
  const user = await dataStore.users.findById(req.user.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  res.status(200).json({ success: true, data: { user: sanitizeUser(user) } });
});

// @desc    Log out (client-side token discard; endpoint exists for symmetry / cookie clearing)
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncWrapper(async (req, res) => {
  res.status(200).json({ success: true, message: 'Signed out successfully' });
});
