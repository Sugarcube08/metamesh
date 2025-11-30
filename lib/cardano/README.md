# Cardano Mint Integration

Lucid-based minting functions for MetaMesh receipt NFTs.

## Setup

1. Install dependencies (already done):
```bash
npm install lucid-cardano
```

2. Set environment variable in `.env.local`:
```
NEXT_PUBLIC_BLOCKFROST_KEY=your_blockfrost_api_key
```

## Usage

### Basic Minting

```typescript
import { mintReceipt, createPolicyFromWallet } from '@/lib/cardano/mint';

// Option 1: Create policy on-the-fly (for demo/hackathon)
const policy = await createPolicyFromWallet(process.env.NEXT_PUBLIC_BLOCKFROST_KEY!);
const txHash = await mintReceipt(
  'ipfs://Qm...', // metadataURI from backend
  'addr_test1...', // recipient address
  policy,
  process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
);

// Option 2: Use pre-generated policy (for production)
const txHash = await mintReceipt(
  'ipfs://Qm...',
  'addr_test1...',
  {
    policyId: 'abc123...', // from policy files
    policyScript: policyScript, // loaded from files
  },
  process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
);
```

### Integration with Backend

```typescript
// 1. Request invoice from backend
const response = await fetch('http://localhost:3333/issue-request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientDID: 'did:example:123',
    recipientAddress: 'addr_test1...',
    amount: '1000000',
    description: 'Payment receipt',
    issuer: 'MetaMesh',
  }),
});
const { id, metadataURI } = await response.json();

// 2. Create policy and mint NFT
const policy = await createPolicyFromWallet(process.env.NEXT_PUBLIC_BLOCKFROST_KEY!);
const txHash = await mintReceipt(
  metadataURI,
  recipientAddress,
  policy,
  process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
);

// 3. Mark as issued in backend
await fetch('http://localhost:3333/mark-issued', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id, txId: txHash }),
});
```

## Policy Files (Optional)

For production, generate policy files using `cardano-cli`:

```bash
# Generate keys
cardano-cli address key-gen \
  --verification-key-file contracts/policy/policy.vkey \
  --signing-key-file contracts/policy/policy.skey

# Get key hash
cardano-cli address key-hash --payment-verification-key-file contracts/policy/policy.vkey

# Create policy script (use keyHash from above)
# Save to contracts/policy/policy.script:
# {
#   "type": "sig",
#   "keyHash": "<KEY_HASH>"
# }

# Get policy ID
cardano-cli transaction policyid --script-file contracts/policy/policy.script
```

## Wallet Support

Currently supports:
- Nami wallet (primary)
- Can be extended to support Eternl, Flint, Gero, etc.

Make sure the wallet is installed and connected before calling mint functions.

