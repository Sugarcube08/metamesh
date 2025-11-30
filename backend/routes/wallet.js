const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const WALLETS_FILE = path.join(__dirname, '../data/wallets.json');

// Ensure wallets.json exists
if (!fs.existsSync(WALLETS_FILE)) {
  fs.writeFileSync(WALLETS_FILE, JSON.stringify({}, null, 2));
}

// Helper to read wallets
function readWallets() {
  try {
    const data = fs.readFileSync(WALLETS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading wallets:', error);
    return {};
  }
}

// Helper to write wallets
function writeWallets(wallets) {
  try {
    fs.writeFileSync(WALLETS_FILE, JSON.stringify(wallets, null, 2));
  } catch (error) {
    console.error('Error writing wallets:', error);
    throw error;
  }
}

// POST /wallet/register
router.post('/register', (req, res) => {
  try {
    const { publicKey, createdAt } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'publicKey is required' });
    }

    const wallets = readWallets();

    // Check if wallet already exists
    if (wallets[publicKey]) {
      // Update lastSeen
      wallets[publicKey].lastSeen = new Date().toISOString();
    } else {
      // Create new wallet entry
      wallets[publicKey] = {
        publicKey,
        createdAt: createdAt || new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      };
    }

    writeWallets(wallets);

    res.json({ success: true, publicKey });
  } catch (error) {
    console.error('Error in /wallet/register:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /wallet/:publicKey
router.get('/:publicKey', (req, res) => {
  try {
    const { publicKey } = req.params;

    const wallets = readWallets();

    if (wallets[publicKey]) {
      res.json(wallets[publicKey]);
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error in GET /wallet/:publicKey:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


