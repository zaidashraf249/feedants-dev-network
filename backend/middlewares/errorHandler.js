import ApiError from '../utils/ApiError.js';

/**
 * Catches 404s for any route that didn't match a defined endpoint.
 */
export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found - ${req.originalUrl}`));
};

/**
 * Normalizes known error types (Mongoose validation/cast errors, JWT
 * errors, duplicate-key errors, Zod validation errors) into a
 * consistent ApiError shape before sending the final JSON response.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (error.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${error.path}: ${error.value}`);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    error = ApiError.conflict(`An account with this ${field} already exists`);
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((val) => val.message);
    error = ApiError.badRequest('Validation failed', messages);
  }

  if (error.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authentication token');
  }

  if (error.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Your session has expired, please sign in again');
  }

  if (error.name === 'ZodError') {
    const messages = error.issues?.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    error = ApiError.badRequest('Validation failed', messages);
  }

  const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
  const message = error.isOperational ? error.message : 'Something went wrong on our end';

  if (statusCode === 500) {
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: error.details || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
