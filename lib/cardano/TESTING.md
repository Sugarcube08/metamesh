# Frontend Minting Testing Guide

This guide shows how to test the Lucid minting integration.

## Prerequisites

1. Nami wallet (or other Cardano wallet) installed
2. Wallet connected to Cardano testnet
3. Testnet ADA in wallet (for transaction fees)
4. `NEXT_PUBLIC_BLOCKFROST_KEY` set in `.env.local`
5. Backend server running

## Environment Setup

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_BLOCKFROST_KEY=your_blockfrost_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
```

## Quick Test

### Using the Example Component

1. Import and use the example component:
```tsx
import { MintReceiptExample } from '@/lib/cardano/example-integration';

export default function TestPage() {
  return <MintReceiptExample />;
}
```

2. Fill in the form and click "Mint Receipt"

### Using the Hook

```tsx
'use client';

import { useMint } from '@/lib/cardano/useMint';

export function MyComponent() {
  const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_KEY || '';
  const { mint, isLoading, error, txHash } = useMint(blockfrostKey);

  const handleMint = async () => {
    try {
      // 1. Get metadataURI from backend
      const response = await fetch('http://localhost:3333/issue-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientDID: 'did:cardano:test123',
          recipientAddress: 'addr_test1...',
          amount: '1000000',
          description: 'Test receipt',
          issuer: 'MetaMesh',
        }),
      });
      
      const { id, metadataURI } = await response.json();
      
      // 2. Create policy and mint
      const hash = await mint(metadataURI, 'addr_test1...');
      
      // 3. Mark as issued
      await fetch('http://localhost:3333/mark-issued', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, txId: hash }),
      });
      
      console.log('Success! TX:', hash);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? 'Minting...' : 'Mint Receipt'}
      </button>
      {error && <p>Error: {error}</p>}
      {txHash && <p>TX: {txHash}</p>}
    </div>
  );
}
```

## Direct Function Usage

```typescript
import { mintReceipt, createPolicyFromWallet } from '@/lib/cardano/mint';

// Create policy
const policy = await createPolicyFromWallet(process.env.NEXT_PUBLIC_BLOCKFROST_KEY!);

// Mint NFT
const txHash = await mintReceipt(
  'ipfs://Qm...', // metadataURI from backend
  'addr_test1...', // recipient address
  policy,
  process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
);

console.log('Transaction hash:', txHash);
```

## Test Flow

1. **Connect Wallet** → Ensure Nami is installed and connected
2. **Request Invoice** → Call backend `/issue-request` endpoint
3. **Create Policy** → Use `createPolicyFromWallet()` or load from files
4. **Mint NFT** → Call `mintReceipt()` with metadataURI
5. **Mark as Issued** → Call backend `/mark-issued` with txHash

## Example Testnet Addresses

- **Test Address 1:** `addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk`
- **Test Address 2:** `addr_test1qpmxr8d8jcl25kyz2mm2uvpqph3wjh6g0xqj8vxq9z3t5k4h5m6n7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4`

## Viewing Transactions

After minting, view the transaction on Cardano testnet explorer:
- **Cardanoscan:** https://testnet.cardanoscan.io/transaction/{txHash}
- **Blockfrost:** Check via Blockfrost API

## Troubleshooting

### Error: "Cardano wallet not found"
- Install Nami wallet extension
- Ensure wallet is unlocked
- Refresh the page

### Error: "Insufficient funds"
- Add testnet ADA to your wallet
- Use a Cardano testnet faucet

### Error: "Blockfrost API key invalid"
- Check `NEXT_PUBLIC_BLOCKFROST_KEY` in `.env.local`
- Ensure the key is for testnet (not mainnet)

### Error: "Policy creation failed"
- Ensure wallet is connected
- Check wallet has sufficient funds
- Verify network is set to testnet

## Test Scripts

See `lib/cardano/test-mint.ts` for example test functions.

