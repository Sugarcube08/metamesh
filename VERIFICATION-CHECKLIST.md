# MetaMesh Phase 2 - Verification Checklist

Use this checklist to verify all components are working before demo/testing.

## Pre-Setup Verification

### Environment Check
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git repository initialized
- [ ] Project directory structure exists

### API Keys
- [ ] NFT.Storage API key obtained
- [ ] Blockfrost API key obtained (testnet)
- [ ] Keys stored securely (not committed to git)

## Backend Verification

### Installation
- [ ] `cd backend && npm install` completed successfully
- [ ] No errors in `node_modules/`
- [ ] `package.json` has all dependencies

### Configuration
- [ ] `NFT_STORAGE_API_KEY` environment variable set
- [ ] `PORT` environment variable set (or using default 3333)
- [ ] `.env` file created (if using)

### Server
- [ ] `npm start` runs without errors
- [ ] Server listens on port 3333 (or configured port)
- [ ] Console shows: "Backend listening on :3333"

### Endpoints
- [ ] `POST /issue-request` returns `{ id, metadataURI }`
- [ ] `GET /requests` returns stored requests
- [ ] `POST /mark-issued` returns `{ ok: true }`
- [ ] CORS headers present in responses

### Services
- [ ] IPFS service connects to nft.storage
- [ ] Metadata pins successfully to IPFS
- [ ] Store service saves to `backend/data/store.json`
- [ ] Store service loads existing data

### Testing
- [ ] `npm test` runs successfully
- [ ] All test endpoints return expected responses
- [ ] No errors in test output

## Frontend Verification

### Installation
- [ ] `npm install` completed successfully
- [ ] No errors in `node_modules/`
- [ ] All dependencies installed (lucid-cardano, etc.)

### Configuration
- [ ] `.env.local` file created
- [ ] `NEXT_PUBLIC_BLOCKFROST_KEY` set in `.env.local`
- [ ] `NEXT_PUBLIC_BACKEND_URL` set (or using default)

### Development Server
- [ ] `npm run dev` runs without errors
- [ ] Server starts on http://localhost:3000
- [ ] No TypeScript errors
- [ ] No build errors

### Wallet Integration
- [ ] Nami wallet extension installed
- [ ] Wallet connects to testnet
- [ ] Wallet has testnet ADA
- [ ] `window.cardano.nami` available in browser console

### Components
- [ ] Example components import without errors
- [ ] `MintReceiptExample` renders
- [ ] `MintReceiptWithProofExample` renders
- [ ] Forms accept input

## Cardano Integration Verification

### Lucid Setup
- [ ] Lucid initializes with Blockfrost
- [ ] Testnet network configured
- [ ] Wallet selection works
- [ ] Address retrieval works

### Minting
- [ ] Policy creation works (on-the-fly)
- [ ] Transaction building works
- [ ] Metadata attachment works
- [ ] Transaction signing works
- [ ] Transaction submission works
- [ ] Transaction hash returned

### Metadata
- [ ] CIP-25 metadata (label 721) attached
- [ ] Custom metadata (label 674) attached (if proof provided)
- [ ] Metadata includes all required fields

## Midnight Proof Verification

### Backend Proof Generation
- [ ] `midnight/contract.ts` compiles
- [ ] Proof generator creates proofs
- [ ] Proof artifacts save to `midnight/proof_samples/`
- [ ] Proof hash generated correctly

### Frontend Proof Generation
- [ ] `midnight/proof.ts` works in browser
- [ ] Proof creation functions work
- [ ] Proof hash matches backend generation

### Integration
- [ ] Proof hash included in minting
- [ ] Proof hash in transaction metadata
- [ ] Proof artifact saved/downloaded
- [ ] Proof verification works

### Testing
- [ ] `npx ts-node midnight/test-proof.ts` runs
- [ ] Proof generation tests pass
- [ ] Proof verification tests pass

## End-to-End Flow Verification

### Complete Flow
1. [ ] Create invoice via backend → Get `{ id, metadataURI }`
2. [ ] Generate proof → Get proof hash
3. [ ] Mint NFT with proof → Get transaction hash
4. [ ] Mark as issued → Backend updates status
5. [ ] Verify transaction on Cardanoscan
6. [ ] Verify proof hash in metadata
7. [ ] Compare with proof artifact

### Data Persistence
- [ ] Backend store persists requests
- [ ] Proof artifacts saved
- [ ] Transaction hashes recorded

## Documentation Verification

- [ ] `GETTING-STARTED.md` exists and is complete
- [ ] `README.md` exists and is accurate
- [ ] `PHASE2-COMPLETE.md` exists
- [ ] `TESTING-SUMMARY.md` exists
- [ ] All module README files exist
- [ ] Example code works as documented

## Demo Readiness

- [ ] All verification items above checked
- [ ] Test transaction successful
- [ ] Proof generation working
- [ ] Backup plan prepared (video/artifacts)
- [ ] Architecture diagram ready
- [ ] Key talking points prepared

## Quick Verification Commands

```bash
# Backend
cd backend
npm test  # Should pass all tests

# Frontend
npm run build  # Should build without errors

# Proof
cd midnight
npx ts-node test-proof.ts  # Should generate proofs

# End-to-end
# Run complete flow manually and verify each step
```

## Issues Found

Document any issues found during verification:

1. [ ] Issue: ________________
   - Solution: ________________

2. [ ] Issue: ________________
   - Solution: ________________

## Sign-Off

- [ ] All critical items verified
- [ ] System ready for demo
- [ ] Backup plan in place
- [ ] Team briefed on demo flow

**Verified by:** ________________  
**Date:** ________________  
**Status:** ✅ Ready / ⚠️ Issues / ❌ Not Ready

