// lib/cardano/payInvoice.ts
// Pay invoice and mint receipt NFT

import { Lucid, fromText, MintingPolicy } from "lucid-cardano";

// Koios provider - use dynamic import for client-side compatibility
// Note: Koios may not be in type definitions, so we handle it dynamically
async function getKoiosProvider() {
  try {
    const lucidModule = await import("lucid-cardano");
    // @ts-ignore - Koios may not be in types
    return lucidModule.Koios || (lucidModule as any).default?.Koios;
  } catch (error) {
    console.error("Error loading Koios:", error);
    throw new Error("Koios provider not available. Please ensure lucid-cardano is properly installed.");
  }
}

export interface PayInvoiceOptions {
  metadataURI: string;
  recipientAddr: string;
  network?: "Preprod" | "Mainnet";
  proofHash?: string;
}

/**
 * Pay invoice by minting receipt NFT
 */
export async function payInvoice(options: PayInvoiceOptions): Promise<string> {
  const { metadataURI, recipientAddr, network = "Mainnet", proofHash } = options;

  try {
    // Get Koios provider dynamically
    const KoiosProvider = await getKoiosProvider();
    if (!KoiosProvider) {
      throw new Error("Koios provider not available. Please check lucid-cardano installation.");
    }
    
    // Initialize Lucid with Koios (no API key needed)
    const lucid = await Lucid.new(
      new KoiosProvider("https://api.koios.rest/api/v0"),
      network
    );

    // Check if wallet is available
    if (!window.cardano) {
      throw new Error("Cardano wallet not found. Please install Nami, Eternl, or Lace wallet.");
    }

    // Try to select wallet (prefer Eternl or Lace, fallback to Nami)
    let wallet;
    if (window.cardano.eternl) {
      wallet = window.cardano.eternl;
    } else if (window.cardano.lace) {
      wallet = window.cardano.lace;
    } else if (window.cardano.nami) {
      wallet = window.cardano.nami;
    } else {
      throw new Error("No compatible wallet found. Please install Eternl, Lace, or Nami.");
    }

    await lucid.selectWallet(wallet);

    const address = await lucid.wallet.address();

    // Create simple minting policy from wallet
    const { paymentCredential } = lucid.utils.getAddressDetails(address);
    if (!paymentCredential) {
      throw new Error("Could not extract payment credential from wallet address");
    }

    const policyScript = lucid.utils.nativeScriptFromJson({
      type: "sig",
      keyHash: paymentCredential.hash,
    });

    const policyId = lucid.utils.mintingPolicyToId(policyScript);
    const mintingPolicy: MintingPolicy = policyScript;

    // Generate unique asset name
    const assetName = `MetaMeshReceipt${Date.now()}`;
    const unit = policyId + fromText(assetName);

    // Build transaction
    let tx = lucid
      .newTx()
      .mintAssets({ [unit]: 1n }, mintingPolicy)
      .attachMetadata(721, {
        [policyId]: {
          [assetName]: {
            name: "MetaMesh Receipt",
            description: "Payment Receipt",
            image: metadataURI,
            ...(proofHash ? { proofHash } : {}),
          },
        },
      })
      .attachMintingPolicy(mintingPolicy)
      .payToAddress(recipientAddr, { [unit]: 1n }) // Send NFT to recipient
      .payToAddress(address, { lovelace: 2000000n }); // Send minimal ADA back

    // Attach proof hash in additional metadata if provided
    if (proofHash) {
      tx = tx.attachMetadata(674, { proofHash });
    }

    const completedTx = await tx.complete();
    const signed = await completedTx.sign().complete();
    const txHash = await signed.submit();

    return txHash;
  } catch (error) {
    console.error("Error paying invoice:", error);
    throw error;
  }
}

// Type declarations for wallet
declare global {
  interface Window {
    cardano?: {
      nami?: any;
      eternl?: any;
      lace?: any;
      flint?: any;
      gero?: any;
    };
  }
}

