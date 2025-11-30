# ✅ Ready to Test - MetaMesh Phase 2

## 🎉 Setup Complete!

Both backend and frontend are now running and ready for testing.

## Current Status

### ✅ Backend
- **Status:** Running on http://localhost:3333
- **Tests:** All passing ✅
- **API Key:** Configured
- **Endpoints:** All working

### ✅ Frontend  
- **Status:** Running on http://localhost:3000
- **Environment:** Configured for Mainnet
- **Test Page:** Ready at /test-mint

## 🚀 Test the Complete Flow

### Step 1: Create Invoice (Backend)

Open a new terminal and run:

```bash
curl -X POST http://localhost:3333/issue-request \
  -H "Content-Type: application/json" \
  -d '{
    "recipientDID": "did:test123",
    "recipientAddress": "addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9",
    "amount": "1000000",
    "description": "Test payment receipt",
    "issuer": "MetaMesh"
  }'
```

**Save the response:** `{ "id": "...", "metadataURI": "ipfs://..." }`

### Step 2: Mint NFT (Frontend)

1. **Open browser:** http://localhost:3000/test-mint

2. **Form is pre-filled with:**
   - Recipient Address: `addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9`

3. **Fill in:**
   - Amount: `1000000`
   - Description: `Test payment receipt`
   - Proof Type: `Eligibility`
   - Score: `85`
   - Threshold: `80`

4. **Click:** "Mint Receipt with Proof"

5. **Nami wallet will pop up:**
   - Review transaction
   - Sign transaction
   - Wait for confirmation

6. **Save:**
   - Transaction Hash (txHash)
   - Proof hash
   - Download proof artifact

### Step 3: Mark as Issued (Backend)

```bash
curl -X POST http://localhost:3333/mark-issued \
  -H "Content-Type: application/json" \
  -d '{
    "id": "YOUR_ID_FROM_STEP_1",
    "txId": "YOUR_TXHASH_FROM_STEP_2"
  }'
```

### Step 4: Verify Everything

✅ **Transaction:** https://cardanoscan.io/transaction/{txHash}
✅ **Metadata:** Check IPFS URI from Step 1
✅ **Proof:** `midnight/proof_samples/proof-{id}.json`
✅ **Backend:** `backend/data/store.json`

## 🔍 Quick Verification

### Check Backend
```bash
curl http://localhost:3333/requests
```

### Check Frontend
- Open: http://localhost:3000/test-mint
- Should see the minting form

### Check Wallet
- Nami extension installed ✅
- Wallet unlocked ✅
- Network: Mainnet ✅
- Has ADA for fees ✅

## 📋 Pre-Demo Checklist

- [x] Backend running and tested
- [x] Frontend running
- [x] Environment configured
- [ ] Wallet connected (Nami)
- [ ] Test transaction successful
- [ ] Proof generation working
- [ ] All verifications pass

## 🎯 Next Actions

1. **Connect Nami wallet** (if not already)
2. **Test complete flow** (Steps 1-4 above)
3. **Verify all components** working
4. **Ready for demo!** 🚀

## 📚 Documentation

- **Complete Flow:** `TEST-COMPLETE-FLOW.md`
- **Troubleshooting:** `TROUBLESHOOTING.md`
- **Quick Start:** `QUICK-START.md`
- **Setup Status:** `SETUP-STATUS.md`

---

**Everything is ready! Start testing the complete flow now.** 🎉

