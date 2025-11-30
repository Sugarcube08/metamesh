# Backend Testing Guide

This guide shows how to test the MetaMesh Phase 2 backend endpoints.

## Prerequisites

1. Backend server running on `http://localhost:3333`
2. `NFT_STORAGE_API_KEY` environment variable set
3. Node.js installed (for test script)

## Quick Start

### Option 1: Using Node.js Test Script

```bash
cd backend
npm test
```

This will run all endpoint tests automatically.

### Option 2: Using PowerShell (Windows)

```powershell
cd backend
.\examples\curl-examples.ps1
```

### Option 3: Using curl (Linux/Mac)

```bash
cd backend
chmod +x examples/curl-examples.sh
./examples/curl-examples.sh
```

## Manual Testing

### 1. Create Issue Request

**Endpoint:** `POST /issue-request`

**Request:**
```json
{
  "recipientDID": "did:cardano:test123",
  "recipientAddress": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk",
  "amount": "1000000",
  "description": "Payment for services rendered",
  "issuer": "MetaMesh"
}
```

**Response:**
```json
{
  "id": "1732920000000",
  "metadataURI": "ipfs://QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3333/issue-request \
  -H "Content-Type: application/json" \
  -d '{
    "recipientDID": "did:cardano:test123",
    "recipientAddress": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk",
    "amount": "1000000",
    "description": "Payment for services rendered",
    "issuer": "MetaMesh"
  }'
```

### 2. Get All Requests

**Endpoint:** `GET /requests`

**Response:**
```json
{
  "1732920000000": {
    "id": "1732920000000",
    "metadataURI": "ipfs://QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "metadata": {
      "name": "MetaMesh Receipt 1732920000000",
      "description": "Payment for services rendered",
      "issuer": "MetaMesh",
      "recipientDID": "did:cardano:test123",
      "recipientAddress": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk",
      "amount": "1000000",
      "issuedAt": "2024-11-30T03:30:00.000Z"
    },
    "status": "pending"
  }
}
```

**cURL:**
```bash
curl http://localhost:3333/requests
```

### 3. Mark as Issued

**Endpoint:** `POST /mark-issued`

**Request:**
```json
{
  "id": "1732920000000",
  "txId": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
}
```

**Response:**
```json
{
  "ok": true
}
```

**cURL:**
```bash
curl -X POST http://localhost:3333/mark-issued \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1732920000000",
    "txId": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }'
```

## Test Flow

1. **Create Request** → Get `id` and `metadataURI`
2. **Mint NFT** (using frontend/Lucid) → Get `txHash`
3. **Mark as Issued** → Use `id` and `txHash`
4. **Get Requests** → Verify status changed to "issued"

## Example Payloads

See `examples/example-payloads.json` for complete request/response examples.

## Troubleshooting

### Error: NFT_STORAGE_API_KEY not set
```bash
export NFT_STORAGE_API_KEY=your_key_here  # Linux/Mac
$env:NFT_STORAGE_API_KEY="your_key_here"  # Windows PowerShell
```

### Error: Port already in use
Change the port in `server.js` or set `PORT` environment variable:
```bash
export PORT=3334  # Linux/Mac
$env:PORT="3334"  # Windows PowerShell
```

### Error: CORS issues
The server includes CORS middleware. If you still have issues, check that the frontend URL is allowed.

