const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Path to users.json persistence file
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

/**
 * Helper to ensure users.json exists
 */
function ensureUsersFile() {
  const dataDir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Reads users array from disk
 */
function readUsers() {
  ensureUsersFile();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading users file:', err.message);
    return [];
  }
}

/**
 * Persists users array to disk
 */
function writeUsers(users) {
  ensureUsersFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

/**
 * POST /api/auth/register
 * Registers a new user, hashes password with bcryptjs, and stores in data/users.json
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate presence of username and password
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Field "username" is required and cannot be empty'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Field "password" is required and must be at least 6 characters long'
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const users = readUsers();

    // Check if user already exists
    const existing = users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `Username "${username.trim()}" is already registered. Please login or choose another username`
      });
    }

    // Hash password with bcryptjs (10 salt rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1,
      username: username.trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // Return sanitized response (never return password)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Verifies credentials with bcryptjs and returns a signed JWT token
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Both "username" and "password" fields are required'
      });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const users = readUsers();

    // Find user
    const user = users.find(u => u.username.toLowerCase() === cleanUsername);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Verify password with bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Generate JWT token using secret from environment variables
    const secret = process.env.JWT_SECRET || 'medibook_jwt_super_secret_key_2026_ca3';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

