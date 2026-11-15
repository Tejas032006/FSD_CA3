const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Validates the Authorization Bearer token header.
 * Returns HTTP 401 if missing, invalid, or expired.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No authorization header provided. Expected "Bearer <token>"'
    });
  }

  // Parse Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authorization format. Format must be "Bearer <token>"'
    });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET || 'medibook_jwt_super_secret_key_2026_ca3';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: err.name === 'TokenExpiredError' 
        ? 'Access token has expired. Please log in again' 
        : 'Invalid access token. Verification failed'
    });
  }
}

module.exports = authenticateToken;

