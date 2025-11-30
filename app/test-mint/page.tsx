'use client';

import { MintReceiptWithProofExample } from '@/lib/cardano/example-with-proof';

export default function TestMintPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">MetaMesh Receipt NFT Minting Test</h1>
        <p className="text-muted-foreground mb-8">
          Test the complete flow: Create invoice → Mint NFT with proof → Verify
        </p>
        <MintReceiptWithProofExample />
      </div>
    </div>
  );
}

