/**
 * Centralized Error-Handling Middleware
 */

// 404 Route Not Found
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' not found`
  });
}

// Global Error Handler
function errorHandler(err, req, res, next) {
  console.error('[BACKEND ERROR]', err.message || err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', ')
    });
  }

  // Sequelize connection error
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    return res.status(503).json({
      success: false,
      error: 'Database connection failed. Please ensure PostgreSQL is running and credentials are valid'
    });
  }

  // Malformed JSON body
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload in request body'
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

