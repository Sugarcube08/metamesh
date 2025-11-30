// lib/cardano/mint-with-proof.ts
// Integration of Midnight proof with Cardano minting

import { mintReceipt, PolicyConfig } from './mint';

// Proof artifact type
export type ProofArtifact = {
  id: string;
  proofHash: string;
  contractName: string;
  inputs: Record<string, any>;
  output: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
};

// Import proof functions - use client-side version for browser compatibility
// For server-side, import from contract.ts directly
async function createProof(
  proofInputs: { score?: number; threshold?: number; amount?: number; minimum?: number },
  proofType: 'eligibility' | 'payment'
): Promise<ProofArtifact> {
  if (typeof window === 'undefined') {
    // Server-side: use contract.ts
    const { createReceiptProof } = await import('../../midnight/contract');
    return await createReceiptProof(proofInputs, proofType);
  } else {
    // Client-side: use proof.ts
    const { createEligibilityProof, createPaymentAmountProof } = await import('../../midnight/proof');
    if (proofType === 'eligibility') {
      const score = proofInputs.score || 0;
      const threshold = proofInputs.threshold || 80;
      return createEligibilityProof(score, threshold);
    } else {
      const amount = proofInputs.amount || 0;
      const minimum = proofInputs.minimum || 1000000;
      return createPaymentAmountProof(amount, minimum);
    }
  }
}

/**
 * Mint receipt with Midnight proof
 * @param metadataURI - IPFS URI from backend
 * @param recipientAddress - Cardano address to receive NFT
 * @param policy - Policy configuration
 * @param network - Network to use (Preprod for testnet, Mainnet for mainnet)
 * @param proofInputs - Inputs for proof generation (score/threshold or amount/minimum)
 * @param proofType - Type of proof to generate
 * @returns Transaction hash and proof artifact
 */
export async function mintReceiptWithProof(
  metadataURI: string,
  recipientAddress: string,
  policy: PolicyConfig,
  network: "Preprod" | "Mainnet" = "Preprod",
  proofInputs: { score?: number; threshold?: number; amount?: number; minimum?: number },
  proofType: 'eligibility' | 'payment' = 'eligibility'
): Promise<{ txHash: string; proof: ProofArtifact }> {
  // Generate proof
  const proof = await createProof(proofInputs, proofType);

  // Mint with proof hash
  const txHash = await mintReceipt(
    metadataURI,
    recipientAddress,
    policy,
    network,
    proof.proofHash
  );

  return { txHash, proof };
}

/**
 * Save proof artifact to file (for demo/verification)
 */
export function saveProofArtifact(proof: ProofArtifact): string {
  if (typeof window === 'undefined') {
    // Server-side: save to file
    const fs = require('fs');
    const path = require('path');
    const proofDir = path.join(process.cwd(), 'midnight', 'proof_samples');
    if (!fs.existsSync(proofDir)) {
      fs.mkdirSync(proofDir, { recursive: true });
    }
    const filePath = path.join(proofDir, `${proof.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(proof, null, 2), 'utf8');
    return filePath;
  } else {
    // Client-side: download
    const blob = new Blob([JSON.stringify(proof, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proof.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return `Downloaded ${proof.id}.json`;
  }
}

