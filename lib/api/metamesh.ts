// lib/api/metamesh.ts
// Backend API calls for MetaMesh

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333';

export interface InvoiceData {
  recipientDID: string;
  recipientAddress: string;
  amount: string;
  description: string;
  issuer: string;
}

export interface InvoiceResponse {
  id: string;
  metadataURI: string;
}

export interface MarkIssuedData {
  id: string;
  txId: string;
}

/**
 * Create an invoice request
 */
export async function createInvoice(data: InvoiceData): Promise<InvoiceResponse> {
  const res = await fetch(`${BACKEND_URL}/issue-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create invoice');
  }

  return res.json();
}

/**
 * Mark invoice as issued (paid)
 */
export async function markIssued(id: string, txId: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${BACKEND_URL}/mark-issued`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, txId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to mark as issued');
  }

  return res.json();
}

/**
 * Get all invoices/requests
 */
export async function getInvoices(): Promise<Record<string, any>> {
  const res = await fetch(`${BACKEND_URL}/requests`);

  if (!res.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return res.json();
}

