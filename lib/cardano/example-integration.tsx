// lib/cardano/example-integration.tsx
// Example React component showing how to integrate minting

'use client';

import { useState } from 'react';
import { useMint } from './useMint';

/**
 * Example component showing how to integrate minting with backend
 */
export function MintReceiptExample() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const network = (process.env.NEXT_PUBLIC_CARDANO_NETWORK as "Preprod" | "Mainnet") || "Preprod";
  
  const { mint, isLoading, error, txHash } = useMint(network);

  const handleIssueRequest = async () => {
    try {
      // Step 1: Request invoice from backend
      const response = await fetch('http://localhost:3333/issue-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientDID: 'did:example:123',
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

      // Step 2: Mint NFT
      const hash = await mint(metadataURI, recipientAddress);

      // Step 3: Mark as issued in backend
      await fetch('http://localhost:3333/mark-issued', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, txId: hash }),
      });

      alert(`Receipt minted! TX: ${hash}`);
    } catch (err) {
      console.error('Error:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Mint Receipt NFT</h2>
      
      <div>
        <label>Recipient Address</label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="addr_test1..."
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000000"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Payment receipt"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleIssueRequest}
        disabled={isLoading || !recipientAddress || !amount}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Minting...' : 'Mint Receipt'}
      </button>

      {error && <div className="text-red-500">Error: {error}</div>}
      {txHash && (
        <div className="text-green-500">
          Success! TX Hash: <a href={`https://testnet.cardanoscan.io/transaction/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
        </div>
      )}
    </div>
  );
}

