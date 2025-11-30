# MetaMesh Phase 2 - Getting Started Guide

Complete setup and run guide for MetaMesh Phase 2 implementation.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Nami wallet browser extension (for frontend testing)
- API keys:
  - NFT.Storage API key (for IPFS)
  - Blockfrost API key (for Cardano testnet)

## Step 1: Get API Keys

### NFT.Storage API Key
1. Go to https://nft.storage/
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `eyJ...`)

### Blockfrost API Key
1. Go to https://blockfrost.io/
2. Sign up or log in
3. Create a new project (select **Testnet**)
4. Copy the API key

## Step 2: Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment

**Windows PowerShell:**
```powershell
$env:NFT_STORAGE_API_KEY="your_nft_storage_key_here"
$env:PORT="3333"
```

**Linux/Mac:**
```bash
export NFT_STORAGE_API_KEY="your_nft_storage_key_here"
export PORT="3333"
```

Or create a `.env` file in `backend/`:
```env
NFT_STORAGE_API_KEY=your_nft_storage_key_here
PORT=3333
```

### Start Backend Server

```bash
npm start
```

You should see:
```
Backend listening on :3333
```

### Test Backend

In a new terminal:
```bash
cd backend
npm test
```

Expected output:
- ✅ POST /issue-request → Returns `{ id, metadataURI }`
- ✅ GET /requests → Returns all requests
- ✅ POST /mark-issued → Returns `{ ok: true }`

## Step 3: Frontend Setup

### Install Dependencies

```bash
# From project root
npm install
```

### Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_BLOCKFROST_KEY=your_blockfrost_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
```

### Start Frontend

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 4: Install Nami Wallet

1. Install Nami wallet extension:
   - Chrome: https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifbdkdpagmoelkjj
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/nami-wallet/

2. Create or import a testnet wallet
3. Get testnet ADA from a faucet:
   - https://docs.cardano.org/cardano-testnet/testnet-faucet
   - Or use: https://testnets.cardano.org/en/testnets/cardano/tools/faucet/

## Step 5: Test the Complete Flow

### Option 1: Using Example Component

Create a test page in your Next.js app:

```tsx
// app/test-mint/page.tsx
'use client';

import { MintReceiptWithProofExample } from '@/lib/cardano/example-with-proof';

export default function TestMintPage() {
  return <MintReceiptWithProofExample />;
}
```

Navigate to `/test-mint` and:
1. Fill in recipient address
2. Enter amount (e.g., 1000000 lovelace = 1 ADA)
3. Enter description
4. Set proof type and inputs
5. Click "Mint Receipt with Proof"

### Option 2: Manual Testing

#### 1. Create Invoice Request

```bash
curl -X POST http://localhost:3333/issue-request \
  -H "Content-Type: application/json" \
  -d '{
    "recipientDID": "did:cardano:test123",
    "recipientAddress": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk",
    "amount": "1000000",
    "description": "Test payment receipt",
    "issuer": "MetaMesh"
  }'
```

Save the `id` and `metadataURI` from the response.

#### 2. Mint NFT (Frontend)

Use the minting function in your frontend code:

```typescript
import { mintReceiptWithProof } from '@/lib/cardano/mint-with-proof';
import { createPolicyFromWallet } from '@/lib/cardano/mint';

// Create policy
const policy = await createPolicyFromWallet(process.env.NEXT_PUBLIC_BLOCKFROST_KEY!);

// Mint with proof
const { txHash, proof } = await mintReceiptWithProof(
  metadataURI, // from step 1
  recipientAddress,
  policy,
  process.env.NEXT_PUBLIC_BLOCKFROST_KEY!,
  { score: 85, threshold: 80 },
  'eligibility'
);

console.log('Transaction:', txHash);
console.log('Proof:', proof);
```

#### 3. Mark as Issued

```bash
curl -X POST http://localhost:3333/mark-issued \
  -H "Content-Type: application/json" \
  -d '{
    "id": "YOUR_ID_FROM_STEP_1",
    "txId": "YOUR_TX_HASH_FROM_STEP_2"
  }'
```

#### 4. Verify

- Check backend store: `backend/data/store.json`
- View transaction: https://testnet.cardanoscan.io/transaction/{txHash}
- Check proof artifact: `midnight/proof_samples/proof-{id}.json`

## Step 6: Verify Everything Works

### Backend Verification

```bash
# Check server is running
curl http://localhost:3333/requests

# Should return stored requests (may be empty initially)
```

### Frontend Verification

1. Open browser console
2. Check for errors
3. Verify wallet connection works
4. Test minting flow

### Proof Verification

```bash
# Test proof generation (backend)
cd midnight
npx ts-node test-proof.ts
```

## Troubleshooting

### Backend Issues

**Error: NFT_STORAGE_API_KEY not set**
- Make sure environment variable is set
- Restart the server after setting it

**Error: Port 3333 already in use**
```bash
# Change port
$env:PORT="3334"  # Windows
export PORT="3334"  # Linux/Mac
```

**Error: Cannot connect to IPFS**
- Check NFT.Storage API key is valid
- Check internet connection
- Verify API key hasn't expired

### Frontend Issues

**Error: Cardano wallet not found**
- Install Nami wallet extension
- Refresh the page
- Make sure wallet is unlocked

**Error: Blockfrost API key invalid**
- Check `.env.local` file exists
- Verify key is for testnet (not mainnet)
- Restart Next.js dev server after changing `.env.local`

**Error: Insufficient funds**
- Add testnet ADA to wallet
- Use Cardano testnet faucet

### Minting Issues

**Transaction fails**
- Check wallet has enough ADA for fees
- Verify network is set to testnet
- Check Blockfrost API key is valid

**Proof hash not in metadata**
- Verify proof was generated before minting
- Check proof hash is passed to `mintReceipt` function

## Project Structure Quick Reference

```
.
├── backend/              # Express API server
│   ├── server.js         # Main server file
│   ├── services/         # IPFS and storage services
│   └── test-endpoints.js # Test script
│
├── lib/cardano/          # Cardano integration
│   ├── mint.ts          # Core minting
│   ├── mint-with-proof.ts # Minting with proof
│   └── useMintWithProof.ts # React hook
│
├── midnight/             # Midnight proof integration
│   ├── contract.ts      # Backend proof generation
│   ├── proof.ts         # Frontend proof generation
│   └── proof_samples/   # Generated proofs
│
└── .env.local           # Frontend environment (create this)
```

## Next Steps

1. ✅ Backend running and tested
2. ✅ Frontend running and tested
3. ✅ Wallet connected
4. ✅ Test minting flow
5. ✅ Verify proof generation
6. ✅ Check transaction on explorer

## Support

- Backend docs: `backend/README.md`
- Backend testing: `backend/TESTING.md`
- Frontend docs: `lib/cardano/README.md`
- Frontend testing: `lib/cardano/TESTING.md`
- Midnight docs: `midnight/README.md`
- Complete summary: `PHASE2-COMPLETE.md`

## Quick Commands Reference

```bash
# Backend
cd backend
npm install
$env:NFT_STORAGE_API_KEY="key"
npm start
npm test

# Frontend
npm install
npm run dev

# Test proof generation
cd midnight
npx ts-node test-proof.ts
```

Happy coding! 🚀

