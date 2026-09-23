import jwt from 'jsonwebtoken';

/**
 * Signs a JWT for the given user id. The token is the single source of
 * truth for authentication; the frontend stores it and sends it back
 * via the `Authorization: Bearer <token>` header on every request.
 */
export const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export default generateToken;
