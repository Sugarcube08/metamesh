// lib/cardano/example-with-proof.tsx
// Example component showing minting with Midnight proof

'use client';

import { useState } from 'react';
import { useMintWithProof } from './useMintWithProof';

/**
 * Example component showing how to integrate minting with Midnight proof
 */
export function MintReceiptWithProofExample() {
  const [recipientAddress, setRecipientAddress] = useState('addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState('85');
  const [threshold, setThreshold] = useState('80');
  const [proofType, setProofType] = useState<'eligibility' | 'payment'>('eligibility');
  
  // Use Mainnet for production, Preprod for testnet
  const network = (process.env.NEXT_PUBLIC_CARDANO_NETWORK as "Preprod" | "Mainnet") || "Mainnet";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333';
  
  const { mintWithProof, isLoading, error, txHash, proof, saveProof } = useMintWithProof(network);

  const handleIssueRequest = async () => {
    try {
      // Step 1: Request invoice from backend
      const response = await fetch(`${backendUrl}/issue-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientDID: 'did:cardano:test123',
          recipientAddress,
          amount,
          description,
          issuer: 'MetaMesh',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const { id, metadataURI } = await response.json();

      // Step 2: Mint NFT with proof
      const proofInputs = proofType === 'eligibility' 
        ? { score: parseInt(score), threshold: parseInt(threshold) }
        : { amount: parseInt(amount), minimum: 1000000 };
      
      const { txHash: hash } = await mintWithProof(
        metadataURI,
        recipientAddress,
        undefined, // Will create policy on-the-fly
        proofInputs,
        proofType
      );

      // Step 3: Mark as issued in backend
      await fetch(`${backendUrl}/mark-issued`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, txId: hash }),
      });

      alert(`Receipt minted with proof! TX: ${hash}`);
    } catch (err) {
      console.error('Error:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Mint Receipt NFT with Midnight Proof</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient Address</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="addr_test1..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount (lovelace)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000000"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment receipt"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Proof Type</label>
          <select
            value={proofType}
            onChange={(e) => setProofType(e.target.value as 'eligibility' | 'payment')}
            className="w-full p-2 border rounded"
          >
            <option value="eligibility">Eligibility Proof</option>
            <option value="payment">Payment Amount Proof</option>
          </select>
        </div>

        {proofType === 'eligibility' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Score</label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="85"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Threshold</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="80"
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        <button
          onClick={handleIssueRequest}
          disabled={isLoading || !recipientAddress || !amount}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Minting...' : 'Mint Receipt with Proof'}
        </button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {txHash && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded space-y-2">
            <div>
              <strong>Success!</strong> Transaction Hash:{' '}
              <a
                href={`https://testnet.cardanoscan.io/transaction/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {txHash}
              </a>
            </div>
            {proof && (
              <div className="mt-2">
                <div><strong>Proof Hash:</strong> {proof.proofHash}</div>
                <div><strong>Proof Output:</strong> {proof.output ? '✅ Valid' : '❌ Invalid'}</div>
                <button
                  onClick={() => saveProof()}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Download Proof Artifact
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

