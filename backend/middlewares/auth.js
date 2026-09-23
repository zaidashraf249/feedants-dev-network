import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/generateToken.js';
import asyncWrapper from './asyncWrapper.js';
import dataStore from '../utils/dataStore.js';

/**
 * Requires a valid `Authorization: Bearer <token>` header. Attaches the
 * authenticated user's id (and, when available, a lightweight profile)
 * to `req.user` for downstream handlers.
 */
export const protect = asyncWrapper(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized — no token provided');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Not authorized — invalid or expired token');
  }

  const user = await dataStore.users.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized('Not authorized — user no longer exists');
  }

  req.user = { id: String(user._id || user.id), ...user };
  next();
});

/**
 * Attaches `req.user` if a valid token is present, but never rejects
 * the request — used for endpoints that render differently for
 * authenticated vs. anonymous visitors (e.g. showing "isLiked").
 */
export const attachUserIfPresent = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      const user = await dataStore.users.findById(decoded.id);
      if (user) {
        req.user = { id: String(user._id || user.id), ...user };
      }
    } catch (err) {
      // Invalid token on an optional route just means "treat as anonymous"
    }
  }
  next();
});

/**
 * Restricts a route to specific roles. Must run after `protect`.
 */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action'));
  }
  next();
};

export default protect;
