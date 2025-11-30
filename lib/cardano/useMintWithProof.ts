// lib/cardano/useMintWithProof.ts
// React hook for minting with Midnight proof

import { useState } from 'react';
import { mintReceiptWithProof, saveProofArtifact } from './mint-with-proof';
import { PolicyConfig } from './mint';

// Proof artifact type (matches both contract.ts and proof.ts)
type ProofArtifact = {
  id: string;
  proofHash: string;
  contractName: string;
  inputs: Record<string, any>;
  output: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
};

interface UseMintWithProofResult {
  mintWithProof: (
    metadataURI: string,
    recipientAddress: string,
    policy?: PolicyConfig,
    proofInputs?: { score?: number; threshold?: number; amount?: number; minimum?: number },
    proofType?: 'eligibility' | 'payment'
  ) => Promise<{ txHash: string; proof: ProofArtifact }>;
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  proof: ProofArtifact | null;
  saveProof: () => string | null;
}

/**
 * React hook for minting receipt NFTs with Midnight proof
 * @param network - Network to use (Preprod for testnet, Mainnet for mainnet)
 * @returns Mint function with proof and state
 */
export function useMintWithProof(network: "Preprod" | "Mainnet" = "Preprod"): UseMintWithProofResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [proof, setProof] = useState<ProofArtifact | null>(null);

  const mintWithProof = async (
    metadataURI: string,
    recipientAddress: string,
    policy?: PolicyConfig,
    proofInputs: { score?: number; threshold?: number; amount?: number; minimum?: number } = {},
    proofType: 'eligibility' | 'payment' = 'eligibility'
  ): Promise<{ txHash: string; proof: ProofArtifact }> => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);
    setProof(null);

    try {
      // Create policy if not provided
      if (!policy) {
        const { createPolicyFromWallet } = await import('./mint');
        policy = await createPolicyFromWallet(network);
      }

      // Mint with proof
      const result = await mintReceiptWithProof(
        metadataURI,
        recipientAddress,
        policy,
        network,
        proofInputs,
        proofType
      );

      setTxHash(result.txHash);
      setProof(result.proof);
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const saveProof = (): string | null => {
    if (!proof) return null;
    return saveProofArtifact(proof);
  };

  return { mintWithProof, isLoading, error, txHash, proof, saveProof };
}

