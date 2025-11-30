// backend/services/store.js
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/store.json');

/**
 * Load data from store.json file
 * @returns {Object} The stored data object, or empty object if file doesn't exist
 */
function load() {
  try {
    if (fs.existsSync(FILE)) {
      const data = fs.readFileSync(FILE, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (e) {
    console.error('Error loading store:', e);
    return {};
  }
}

/**
 * Save data to store.json file
 * @param {Object} data - The data object to save
 */
function save(data) {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving store:', e);
    throw e;
  }
}

module.exports = {
  /**
   * Save a request to the store
   * @param {string} id - Request ID
   * @param {Object} obj - Request object to save
   */
  saveRequest(id, obj) {
    const store = load();
    store[id] = obj;
    save(store);
  },

  /**
   * Get all requests from the store
   * @returns {Object} All stored requests
   */
  getAll() {
    return load();
  },

  /**
   * Mark a request as issued with transaction ID
   * @param {string} id - Request ID
   * @param {string} txId - Transaction ID
   */
  markIssued(id, txId) {
    const store = load();
    if (store[id]) {
      store[id].txId = txId;
      store[id].status = 'issued';
      save(store);
    } else {
      throw new Error(`Request with id ${id} not found`);
    }
  }
};
