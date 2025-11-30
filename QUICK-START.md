# Quick Start Guide - MetaMesh Phase 2

## Your Setup

- **Wallet Name:** luce
- **Wallet Address:** `addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9`
- **Network:** Mainnet

## Step 1: Backend Setup

```powershell
cd backend
npm install
$env:NFT_STORAGE_API_KEY="37295a5d.c598571f36ee493492eb9dbbae940b34"
$env:PORT="3333"
npm start
```

**Expected:** `Backend listening on :3333`

## Step 2: Test Backend

```powershell
cd backend
npm test
```

**Expected:** All endpoints show ✅

## Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Create .env.local
Create `.env.local` in project root:
```env
NEXT_PUBLIC_CARDANO_NETWORK=Mainnet
NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
```

### 3.3 Start Frontend
```bash
npm run dev
```

**Expected:** Server running on http://localhost:3000

## Step 4: Test Complete Flow

### 4.1 Create Invoice
```bash
curl -X POST http://localhost:3333/issue-request \
  -H "Content-Type: application/json" \
  -d '{
    "recipientDID": "did:test123",
    "recipientAddress": "addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9",
    "amount": "1000000",
    "description": "Test payment",
    "issuer": "MetaMesh"
  }'
```

**Save:** `id` and `metadataURI`

### 4.2 Mint NFT
1. Open: **http://localhost:3000/test-mint**
2. Form is pre-filled with your address
3. Fill in amount, description
4. Choose proof type
5. Click "Mint Receipt with Proof"
6. Sign in Nami wallet
7. **Save:** `txHash` and `proof`

### 4.3 Mark as Issued
```bash
curl -X POST http://localhost:3333/mark-issued \
  -H "Content-Type: application/json" \
  -d '{
    "id": "YOUR_ID_FROM_STEP_4.1",
    "txId": "YOUR_TXHASH_FROM_STEP_4.2"
  }'
```

### 4.4 Verify
- ✅ Transaction: https://cardanoscan.io/transaction/{txHash}
- ✅ Metadata: ipfs://{CID}
- ✅ Proof: `midnight/proof_samples/proof-{id}.json`
- ✅ Backend: `backend/data/store.json`

## Step 5: Test Proof System

```bash
cd midnight
npx ts-node test-proof.ts
```

**Expected:** Generates `proof-<id>.json`

## Troubleshooting

See `TROUBLESHOOTING.md` for complete checklist.

## Quick Commands

```bash
# Backend
cd backend && npm start

# Frontend  
npm run dev

# Test backend
cd backend && npm test

# Test proof
cd midnight && npx ts-node test-proof.ts

# Verify setup
node verify-setup.js
```

## Files to Check

- ✅ Backend running: http://localhost:3333/requests
- ✅ Frontend running: http://localhost:3000/test-mint
- ✅ Wallet connected: Nami extension unlocked
- ✅ Network: Mainnet

## Ready for Demo!

Once all steps pass, you're ready for the hackathon demo! 🚀

