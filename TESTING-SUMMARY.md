# MetaMesh Phase 2 - Testing Summary

This document provides a quick reference for testing the complete MetaMesh Phase 2 system.

## Quick Start Testing

### 1. Backend Testing

```bash
cd backend
npm test
```

Or manually test endpoints:
- See `backend/TESTING.md` for detailed instructions
- Use `backend/examples/curl-examples.ps1` (Windows) or `curl-examples.sh` (Linux/Mac)

### 2. Frontend Testing

1. Set environment variables in `.env.local`:
```env
NEXT_PUBLIC_BLOCKFROST_KEY=your_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
```

2. Use the example component:
```tsx
import { MintReceiptExample } from '@/lib/cardano/example-integration';
```

3. Or use the hook:
```tsx
import { useMint } from '@/lib/cardano/useMint';
```

See `lib/cardano/TESTING.md` for detailed instructions.

## Complete Test Flow

### Step 1: Start Backend
```bash
cd backend
$env:NFT_STORAGE_API_KEY="your_key"
npm start
```

### Step 2: Test Backend Endpoints
```bash
cd backend
npm test
```

Expected output:
- ✅ POST /issue-request → Returns `{ id, metadataURI }`
- ✅ GET /requests → Returns all requests
- ✅ POST /mark-issued → Returns `{ ok: true }`

### Step 3: Test Frontend Minting

1. Open frontend app
2. Connect Nami wallet (testnet)
3. Use minting component or hook
4. Complete the flow:
   - Request invoice → Get metadataURI
   - Mint NFT → Get txHash
   - Mark as issued → Update backend

### Step 4: Verify

1. Check backend store: `backend/data/store.json`
2. View transaction: https://testnet.cardanoscan.io/transaction/{txHash}
3. Check IPFS: Use metadataURI to view metadata

## Example Payloads

### Backend Request (POST /issue-request)
```json
{
  "recipientDID": "did:cardano:test123",
  "recipientAddress": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk",
  "amount": "1000000",
  "description": "Payment for services rendered",
  "issuer": "MetaMesh"
}
```

### Backend Response
```json
{
  "id": "1732920000000",
  "metadataURI": "ipfs://QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Frontend Mint Function
```typescript
const policy = await createPolicyFromWallet(blockfrostKey);
const txHash = await mintReceipt(
  metadataURI,
  recipientAddress,
  policy,
  blockfrostKey
);
```

## Test Files Reference

### Backend
- `backend/test-endpoints.js` - Automated test script
- `backend/examples/example-payloads.json` - Example request/response payloads
- `backend/examples/curl-examples.ps1` - PowerShell test script
- `backend/examples/curl-examples.sh` - Bash test script
- `backend/TESTING.md` - Detailed testing guide

### Frontend
- `lib/cardano/test-mint.ts` - Test functions for minting
- `lib/cardano/example-integration.tsx` - Example React component
- `lib/cardano/TESTING.md` - Detailed testing guide

## Troubleshooting

### Backend Issues
- **NFT_STORAGE_API_KEY not set**: Set environment variable
- **Port in use**: Change PORT or kill process on port 3333
- **CORS errors**: Check CORS middleware in server.js

### Frontend Issues
- **Wallet not found**: Install Nami wallet extension
- **Insufficient funds**: Add testnet ADA to wallet
- **Blockfrost error**: Check API key and network (testnet)

## Next Steps

After testing:
- Step 7: Add Midnight proof artifact logic (when ready)
- Integrate with actual frontend screens
- Add error handling and user feedback
- Deploy to testnet

