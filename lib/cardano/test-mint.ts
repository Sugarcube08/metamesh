// lib/cardano/test-mint.ts
// Test examples for minting function

import { mintReceipt, createPolicyFromWallet, PolicyConfig } from './mint';

/**
 * Example: Full minting flow with backend integration
 */
export async function testFullMintingFlow() {
  const network = (process.env.NEXT_PUBLIC_CARDANO_NETWORK as "Preprod" | "Mainnet") || "Preprod";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333';

  try {
    // Step 1: Request invoice from backend
    console.log('Step 1: Creating invoice request...');
    const invoiceResponse = await fetch(`${backendUrl}/issue-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientDID: 'did:cardano:test123',
        recipientAddress: 'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk',
        amount: '1000000',
        description: 'Test payment receipt',
        issuer: 'MetaMesh',
      }),
    });

    if (!invoiceResponse.ok) {
      throw new Error(`Backend error: ${invoiceResponse.statusText}`);
    }

    const { id, metadataURI } = await invoiceResponse.json();
    console.log('✅ Invoice created:', { id, metadataURI });

    // Step 2: Create policy
    console.log('Step 2: Creating policy...');
    const policy = await createPolicyFromWallet(network);
    console.log('✅ Policy created:', { policyId: policy.policyId });

    // Step 3: Mint NFT
    console.log('Step 3: Minting NFT...');
    const recipientAddress = 'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk';
    const txHash = await mintReceipt(metadataURI, recipientAddress, policy, network);
    console.log('✅ NFT minted! TX Hash:', txHash);

    // Step 4: Mark as issued in backend
    console.log('Step 4: Marking as issued...');
    const markResponse = await fetch(`${backendUrl}/mark-issued`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, txId: txHash }),
    });

    if (!markResponse.ok) {
      throw new Error(`Backend error: ${markResponse.statusText}`);
    }

    console.log('✅ Marked as issued!');
    return { id, metadataURI, txHash, policyId: policy.policyId };
  } catch (error) {
    console.error('❌ Error in minting flow:', error);
    throw error;
  }
}

/**
 * Example: Mint with pre-generated policy
 */
export async function testMintWithPolicy(policyId: string, policyScript: any) {
  const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_KEY || '';
  const metadataURI = 'ipfs://QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const recipientAddress = 'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk';

  const policy: PolicyConfig = {
    policyId,
    policyScript,
  };

  return await mintReceipt(metadataURI, recipientAddress, policy, blockfrostKey);
}

/**
 * Example payloads for testing
 */
export const testPayloads = {
  issueRequest: {
    recipientDID: 'did:cardano:test123',
    recipientAddress: 'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk',
    amount: '1000000',
    description: 'Test payment receipt',
    issuer: 'MetaMesh',
  },
  markIssued: {
    id: '1732920000000',
    txId: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
  },
};

