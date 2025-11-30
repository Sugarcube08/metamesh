# Frontend Setup Guide

## Step 1: Install Dependencies

From project root:
```bash
npm install
```

## Step 2: Configure Environment Variables

Create `.env.local` in the project root:

```env
# Cardano Network (Preprod for testnet, Mainnet for mainnet)
# For production/hackathon: Use Mainnet
NEXT_PUBLIC_CARDANO_NETWORK=Mainnet

# Backend URL (optional, defaults to http://localhost:3333)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
```

**Note:** No API key needed! We're using Koios API which is free and doesn't require authentication.

## Step 3: Start Frontend

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
```

Open http://localhost:3000 in your browser.

## Step 4: Verify Setup

1. **Check Backend Connection:**
   - Backend should be running on port 3333
   - Frontend will connect to it automatically

2. **Check Wallet:**
   - Install Nami wallet extension
   - Connect to Preprod testnet
   - Ensure wallet has testnet ADA

3. **Test Minting:**
   - Use example components to test minting
   - See `lib/cardano/example-with-proof.tsx`

## Using Koios API

Koios is a free, public Cardano API that:
- ✅ No API key required
- ✅ No signup needed
- ✅ No IP bans
- ✅ Very stable
- ✅ Supports Preprod and Mainnet

The code uses Koios like this:
```typescript
import { Lucid, Koios } from "lucid-cardano";

const lucid = await Lucid.new(
  new Koios("https://api.koios.rest/api/v0"),
  "Preprod"
);
```

## Troubleshooting

### Environment Variables Not Loading
- Make sure `.env.local` is in the project root (not in a subdirectory)
- Restart Next.js dev server after creating/modifying `.env.local`
- Check variable names start with `NEXT_PUBLIC_`

### Wallet Not Connecting
- Install Nami wallet extension
- Make sure wallet is unlocked
- Refresh the page
- Check browser console for errors

### Network Errors
- Verify backend is running on port 3333
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Check CORS settings in backend

## Next Steps

1. Backend should be running (see `SETUP-BACKEND.md`)
2. Frontend should be running
3. Test the complete flow:
   - Create invoice
   - Generate proof
   - Mint NFT
   - Verify transaction

