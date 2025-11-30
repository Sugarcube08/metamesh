// midnight/test-proof.ts
// Test script for Midnight proof generation

import { createReceiptProof, eligibilityContract, paymentAmountContract } from './contract';
import { MidnightProofGenerator } from './contract';

/**
 * Test proof generation
 */
async function testProofGeneration() {
  console.log('=== Testing Midnight Proof Generation ===\n');

  const generator = new MidnightProofGenerator();

  // Test 1: Eligibility proof
  console.log('Test 1: Eligibility Proof');
  const eligibilityProof = await generator.produceProof(
    eligibilityContract,
    { score: 85, threshold: 80 },
    { description: 'User score meets eligibility threshold' }
  );
  console.log('Proof Hash:', eligibilityProof.proofHash);
  console.log('Output:', eligibilityProof.output);
  console.log('Proof ID:', eligibilityProof.id);
  console.log('');

  // Test 2: Payment amount proof
  console.log('Test 2: Payment Amount Proof');
  const paymentProof = await generator.produceProof(
    paymentAmountContract,
    { amount: 2000000, minimum: 1000000 },
    { description: 'Payment amount meets minimum requirement' }
  );
  console.log('Proof Hash:', paymentProof.proofHash);
  console.log('Output:', paymentProof.output);
  console.log('Proof ID:', paymentProof.id);
  console.log('');

  // Test 3: Verify proof
  console.log('Test 3: Verify Proof');
  const loadedProof = generator.loadProof(eligibilityProof.id);
  if (loadedProof) {
    const isValid = generator.verifyProof(eligibilityProof.proofHash, loadedProof);
    console.log('Proof verification:', isValid ? '✅ Valid' : '❌ Invalid');
  }
  console.log('');

  // Test 4: List all proofs
  console.log('Test 4: List All Proofs');
  const allProofs = generator.listProofs();
  console.log('Proof IDs:', allProofs);
  console.log('');

  console.log('=== Tests completed ===');
}

// Run if executed directly
if (require.main === module) {
  testProofGeneration().catch(console.error);
}

export { testProofGeneration };

