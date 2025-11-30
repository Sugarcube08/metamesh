# MetaMesh Phase 3 - Demo Script for Judges

## 🎬 Complete Demo Flow (5-7 minutes)

### Setup (Before Demo)
- ✅ Backend running on port 3333
- ✅ Frontend running on port 3000
- ✅ Nami wallet connected (Mainnet)
- ✅ Wallet has ADA for fees
- ✅ Test the flow once before judges arrive

---

## Demo Script

### Introduction (30 seconds)

"Hi! I'm going to show you MetaMesh - a payment system that converts chat messages into Cardano NFTs with privacy-preserving proofs."

**Key Points:**
- Chat-based payment requests
- Automatic invoice generation
- Receipt NFTs on Cardano
- Midnight ZK proofs for privacy

---

### Step 1: Open MetaMesh UI (30 seconds)

1. Open browser: http://localhost:3000
2. Navigate to chat screen
3. Show the clean, modern UI

**Say:** "This is MetaMesh - a chat-based payment platform built on Cardano."

---

### Step 2: Request Payment via Chat (1 minute)

1. Click on a chat (e.g., "Alice.ada")
2. In the message input, type:
   ```
   Request ₹500 for logo design
   ```
3. Press Enter or click Send

**What Happens:**
- Message is sent
- System detects invoice request pattern
- Invoice automatically created via backend
- Invoice bubble appears in chat

**Say:** "I just typed a payment request in natural language. MetaMesh automatically detected it and created an invoice. Notice the invoice bubble with the amount and description."

**Show:**
- Invoice bubble with amount (500 ADA)
- Description ("logo design")
- "Pay" button

---

### Step 3: Pay Invoice (1 minute)

1. Click the "Pay" button in the invoice bubble
2. Wallet popup appears (Nami)
3. Review transaction details
4. Sign the transaction
5. Wait for confirmation

**Say:** "When the user clicks Pay, their Cardano wallet opens. They review and sign the transaction. This mints a receipt NFT on Cardano."

**Show:**
- Wallet popup
- Transaction details
- Signing process

---

### Step 4: Receipt NFT Appears (30 seconds)

**What Happens:**
- Transaction is submitted
- Backend marks invoice as paid
- Green receipt bubble appears
- Shows transaction hash
- "View on Explorer" link

**Say:** "The payment is complete! A receipt NFT has been minted. You can see the transaction hash and click to view it on the Cardano explorer."

**Show:**
- Green receipt bubble
- Transaction hash
- "View on Explorer" link

---

### Step 5: View on Explorer (1 minute)

1. Click "View on Explorer"
2. Opens Cardanoscan in new tab
3. Show transaction details
4. Show metadata (CIP-25)
5. Show proof hash (if included)

**Say:** "Here's the transaction on Cardano. You can see the NFT was minted, the metadata is stored on IPFS, and if we generated a Midnight proof, the proof hash is included in the metadata."

**Show:**
- Transaction on Cardanoscan
- NFT details
- Metadata structure
- Proof hash (if available)

---

### Step 6: Show Backend & IPFS (1 minute)

1. Show backend store: `backend/data/store.json`
2. Show IPFS metadata (if accessible)
3. Show proof artifact: `midnight/proof_samples/`

**Say:** "Behind the scenes, the backend stores the invoice, the metadata is pinned to IPFS, and if we used Midnight proofs, the proof artifact is saved locally for verification."

---

### Step 7: Architecture Overview (1 minute)

**Show/Draw:**
```
User Chat Message
    ↓
Backend API → IPFS (Metadata)
    ↓
Cardano (Lucid) → Mint NFT
    ↓
Midnight → Generate Proof → Hash in Metadata
    ↓
Receipt NFT with Proof
```

**Say:** "The complete flow: Chat message → Backend creates invoice → IPFS stores metadata → Cardano mints NFT → Midnight generates privacy-preserving proof → Everything is verifiable on-chain."

---

## Key Talking Points

### What Makes This Special

1. **Natural Language Processing**
   - Users don't need to fill forms
   - Just type naturally: "Request ₹500 for logo"

2. **Automatic Invoice Generation**
   - No manual invoice creation
   - Backend handles everything
   - IPFS for decentralized storage

3. **One-Click Payment**
   - Simple "Pay" button
   - Wallet integration
   - NFT receipt automatically minted

4. **Privacy-Preserving Proofs**
   - Midnight ZK proofs
   - Verify without revealing data
   - Proof hash on-chain

5. **Complete Integration**
   - Chat → Invoice → Payment → NFT → Proof
   - All in one seamless flow

---

## Technical Highlights

### Backend
- Express API
- IPFS metadata pinning
- Request tracking

### Frontend
- React/Next.js
- Lucid Cardano SDK
- Koios API (free, no key)

### Blockchain
- Cardano Mainnet/Preprod
- CIP-25 NFT standard
- Transaction metadata

### Privacy
- Midnight ZK proofs
- Proof hash in metadata
- Verifiable without revealing data

---

## Demo Checklist

Before starting:
- [ ] Backend running
- [ ] Frontend running
- [ ] Wallet connected
- [ ] Test flow once
- [ ] Have backup (video/artifacts)

During demo:
- [ ] Show chat UI
- [ ] Type invoice request
- [ ] Show invoice bubble
- [ ] Click Pay
- [ ] Show wallet popup
- [ ] Sign transaction
- [ ] Show receipt bubble
- [ ] Open explorer
- [ ] Show metadata
- [ ] Show proof (if available)

---

## Backup Plan

If live demo fails:
1. Show pre-recorded video
2. Show transaction on explorer
3. Show proof artifacts
4. Walk through code
5. Show architecture diagram

---

## Q&A Preparation

**Q: How does it detect invoice requests?**
A: Pattern matching on natural language. We detect phrases like "Request ₹500 for..." or "/invoice 500..."

**Q: Why Cardano?**
A: Native tokens, low fees, CIP-25 standard, and excellent metadata support.

**Q: What about the Midnight proof?**
A: We generate ZK proofs that prove properties (like eligibility) without revealing the actual data. The proof hash is stored on-chain.

**Q: Is this production-ready?**
A: This is a hackathon demo. For production, we'd integrate the actual Midnight SDK, add on-chain verification, and implement the Midnight-Cardano bridge.

**Q: What's the use case?**
A: Privacy-preserving payment receipts, eligibility verification, compliance without revealing sensitive data.

---

## Success Metrics

- ✅ Complete flow works end-to-end
- ✅ Invoice auto-detection works
- ✅ Payment mints NFT successfully
- ✅ Receipt displays correctly
- ✅ Explorer link works
- ✅ Proof hash included (if generated)

---

**Remember:** Confidence, clear explanations, and show the complete flow! 🚀

