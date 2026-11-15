/**
 * Centralized Error-Handling Middleware
 * Catches operational errors, invalid JSON parsing issues, and server exceptions.
 */

// 404 Route Not Found Handler
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  });
}

// Global Error Handler
function errorHandler(err, req, res, next) {
  console.error('[ERROR HANDLER]', err.message || err);

  // Catch body-parser JSON syntax errors
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload in request body'
    });
  }

  // Catch JWT verification errors passed to next
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication token has expired'
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

