// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const { pinJSON } = require('./services/ipfs');
const STORE = require('./services/store');

const app = express();
app.use(bodyParser.json());

// CORS middleware (for frontend connection)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// POST /issue-request -> create metadata and return metadataURI
app.post('/issue-request', async (req, res) => {
  try {
    const { recipientDID, recipientAddress, amount, description, issuer } = req.body;
    const id = Date.now().toString();
    const metadata = {
      name: `MetaMesh Receipt ${id}`,
      description,
      issuer,
      recipientDID,
      recipientAddress,
      amount,
      issuedAt: new Date().toISOString()
    };
    
    // Pin metadata to IPFS
    const metadataURI = await pinJSON(metadata);
    
    // Save request to store
    STORE.saveRequest(id, { id, metadataURI, metadata, status: 'pending' });
    
    res.json({ id, metadataURI });
  } catch (error) {
    console.error('Error in /issue-request:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /mark-issued
app.post('/mark-issued', (req, res) => {
  try {
    const { id, txId } = req.body;
    
    if (!id || !txId) {
      return res.status(400).json({ error: 'id and txId are required' });
    }
    
    STORE.markIssued(id, txId);
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error in /mark-issued:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /requests
app.get('/requests', (req, res) => {
  try {
    const requests = STORE.getAll();
    res.json(requests);
  } catch (error) {
    console.error('Error in /requests:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Backend listening on :${PORT}`));
