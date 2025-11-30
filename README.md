# MetaMesh Phase 2 - Receipt NFT Minting System

Complete implementation of MetaMesh Phase 2: A functional system for minting receipt NFTs on Cardano testnet with Midnight ZK proof integration.

## 🚀 Quick Start

1. **Read the Getting Started Guide:**
   ```bash
   # Open GETTING-STARTED.md for complete setup instructions
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   $env:NFT_STORAGE_API_KEY="your_key"
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   # Create .env.local with:
   # NEXT_PUBLIC_BLOCKFROST_KEY=your_key
   # NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
   
   npm install
   npm run dev
   ```

## 📋 Features

### Backend
- ✅ Express API server
- ✅ IPFS metadata pinning (nft.storage)
- ✅ Request storage and tracking
- ✅ CORS support

### Frontend
- ✅ Cardano minting with Lucid
- ✅ Wallet integration (Nami)
- ✅ CIP-25 NFT metadata
- ✅ React hooks for easy integration

### Midnight Integration
- ✅ ZK proof generation
- ✅ Proof hash in transaction metadata
- ✅ Proof artifact saving
- ✅ Verification utilities

## 📁 Project Structure

```
.
├── backend/              # Express API server
│   ├── server.js        # Main server
│   ├── services/        # IPFS & storage
│   └── test-endpoints.js # Tests
│
├── lib/cardano/         # Cardano integration
│   ├── mint.ts          # Core minting
│   ├── mint-with-proof.ts # With proof
│   └── useMintWithProof.ts # React hook
│
├── midnight/            # Midnight proofs
│   ├── contract.ts     # Backend generation
│   ├── proof.ts       # Frontend generation
│   └── proof_samples/ # Generated proofs
│
└── GETTING-STARTED.md  # Setup guide
```

## 📚 Documentation

- **[GETTING-STARTED.md](./GETTING-STARTED.md)** - Complete setup guide
- **[PHASE2-COMPLETE.md](./PHASE2-COMPLETE.md)** - Implementation summary
- **[TESTING-SUMMARY.md](./TESTING-SUMMARY.md)** - Testing reference
- **Backend:** `backend/README.md`, `backend/TESTING.md`
- **Frontend:** `lib/cardano/README.md`, `lib/cardano/TESTING.md`
- **Midnight:** `midnight/README.md`, `midnight/INTEGRATION.md`

## 🔧 API Endpoints

### POST /issue-request
Creates metadata, pins to IPFS, returns metadata URI.

### POST /mark-issued
Marks request as issued with transaction ID.

### GET /requests
Returns all stored requests.

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
Use example components:
- `MintReceiptExample` - Basic minting
- `MintReceiptWithProofExample` - With Midnight proof

## 🔑 Environment Variables

### Backend
- `NFT_STORAGE_API_KEY` - Required for IPFS
- `PORT` - Optional (default: 3333)

### Frontend
- `NEXT_PUBLIC_BLOCKFROST_KEY` - Required for Cardano
- `NEXT_PUBLIC_BACKEND_URL` - Optional (default: http://localhost:3333)

## 📦 Dependencies

### Backend
- express
- body-parser
- nft.storage

### Frontend
- lucid-cardano
- next
- react

## 🎯 Implementation Status

- ✅ Step 1: Backend structure
- ✅ Step 2: Express endpoints
- ✅ Step 3: IPFS service
- ✅ Step 4: Store handling
- ✅ Step 5: Lucid minting
- ✅ Step 6: Test calls
- ✅ Step 7: Midnight proof

**All Phase 2 requirements complete!**

## 🚦 Next Steps

1. Follow `GETTING-STARTED.md` to set up
2. Test all endpoints and minting flow
3. Generate and verify Midnight proofs
4. Prepare for demo/hackathon

## 📞 Support

See documentation files for detailed guides:
- Setup: `GETTING-STARTED.md`
- Testing: `TESTING-SUMMARY.md`
- Complete summary: `PHASE2-COMPLETE.md`

---

**Status:** ✅ Ready for testing and demonstration

