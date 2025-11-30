# Complete Minting Flow Test Guide

This guide walks you through testing the complete MetaMesh Phase 2 minting flow.

## Prerequisites

- ✅ Backend running on port 3333
- ✅ Frontend running on port 3000
- ✅ Nami wallet installed and connected
- ✅ Wallet has ADA (Mainnet or Preprod testnet)
- ✅ Wallet name: **luce**
- ✅ Wallet address: `addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9`
- ✅ Network: **Mainnet**

## Step 1: Create Invoice (Backend)

Open a terminal and run:

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

**Expected Response:**
```json
{
  "id": "123456789",
  "metadataURI": "ipfs://Qm..."
}
```

**⚠️ IMPORTANT:** Save both `id` and `metadataURI` - you'll need them in the next steps!

## Step 2: Mint Receipt NFT (Frontend)

### 2.1 Open Test Page

Navigate to: **http://localhost:3000/test-mint**

### 2.2 Fill in the Form

1. **Recipient Address:** 
   ```
   addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9
   ```

2. **Amount:** `1000000` (1 ADA in lovelace)

3. **Description:** `Test payment receipt`

4. **Proof Type:** Choose `Eligibility` or `Payment Amount`

5. **If Eligibility:**
   - Score: `85`
   - Threshold: `80`

6. **If Payment Amount:**
   - Amount: `1000000`
   - Minimum: `1000000`

### 2.3 Click "Mint Receipt with Proof"

1. Your Nami wallet will pop up
2. Review the transaction
3. Sign the transaction
4. Wait for confirmation

### 2.4 Save Results

After successful minting, you'll see:
- **Transaction Hash:** `abcd123...` (save this!)
- **Proof Hash:** `xyz789...` (save this!)
- **Proof Artifact:** Click "Download Proof Artifact" to save

## Step 3: Mark as Issued (Backend)

Use the `id` from Step 1 and `txHash` from Step 2:

```bash
curl -X POST http://localhost:3333/mark-issued \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123456789",
    "txId": "abcd123..."
  }'
```

**Expected Response:**
```json
{
  "ok": true
}
```

## Step 4: Verify Everything

### 4.1 Check NFT Minted

Open in browser:
- **Mainnet:** https://cardanoscan.io/transaction/{txHash}
- **Preprod:** https://preprod.cardanoscan.io/transaction/{txHash}

Verify:
- ✅ Transaction is confirmed
- ✅ NFT was minted
- ✅ Metadata includes proof hash

### 4.2 Check Metadata on IPFS

Use the `metadataURI` from Step 1:
- Open: `ipfs://{CID}` in IPFS gateway
- Or use: https://ipfs.io/ipfs/{CID}
- Verify metadata structure

### 4.3 Check Proof File

Location: `midnight/proof_samples/proof-{id}.json`

Verify:
- ✅ File exists
- ✅ Contains proof hash
- ✅ Hash matches transaction metadata

### 4.4 Check Backend Store

Location: `backend/data/store.json`

Verify:
- ✅ Request is stored
- ✅ Status is "issued"
- ✅ Transaction ID is recorded

## Verification Checklist

| Task | Where to Check | Status |
|------|---------------|--------|
| NFT minted | Cardanoscan.io | ⬜ |
| Metadata on IPFS | ipfs://CID | ⬜ |
| Proof file saved | /midnight/proof_samples | ⬜ |
| Backend stored request | backend/data/store.json | ⬜ |
| Proof hash in metadata | Transaction on explorer | ⬜ |
| Transaction confirmed | Cardanoscan.io | ⬜ |

## Quick Test Commands

### Test Backend Endpoints
```bash
cd backend
npm test
```

### Test Proof Generation
```bash
cd midnight
npx ts-node test-proof.ts
```

### Check Backend Store
```bash
cat backend/data/store.json
```

### List Proof Files
```bash
ls midnight/proof_samples/
```

## Expected Results

### Successful Flow
1. ✅ Invoice created → Returns `{ id, metadataURI }`
2. ✅ NFT minted → Returns `{ txHash, proof }`
3. ✅ Marked as issued → Returns `{ ok: true }`
4. ✅ All verifications pass

### Transaction Details
- **Network:** Mainnet
- **Recipient:** addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9
- **Amount:** 1000000 lovelace (1 ADA)
- **Proof:** Included in metadata

## Troubleshooting

If any step fails, see `TROUBLESHOOTING.md` for detailed solutions.

## Next Steps

After successful test:
1. ✅ Record demo video
2. ✅ Prepare architecture slides
3. ✅ Document any issues found
4. ✅ Ready for hackathon demo!

