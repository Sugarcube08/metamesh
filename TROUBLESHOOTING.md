# Troubleshooting Checklist

Complete troubleshooting guide for MetaMesh Phase 2 before demo.

## Backend Issues Checklist

### ❌ NFT_STORAGE_API_KEY missing

**Symptoms:**
- Error: "NFT_STORAGE_API_KEY environment variable is not set"
- IPFS upload fails

**Solution:**
```powershell
# Windows PowerShell
$env:NFT_STORAGE_API_KEY="c826a105.97919a18bd92429e9f35ed8e38cebe72"

# Then restart backend
npm start
```

**Verify:**
```powershell
echo $env:NFT_STORAGE_API_KEY
```

### ❌ Port 3333 already in use

**Symptoms:**
- Error: "EADDRINUSE: address already in use :::3333"
- Server won't start

**Solution:**
```powershell
# Option 1: Use different port
$env:PORT="3334"
npm start

# Option 2: Kill process on port 3333
# Find process:
netstat -ano | findstr :3333
# Kill process (replace PID):
taskkill /PID <PID> /F
```

### ❌ IPFS upload failed

**Symptoms:**
- Error from nft.storage
- Metadata URI not returned

**Solutions:**
1. Check API key is valid
2. Check internet connection
3. Verify nft.storage service is up
4. Try again (may be temporary)

**Test:**
```bash
curl -X POST http://localhost:3333/issue-request \
  -H "Content-Type: application/json" \
  -d '{"recipientDID":"test","recipientAddress":"addr1...","amount":"1000000","description":"test","issuer":"MetaMesh"}'
```

## Frontend Issues Checklist

### ❌ Nami wallet not detected

**Symptoms:**
- Error: "Cardano wallet not found"
- Wallet popup doesn't appear

**Solutions:**
1. **Install Nami wallet:**
   - Chrome: https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifbdkdpagmoelkjj
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/nami-wallet/

2. **Enable wallet:**
   - Click Nami extension icon
   - Unlock wallet
   - Refresh page

3. **Check wallet is connected:**
   - Open browser console (F12)
   - Type: `window.cardano.nami`
   - Should return wallet object

**Verify:**
```javascript
// In browser console
console.log(window.cardano?.nami);
```

### ❌ Wrong network configuration

**Symptoms:**
- Transaction fails
- Wrong network selected

**Solutions:**
1. **Check .env.local:**
   ```env
   NEXT_PUBLIC_CARDANO_NETWORK=Mainnet
   ```

2. **Verify wallet network:**
   - Nami wallet should be on Mainnet
   - Check wallet settings

3. **Restart frontend:**
   ```bash
   # Stop dev server (Ctrl+C)
   npm run dev
   ```

### ❌ Insufficient ADA

**Symptoms:**
- Error: "Insufficient funds"
- Transaction fails

**Solutions:**
1. **Check wallet balance:**
   - Open Nami wallet
   - Verify you have enough ADA for fees

2. **Minimum required:**
   - ~2-3 ADA for minting transaction
   - Plus transaction fees

3. **Get more ADA:**
   - Mainnet: Buy from exchange
   - Preprod: Use testnet faucet

### ❌ Environment variables not loading

**Symptoms:**
- Network defaults to wrong value
- Backend URL incorrect

**Solutions:**
1. **Check .env.local exists:**
   - Location: Project root (not in subdirectories)
   - Name: `.env.local` (exact name)

2. **Verify format:**
   ```env
   NEXT_PUBLIC_CARDANO_NETWORK=Mainnet
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
   ```

3. **Restart dev server:**
   - Stop: Ctrl+C
   - Start: `npm run dev`

## Minting Issues Checklist

### ❌ Wallet popup not appearing

**Symptoms:**
- Click "Mint" but no wallet popup
- Transaction doesn't start

**Solutions:**
1. **Check wallet is enabled:**
   - Nami extension unlocked
   - Wallet connected

2. **Check browser permissions:**
   - Allow popups for localhost
   - Check browser console for errors

3. **Try different wallet:**
   - Eternl, Flint, or other Cardano wallets
   - Update code to support other wallets

### ❌ Transaction failing (low ADA)

**Symptoms:**
- Transaction submitted but fails
- Error about insufficient funds

**Solutions:**
1. **Check wallet balance:**
   - Need minimum 2-3 ADA
   - Plus fees (~0.17 ADA)

2. **Check UTxOs:**
   - Wallet may have fragmented UTxOs
   - Consolidate if needed

3. **Reduce transaction size:**
   - Smaller metadata
   - Simpler transaction

### ❌ Metadata missing in CIP-25 standard

**Symptoms:**
- NFT minted but metadata not visible
- Explorer shows no metadata

**Solutions:**
1. **Verify metadata format:**
   - Check CIP-25 structure
   - Label 721 for NFT metadata

2. **Check transaction:**
   - View on Cardanoscan
   - Check metadata tab

3. **Verify policy ID:**
   - Policy ID must match
   - Asset name correct

### ❌ Proof hash not included

**Symptoms:**
- Proof generated but not in metadata
- Transaction missing proof hash

**Solutions:**
1. **Check proof generation:**
   ```bash
   cd midnight
   npx ts-node test-proof.ts
   ```

2. **Verify proof passed to mint:**
   - Check console logs
   - Verify proof hash exists

3. **Check metadata structure:**
   - Proof hash in CIP-25 metadata
   - Or in label 674

## Network-Specific Issues

### Mainnet Issues

**Wallet on wrong network:**
- Ensure Nami is on Mainnet
- Check wallet settings

**Insufficient mainnet ADA:**
- Need real ADA (not testnet)
- Get from exchange

### Preprod Issues

**Testnet ADA:**
- Use faucet: https://docs.cardano.org/cardano-testnet/testnet-faucet
- Or: https://testnets.cardano.org/en/testnets/cardano/tools/faucet/

**Network mismatch:**
- Ensure .env.local has `Preprod`
- Wallet on Preprod testnet

## Quick Diagnostic Commands

### Check Backend
```bash
# Test endpoints
cd backend
npm test

# Check server running
curl http://localhost:3333/requests
```

### Check Frontend
```bash
# Check environment
echo $env:NEXT_PUBLIC_CARDANO_NETWORK

# Check build
npm run build
```

### Check Wallet
```javascript
// Browser console
console.log(window.cardano?.nami?.enable);
```

### Check Proof
```bash
cd midnight
npx ts-node test-proof.ts
ls proof_samples/
```

## Pre-Demo Checklist

Before demo, verify:

- [ ] Backend running and tested
- [ ] Frontend running and tested
- [ ] Wallet connected and has ADA
- [ ] Network configured correctly (Mainnet/Preprod)
- [ ] Test transaction successful
- [ ] Proof generation working
- [ ] All verifications pass
- [ ] Backup plan ready (video/artifacts)

## Emergency Fixes

### Backend won't start
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Restart
cd backend
npm start
```

### Frontend won't start
```bash
# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall
npm install
npm run dev
```

### Wallet issues
1. Disable/re-enable extension
2. Clear browser cache
3. Try different browser
4. Reinstall wallet extension

## Getting Help

If issues persist:
1. Check browser console for errors
2. Check backend terminal for errors
3. Review logs in `backend/data/store.json`
4. Check proof files in `midnight/proof_samples/`
5. Verify all environment variables

---

**Remember:** Test everything before the demo!

