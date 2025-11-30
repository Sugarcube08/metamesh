// backend/routes/auth.js
// Authentication routes

const express = require('express');
const bcrypt = require('bcryptjs');
const USERS = require('../services/users');

const router = express.Router();

/**
 * POST /auth/signup
 * Create a new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username must be a non-empty string' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    if (USERS.userExists(username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    USERS.createUser(username, passwordHash);

    res.json({ success: true });
  } catch (error) {
    console.error('Error in /auth/signup:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


