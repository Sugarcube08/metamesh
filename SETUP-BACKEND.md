# Backend Setup Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Set Environment Variables

### Windows PowerShell:
```powershell
$env:NFT_STORAGE_API_KEY="37295a5d.c598571f36ee493492eb9dbbae940b34"
$env:PORT="3333"
```

### Linux/Mac:
```bash
export NFT_STORAGE_API_KEY="37295a5d.c598571f36ee493492eb9dbbae940b34"
export PORT="3333"
```

## Step 3: Start Backend Server

```bash
npm start
```

**Expected output:**
```
Backend listening on :3333
```

## Step 4: Test Backend

In a new terminal window:

```bash
cd backend
npm test
```

**Expected output:**
```
=== Testing POST /issue-request ===
✅ Success!

=== Testing GET /requests ===
✅ Success!

=== Testing POST /mark-issued ===
✅ Success!
```

If all endpoints show ✅, the backend is working correctly!

## Troubleshooting

### Port Already in Use
If port 3333 is already in use:
```powershell
# Windows
$env:PORT="3334"
npm start
```

### NFT_STORAGE_API_KEY Error
Make sure the environment variable is set before starting:
```powershell
# Check if set
echo $env:NFT_STORAGE_API_KEY

# If empty, set it again
$env:NFT_STORAGE_API_KEY="37295a5d.c598571f36ee493492eb9dbbae940b34"
```

### Server Not Starting
1. Check Node.js version: `node --version` (should be 18+)
2. Reinstall dependencies: `npm install`
3. Check for errors in console

## Next Steps

Once backend is running:
1. Keep this terminal open
2. Open a new terminal for frontend setup
3. See `SETUP-FRONTEND.md` for frontend instructions

