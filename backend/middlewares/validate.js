/**
 * Builds an Express middleware that validates `req.body` (or another
 * request segment) against a Zod schema, replacing it with the
 * parsed/sanitized value on success or forwarding a ZodError to the
 * centralized error handler on failure.
 */
const validate = (schema, segment = 'body') => (req, res, next) => {
  try {
    req[segment] = schema.parse(req[segment]);
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
