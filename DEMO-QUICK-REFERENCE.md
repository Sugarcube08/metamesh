# MetaMesh Phase 2 - Demo Quick Reference

Quick reference card for demonstrating MetaMesh Phase 2 during hackathon/presentation.

## Pre-Demo Checklist

- [ ] Backend server running (`npm start` in `backend/`)
- [ ] Frontend running (`npm run dev`)
- [ ] Nami wallet installed and connected (testnet)
- [ ] Testnet ADA in wallet
- [ ] API keys configured:
  - [ ] NFT_STORAGE_API_KEY set
  - [ ] NEXT_PUBLIC_BLOCKFROST_KEY in .env.local
- [ ] Test endpoints working (`npm test` in `backend/`)

## Demo Flow (5 minutes)

### 1. Show Backend (30 seconds)
```bash
# Terminal 1: Show backend running
cd backend
npm start
# Show: "Backend listening on :3333"

# Terminal 2: Test endpoint
npm test
# Show: All tests passing ✅
```

**Say:** "Our backend handles invoice creation, IPFS pinning, and request tracking."

### 2. Show Frontend (1 minute)
```bash
# Show frontend running
npm run dev
# Open browser to http://localhost:3000
```

**Say:** "The frontend connects to Cardano wallets and handles the minting flow."

### 3. Create Invoice (1 minute)
- Fill in form:
  - Recipient Address: `addr_test1...`
  - Amount: `1000000`
  - Description: `Demo payment receipt`
  - Proof Type: `Eligibility`
  - Score: `85`, Threshold: `80`

**Say:** "We're creating a receipt with a privacy-preserving proof that the user's score meets the threshold."

### 4. Mint NFT (2 minutes)
- Click "Mint Receipt with Proof"
- Show wallet popup (Nami)
- Sign transaction
- Show transaction hash
- Show proof hash in metadata

**Say:** "The NFT is minted on Cardano testnet with the proof hash embedded in the metadata."

### 5. Verify (30 seconds)
- Show transaction on Cardanoscan: `https://testnet.cardanoscan.io/transaction/{txHash}`
- Show proof artifact: `midnight/proof_samples/proof-{id}.json`
- Compare proof hash in artifact vs. transaction metadata

**Say:** "The proof hash in the transaction matches the proof artifact, proving the user's eligibility without revealing their actual score."

## Key Points to Emphasize

1. **Privacy-Preserving:** Midnight proof allows verification without revealing data
2. **On-Chain Verification:** Proof hash is permanently stored on Cardano
3. **IPFS Metadata:** Receipt metadata is decentralized via IPFS
4. **Complete Flow:** End-to-end from invoice to NFT minting

## Architecture Slide Points

```
Frontend (React/Next.js)
    ↓
Backend (Express) → IPFS (nft.storage)
    ↓
Cardano (Lucid) → Mint NFT
    ↓
Midnight → Generate Proof → Hash in Metadata
```

**Key Technologies:**
- Frontend: React/Next.js, Lucid Cardano SDK
- Backend: Express, nft.storage
- Blockchain: Cardano testnet
- Privacy: Midnight ZK proofs

## Troubleshooting During Demo

### Backend not responding
- Check: `npm start` in backend directory
- Check: NFT_STORAGE_API_KEY is set
- Fallback: Show pre-recorded video

### Wallet not connecting
- Check: Nami extension installed
- Check: Wallet unlocked
- Fallback: Show pre-recorded transaction

### Transaction fails
- Check: Wallet has testnet ADA
- Check: Network is testnet
- Fallback: Show pre-recorded successful transaction

## Backup Plan

If live demo fails:
1. Show pre-recorded video of complete flow
2. Show proof artifacts and transaction on explorer
3. Walk through code architecture
4. Show test results

## Post-Demo Q&A Talking Points

**Q: How does the proof work?**
A: Midnight generates a zero-knowledge proof that proves a property (e.g., score >= threshold) without revealing the actual values. The proof hash is stored on-chain for verification.

**Q: Why Cardano?**
A: Cardano supports native tokens and metadata, making it ideal for receipt NFTs. The CIP-25 standard ensures compatibility.

**Q: Is this production-ready?**
A: This is a hackathon demo. For production, we'd integrate the actual Midnight SDK, add on-chain verification, and implement the Midnight-Cardano bridge.

**Q: What's the use case?**
A: Privacy-preserving receipt verification for payments, eligibility checks, and compliance without revealing sensitive data.

## Quick Commands

```bash
# Start backend
cd backend && npm start

# Test backend
cd backend && npm test

# Start frontend
npm run dev

# Test proof generation
cd midnight && npx ts-node test-proof.ts
```

## Files to Show

1. `backend/server.js` - Express API
2. `lib/cardano/mint-with-proof.ts` - Minting with proof
3. `midnight/contract.ts` - Proof generation
4. `midnight/proof_samples/` - Generated proofs
5. Transaction on Cardanoscan

---

**Remember:** Confidence, clear explanations, and have backups ready!

