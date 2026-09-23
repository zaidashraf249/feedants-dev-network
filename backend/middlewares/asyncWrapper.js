/**
 * Wraps an async route handler so any rejected promise is forwarded
 * to Express's `next`, landing in the centralized error handler
 * instead of crashing the process or requiring repetitive try/catch.
 */
const asyncWrapper = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export default asyncWrapper;
