import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';

export interface WalletData {
  mnemonicEncrypted: string;
  publicKey: string;
  address: string;
  createdAt: string;
}

/**
 * Generate a new 12-word mnemonic phrase
 */
export function generateMnemonic(): string {
  return bip39.generateMnemonic();
}

/**
 * Validate mnemonic phrase
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Derive private and public keys from mnemonic
 * Returns public key and address (placeholder for now)
 * Note: This is a simplified demo implementation. In production, use proper Cardano HD wallet derivation.
 */
export async function deriveKeysFromMnemonic(mnemonic: string): Promise<{ publicKey: string; address: string }> {
  try {
    // Convert mnemonic to seed
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const seedHex = Buffer.from(seed).toString('hex');
    
    // Generate a deterministic public key from seed
    // This is a simplified version - in production use proper HD wallet derivation (BIP32/BIP44)
    // For demo purposes, create a deterministic identifier from the seed
    const publicKey = `pub_${seedHex.substring(0, 40)}`;
    const address = ''; // Placeholder - will be derived when connecting to network
    
    return { publicKey, address };
  } catch (error) {
    console.error('Error deriving keys:', error);
    throw new Error('Failed to derive keys from mnemonic');
  }
}

/**
 * Encrypt mnemonic with password
 */
export function encryptMnemonic(mnemonic: string, password: string): string {
  return CryptoJS.AES.encrypt(mnemonic, password).toString();
}

/**
 * Decrypt mnemonic with password
 */
export function decryptMnemonic(encrypted: string, password: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error('Failed to decrypt mnemonic. Wrong password?');
  }
}

/**
 * Save wallet to localStorage
 */
export function saveWalletToStorage(walletData: WalletData): void {
  localStorage.setItem('metamesh_wallet', JSON.stringify(walletData));
}

/**
 * Load wallet from localStorage
 */
export function loadWalletFromStorage(): WalletData | null {
  const stored = localStorage.getItem('metamesh_wallet');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if wallet exists in storage
 */
export function hasWallet(): boolean {
  return localStorage.getItem('metamesh_wallet') !== null;
}

