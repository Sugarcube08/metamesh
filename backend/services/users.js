// backend/services/users.js
// User storage service

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/users.json');

/**
 * Load users from file
 */
function load() {
  try {
    if (fs.existsSync(FILE)) {
      const data = fs.readFileSync(FILE, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (e) {
    console.error('Error loading users:', e);
    return {};
  }
}

/**
 * Save users to file
 */
function save(data) {
  try {
    const dataDir = path.dirname(FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving users:', e);
    throw e;
  }
}

module.exports = {
  /**
   * Get user by username
   */
  getUser(username) {
    const users = load();
    return users[username] || null;
  },

  /**
   * Check if user exists
   */
  userExists(username) {
    return this.getUser(username) !== null;
  },

  /**
   * Create new user
   */
  createUser(username, passwordHash) {
    const users = load();
    if (users[username]) {
      throw new Error('User already exists');
    }
    users[username] = {
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    save(users);
  },

  /**
   * Get all users (for admin/debugging)
   */
  getAll() {
    return load();
  },
};


