// lib/cardano/mint.ts
import { Lucid, fromText, MintingPolicy, Script } from "lucid-cardano";
// Try to import Koios - it may not be in type definitions
let Koios: any;
try {
  // @ts-ignore
  Koios = require("lucid-cardano").Koios;
} catch {
  // Fallback: Koios might be available directly
  const lucidModule = require("lucid-cardano");
  Koios = lucidModule.Koios || lucidModule.default?.Koios;
}

/**
 * Policy configuration - can be loaded from files or created on-the-fly
 */
export interface PolicyConfig {
  policyId: string;
  policyScript?: Script;
}

/**
 * Mint receipt NFT with CIP-25 metadata
 * @param metadataURI - IPFS URI from backend (e.g., "ipfs://Qm...")
 * @param recipientAddress - Cardano address to receive the NFT
 * @param policy - Policy configuration (policyId required, policyScript optional)
 * @param network - Network to use (Preprod for testnet, Mainnet for mainnet)
 * @param proofHash - Optional Midnight proof hash to include in metadata
 * @returns Transaction hash
 */
export async function mintReceipt(
  metadataURI: string,
  recipientAddress: string,
  policy: PolicyConfig,
  network: "Preprod" | "Mainnet" = "Preprod",
  proofHash?: string
): Promise<string> {
  try {
    // Initialize Lucid with Koios provider (no API key needed)
    const lucid = await Lucid.new(
      new Koios("https://api.koios.rest/api/v0"),
      network
    );

    // Check if wallet is available (Nami, Eternl, etc.)
    if (!window.cardano || !window.cardano.nami) {
      throw new Error("Cardano wallet not found. Please install Nami wallet.");
    }

    // Select wallet
    await lucid.selectWallet(window.cardano.nami);

    // Get wallet address
    const walletAddress = await lucid.wallet.address();

    // Use provided policy script or create one on-the-fly
    let mintingPolicy: MintingPolicy;
    let finalPolicyId: string;
    
    if (policy.policyScript) {
      // Use provided policy script
      mintingPolicy = policy.policyScript;
      finalPolicyId = policy.policyId;
    } else {
      // Create a simple policy signed by the wallet (for hackathon/demo)
      const { paymentCredential } = lucid.utils.getAddressDetails(walletAddress);
      if (!paymentCredential) {
        throw new Error("Could not extract payment credential from wallet address");
      }
      
      // Create a policy that requires signature from the wallet
      mintingPolicy = lucid.utils.nativeScriptFromJson({
        type: "sig",
        keyHash: paymentCredential.hash,
      });
      
      // Compute policy ID from the script
      finalPolicyId = lucid.utils.mintingPolicyToId(mintingPolicy);
    }

    // Generate unique asset name
    const timestamp = Date.now();
    const assetName = `MetaMeshReceipt${timestamp}`;
    const unit = finalPolicyId + fromText(assetName);

    // Build transaction
    let txBuilder = lucid
      .newTx()
      .mintAssets({ [unit]: 1n }, mintingPolicy)
      .attachMetadata(721, {
        [finalPolicyId]: {
          [assetName]: {
            name: "MetaMesh Receipt",
            description: "Payment receipt NFT",
            image: metadataURI,
            // Include proof hash in CIP-25 metadata if provided
            ...(proofHash ? { proofHash } : {}),
          },
        },
      })
      .attachMintingPolicy(mintingPolicy);
    
    // Attach proof hash in additional metadata (label 674) if provided
    if (proofHash) {
      txBuilder = txBuilder.attachMetadata(674, { proofHash });
    }
    
    const tx = txBuilder
      .payToAddress(recipientAddress, { [unit]: 1n }) // Send NFT to recipient
      .payToAddress(walletAddress, { lovelace: 2000000n }) // Send minimal ADA back to owner
      .complete();

    // Sign transaction (wallet will pop up)
    const signedTx = await tx.sign().complete();

    // Submit transaction
    const txHash = await signedTx.submit();

    return txHash;
  } catch (error) {
    console.error("Error minting receipt NFT:", error);
    throw error;
  }
}

/**
 * Helper function to create a policy from wallet (for demo purposes)
 * In production, use pre-generated policy keys
 */
export async function createPolicyFromWallet(
  network: "Preprod" | "Mainnet" = "Preprod"
): Promise<PolicyConfig> {
  try {
    const lucid = await Lucid.new(
      new Koios("https://api.koios.rest/api/v0"),
      network
    );

    if (!window.cardano || !window.cardano.nami) {
      throw new Error("Cardano wallet not found. Please install Nami wallet.");
    }

    await lucid.selectWallet(window.cardano.nami);
    const walletAddress = await lucid.wallet.address();
    const { paymentCredential } = lucid.utils.getAddressDetails(walletAddress);

    if (!paymentCredential) {
      throw new Error("Could not extract payment credential from wallet address");
    }

    // Create a simple policy signed by the wallet
    const policyScript = lucid.utils.nativeScriptFromJson({
      type: "sig",
      keyHash: paymentCredential.hash,
    });

    const policyId = lucid.utils.mintingPolicyToId(policyScript);

    return {
      policyId,
      policyScript,
    };
  } catch (error) {
    console.error("Error creating policy from wallet:", error);
    throw error;
  }
}

// Type declaration for window.cardano
declare global {
  interface Window {
    cardano?: {
      nami?: {
        enable: () => Promise<any>;
        getNetworkId: () => Promise<number>;
        getUtxos: () => Promise<string[] | undefined>;
        getBalance: () => Promise<string>;
        getUsedAddresses: () => Promise<string[]>;
        getUnusedAddresses: () => Promise<string[]>;
        getChangeAddress: () => Promise<string>;
        getRewardAddresses: () => Promise<string[]>;
        signTx: (tx: string, partialSign?: boolean) => Promise<string>;
        signData: (address: string, payload: string) => Promise<{ signature: string; key: string }>;
        submitTx: (tx: string) => Promise<string>;
        getCollateral: () => Promise<string[] | undefined>;
      };
      eternl?: any;
      flint?: any;
      gero?: any;
    };
  }
}

