# Midnight Proof Integration Guide

Complete guide for integrating Midnight ZK proofs with MetaMesh receipt minting.

## Overview

Midnight proofs enable privacy-preserving verification of receipt properties (eligibility, payment amount) without revealing the underlying data. The proof hash is embedded in Cardano transaction metadata for verification.

## Architecture

```
┌─────────────┐
│ User Input  │ (score: 85, threshold: 80)
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Midnight Proof   │ → Generate proof hash
│ Generator        │
└──────┬───────────┘
       │
       ├──► Proof Artifact (saved locally)
       │
       └──► Proof Hash
              │
              ▼
       ┌──────────────────┐
       │ Cardano Minting  │ → Include hash in metadata
       └──────────────────┘
```

## Quick Start

### 1. Backend Proof Generation

```typescript
import { createReceiptProof } from './midnight/contract';

// Generate eligibility proof
const proof = await createReceiptProof(
  { score: 85, threshold: 80 },
  'eligibility'
);

console.log('Proof Hash:', proof.proofHash);
// Proof saved to midnight/proof_samples/proof-{id}.json
```

### 2. Frontend Proof Generation

```typescript
import { createEligibilityProof } from './midnight/proof';

// Generate proof
const proof = createEligibilityProof(85, 80);
console.log('Proof Hash:', proof.proofHash);
```

### 3. Mint with Proof

```typescript
import { mintReceiptWithProof } from '@/lib/cardano/mint-with-proof';

const { txHash, proof } = await mintReceiptWithProof(
  metadataURI,
  recipientAddress,
  policy,
  blockfrostKey,
  { score: 85, threshold: 80 },
  'eligibility'
);
```

### 4. Using React Hook

```tsx
import { useMintWithProof } from '@/lib/cardano/useMintWithProof';

function MyComponent() {
  const { mintWithProof, isLoading, txHash, proof } = useMintWithProof(blockfrostKey);

  const handleMint = async () => {
    const result = await mintWithProof(
      metadataURI,
      recipientAddress,
      undefined, // auto-create policy
      { score: 85, threshold: 80 },
      'eligibility'
    );
    console.log('TX:', result.txHash);
    console.log('Proof:', result.proof);
  };
}
```

## Proof Types

### Eligibility Proof

Proves that a score meets a threshold:

```typescript
const proof = createEligibilityProof(score: 85, threshold: 80);
// Returns: { proofHash, output: true, ... }
```

**Use Case:** Verify user eligibility without revealing actual score.

### Payment Amount Proof

Proves that payment amount meets minimum:

```typescript
const proof = createPaymentAmountProof(amount: 2000000, minimum: 1000000);
// Returns: { proofHash, output: true, ... }
```

**Use Case:** Verify payment meets minimum requirement without revealing exact amount.

## Integration Flow

### Complete Flow Example

```typescript
// 1. Request invoice from backend
const { id, metadataURI } = await fetch('/issue-request', {
  method: 'POST',
  body: JSON.stringify({ recipientAddress, amount, ... }),
}).then(r => r.json());

// 2. Generate proof
const proof = createEligibilityProof(85, 80);

// 3. Mint NFT with proof hash
const { txHash } = await mintReceiptWithProof(
  metadataURI,
  recipientAddress,
  policy,
  blockfrostKey,
  { score: 85, threshold: 80 },
  'eligibility'
);

// 4. Mark as issued
await fetch('/mark-issued', {
  method: 'POST',
  body: JSON.stringify({ id, txId: txHash }),
});

// 5. Save proof artifact (optional, for verification)
saveProofArtifact(proof);
```

## Metadata Structure

The proof hash is included in Cardano transaction metadata:

### CIP-25 Metadata (Label 721)

```json
{
  "721": {
    "{policyId}": {
      "{assetName}": {
        "name": "MetaMesh Receipt",
        "description": "Payment receipt NFT",
        "image": "ipfs://...",
        "proofHash": "abc123def456..."
      }
    }
  }
}
```

### Custom Metadata (Label 674)

```json
{
  "674": {
    "proofHash": "abc123def456..."
  }
}
```

## Verification

### Verify Proof Hash

```typescript
// Load proof artifact
const proof = loadProof('proof-1234567890');

// Verify hash matches
const isValid = verifyProof(proofHash, proof);
```

### View on Explorer

1. Get transaction hash from minting
2. View on Cardanoscan: `https://testnet.cardanoscan.io/transaction/{txHash}`
3. Check metadata for proof hash
4. Compare with proof artifact file

## Files Structure

```
midnight/
├── contract.ts          # Backend proof generation (Node.js)
├── proof.ts            # Frontend proof generation (Browser)
├── test-proof.ts       # Test script
├── proof_samples/     # Generated proof artifacts
│   ├── proof-{id}.json
│   └── example-proof.json
└── README.md           # Documentation

lib/cardano/
├── mint-with-proof.ts  # Integration helper
├── useMintWithProof.ts # React hook
└── example-with-proof.tsx # Example component
```

## Testing

### Test Proof Generation

```bash
# Backend
cd midnight
npx ts-node test-proof.ts
```

### Test Integration

Use the example component:
```tsx
import { MintReceiptWithProofExample } from '@/lib/cardano/example-with-proof';
```

## Production Considerations

This implementation is a **practical demo** for hackathon purposes. For production:

1. **Use Actual Midnight SDK**: Replace demo proof generation with real Midnight SDK
2. **Cryptographic Hashing**: Use proper cryptographic hash functions
3. **On-Chain Verification**: Implement proof verification on Cardano
4. **Midnight Bridge**: Consider Midnight ↔ Cardano bridge for attestations
5. **Security**: Implement proper key management and proof validation

## Troubleshooting

### Proof Hash Mismatch

- Ensure same inputs are used for proof generation and verification
- Check that proof artifact file matches the one used during minting

### Proof Not Saving

- Check file permissions for `midnight/proof_samples/` directory
- Ensure directory exists (created automatically)

### Integration Errors

- Verify all imports are correct
- Check that environment (browser vs Node.js) matches the proof module used

## Next Steps

- [ ] Integrate with actual Midnight SDK
- [ ] Add proof verification endpoint
- [ ] Implement proof verification on-chain
- [ ] Add Midnight bridge integration
- [ ] Create proof verification UI

