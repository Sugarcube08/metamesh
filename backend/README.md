# MetaMesh Phase 2 Backend

Express backend server for MetaMesh receipt NFT minting.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
# Required for IPFS (nft.storage)
export NFT_STORAGE_API_KEY=your_api_key_here

# Optional (defaults to 3333)
export PORT=3333
```

On Windows PowerShell:
```powershell
$env:NFT_STORAGE_API_KEY="your_api_key_here"
$env:PORT="3333"
```

3. Start the server:
```bash
npm start
# or
node server.js
```

## API Endpoints

### POST /issue-request
Creates metadata and pins it to IPFS, returns metadata URI.

**Request Body:**
```json
{
  "recipientDID": "did:example:123",
  "recipientAddress": "addr_test1...",
  "amount": "1000000",
  "description": "Payment receipt",
  "issuer": "MetaMesh"
}
```

**Response:**
```json
{
  "id": "1234567890",
  "metadataURI": "ipfs://Qm..."
}
```

### POST /mark-issued
Marks a request as issued with transaction ID.

**Request Body:**
```json
{
  "id": "1234567890",
  "txId": "abc123..."
}
```

### GET /requests
Returns all stored requests.

## Services

- **IPFS Service** (`services/ipfs.js`): Pins JSON metadata to IPFS using nft.storage
- **Store Service** (`services/store.js`): In-memory JSON file storage

## Testing

See `TESTING.md` for detailed testing instructions.

Quick test:
```bash
npm test
```

Or use the example scripts in `examples/`:
- `curl-examples.sh` (Linux/Mac)
- `curl-examples.ps1` (Windows PowerShell)

