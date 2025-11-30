// midnight/proof.ts
// Client-side proof generation for frontend

import * as crypto from 'crypto';

/**
 * Proof artifact structure (matches backend)
 */
export interface ProofArtifact {
  id: string;
  proofHash: string;
  contractName: string;
  inputs: Record<string, any>;
  output: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Generate proof hash (client-side)
 * This mimics what Midnight SDK would do
 */
export function generateProofHash(inputs: Record<string, any>, contractName: string): string {
  const inputString = JSON.stringify({ inputs, contractName });
  // In browser, use Web Crypto API
  // For demo, we'll use a simple hash
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  
  // Use SubtleCrypto if available, otherwise fallback
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // For production, use proper async hashing
    // For demo, we'll use a synchronous approach
    return simpleHash(inputString);
  }
  
  return simpleHash(inputString);
}

/**
 * Simple hash function for demo
 * In production, use proper cryptographic hashing
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to hex
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Create a proof artifact (client-side)
 */
export function createProofArtifact(
  contractName: string,
  inputs: Record<string, any>,
  output: boolean,
  metadata?: Record<string, any>
): ProofArtifact {
  const proofHash = generateProofHash(inputs, contractName);
  
  return {
    id: `proof-${Date.now()}`,
    proofHash,
    contractName,
    inputs,
    output,
    timestamp: new Date().toISOString(),
    metadata,
  };
}

/**
 * Evaluate eligibility contract
 */
export function evaluateEligibility(score: number, threshold: number): boolean {
  return score >= threshold;
}

/**
 * Evaluate payment amount contract
 */
export function evaluatePaymentAmount(amount: number, minimum: number): boolean {
  return amount >= minimum;
}

/**
 * Create eligibility proof
 */
export function createEligibilityProof(score: number, threshold: number = 80): ProofArtifact {
  const output = evaluateEligibility(score, threshold);
  return createProofArtifact(
    'qualifyProof',
    { score, threshold },
    output,
    { receiptType: 'metamesh', version: '1.0' }
  );
}

/**
 * Create payment amount proof
 */
export function createPaymentAmountProof(amount: number, minimum: number = 1000000): ProofArtifact {
  const output = evaluatePaymentAmount(amount, minimum);
  return createProofArtifact(
    'paymentAmountProof',
    { amount, minimum },
    output,
    { receiptType: 'metamesh', version: '1.0' }
  );
}

