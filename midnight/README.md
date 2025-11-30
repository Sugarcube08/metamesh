# Midnight ZK Proof Integration

Midnight zero-knowledge proof integration for MetaMesh receipts. This provides privacy-preserving proof generation for receipt eligibility and payment verification.

## Overview

Midnight proofs allow users to prove properties (e.g., eligibility, payment amount) without revealing the underlying data. The proof hash is included in the Cardano transaction metadata for verification.

## Architecture

```
User Input → Midnight Contract → Proof Generation → Proof Hash → Cardano Metadata
                                      ↓
                                Proof Artifact (saved locally)
```

## Usage

### Backend (Node.js)

```typescript
import { createReceiptProof, eligibilityContract } from './midnight/contract';

// Generate eligibility proof
const proof = await createReceiptProof(
  { score: 85, threshold: 80 },
  'eligibility'
);

console.log('Proof Hash:', proof.proofHash);
// Proof saved to midnight/proof_samples/proof-{id}.json
```

### Frontend (Browser)

```typescript
import { createEligibilityProof } from './midnight/proof';
import { mintReceiptWithProof } from '@/lib/cardano/mint-with-proof';

// Generate proof
const proof = createEligibilityProof(85, 80);

// Mint with proof
const { txHash, proof: savedProof } = await mintReceiptWithProof(
  metadataURI,
  recipientAddress,
  policy,
  blockfrostKey,
  { score: 85, threshold: 80 },
  'eligibility'
);
```

## Contracts

### Eligibility Proof

Proves that a score meets a threshold:

```typescript
const proof = createEligibilityProof(score: 85, threshold: 80);
// Returns: { proofHash, output: true, ... }
```

### Payment Amount Proof

Proves that payment amount meets minimum:

```typescript
const proof = createPaymentAmountProof(amount: 2000000, minimum: 1000000);
// Returns: { proofHash, output: true, ... }
```

## Proof Artifact Structure

```json
{
  "id": "proof-1732920000000",
  "proofHash": "abc123def456...",
  "contractName": "qualifyProof",
  "inputs": {
    "score": 85,
    "threshold": 80
  },
  "output": true,
  "timestamp": "2024-11-30T03:30:00.000Z",
  "metadata": {
    "receiptType": "metamesh",
    "version": "1.0"
  }
}
```

## Integration with Minting

The proof hash is included in Cardano transaction metadata:

1. **CIP-25 Metadata (Label 721)**: Proof hash in NFT metadata
2. **Custom Metadata (Label 674)**: Proof hash as separate metadata entry

```typescript
// Mint with proof
const txHash = await mintReceipt(
  metadataURI,
  recipientAddress,
  policy,
  blockfrostKey,
  proof.proofHash  // Proof hash included in metadata
);
```

## Verification

### Verify Proof Hash

```typescript
import { verifyProof } from './midnight/proof';

const isValid = verifyProof(proofHash, proofArtifact);
```

### View Proof Artifact

Proofs are saved to `midnight/proof_samples/` directory. Each proof can be:
- Inspected manually
- Verified against transaction metadata
- Used for demonstration to judges

## Demonstration Flow

1. **User provides input** (e.g., score: 85)
2. **Generate proof** → Creates proof artifact with hash
3. **Mint NFT** → Includes proof hash in transaction metadata
4. **Verify** → Compare proof hash in artifact vs. transaction metadata

## Files

- `midnight/contract.ts` - Backend proof generation (Node.js)
- `midnight/proof.ts` - Frontend proof generation (Browser)
- `lib/cardano/mint-with-proof.ts` - Integration helper
- `midnight/proof_samples/` - Generated proof artifacts

## Production Notes

This implementation is a **practical demo** for hackathon purposes. In production:

1. Use actual Midnight SDK for proof generation
2. Implement proper cryptographic hashing
3. Add proof verification on-chain
4. Consider Midnight ↔ Cardano bridge for attestations

## Example Proof Artifacts

See `proof_samples/` directory for example proof files generated during testing.

