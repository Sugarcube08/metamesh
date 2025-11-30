# Fixes Applied

## Issue: Next.js Lock File Error

**Problem:** "Unable to acquire lock at .next/dev/lock"

**Solution Applied:**
1. ✅ Killed all Node.js processes
2. ✅ Removed lock file (if exists)
3. ✅ Restarted dev server

## Issue: Koios Import Error

**Problem:** "Export Koios doesn't exist in target module"

**Solution Applied:**
- Updated `lib/cardano/payInvoice.ts` to use dynamic import
- Same pattern as `lib/cardano/mint.ts`
- Uses `require()` with fallback handling

**Code Change:**
```typescript
// Before (causing error):
import { Koios } from "lucid-cardano";

// After (fixed):
let Koios: any;
try {
  Koios = require("lucid-cardano").Koios;
} catch {
  const lucidModule = require("lucid-cardano");
  Koios = lucidModule.Koios || lucidModule.default?.Koios;
}
```

## Status

- ✅ Node processes cleaned up
- ✅ Lock file handled
- ✅ Koios import fixed
- ✅ Frontend restarting

## Next Steps

1. Wait for frontend to fully start (may take 10-15 seconds)
2. Check http://localhost:3000
3. If errors persist, check browser console

## If Issues Continue

1. **Clear Next.js cache:**
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

2. **Reinstall dependencies:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run dev
   ```

3. **Check lucid-cardano version:**
   ```powershell
   npm list lucid-cardano
   ```

