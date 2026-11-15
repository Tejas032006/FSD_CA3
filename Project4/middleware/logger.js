/**
 * Request Logging Middleware
 * Logs HTTP Method, Request URL, and ISO Timestamp for every incoming request.
 */
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = logger;

