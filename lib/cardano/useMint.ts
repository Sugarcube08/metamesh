// lib/cardano/useMint.ts
// React hook for minting receipt NFTs

import { useState } from 'react';
import { mintReceipt, createPolicyFromWallet, PolicyConfig } from './mint';

interface UseMintResult {
  mint: (
    metadataURI: string,
    recipientAddress: string,
    policy?: PolicyConfig
  ) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
}

/**
 * React hook for minting receipt NFTs
 * @param network - Network to use (Preprod for testnet, Mainnet for mainnet)
 * @returns Mint function and state
 */
export function useMint(network: "Preprod" | "Mainnet" = "Preprod"): UseMintResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const mint = async (
    metadataURI: string,
    recipientAddress: string,
    policy?: PolicyConfig
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // Create policy if not provided
      let finalPolicy: PolicyConfig;
      if (policy) {
        finalPolicy = policy;
      } else {
        finalPolicy = await createPolicyFromWallet(network);
      }

      // Mint the NFT
      const hash = await mintReceipt(
        metadataURI,
        recipientAddress,
        finalPolicy,
        network
      );

      setTxHash(hash);
      setIsLoading(false);
      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  return { mint, isLoading, error, txHash };
}

