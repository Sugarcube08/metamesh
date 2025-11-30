"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { Lucid } from "lucid-cardano"

// Koios provider helper
async function getKoiosProvider() {
  try {
    const lucidModule = await import("lucid-cardano")
    // @ts-ignore - Koios may not be in types
    return lucidModule.Koios || (lucidModule as any).default?.Koios
  } catch (error) {
    console.error("Error loading Koios:", error)
    throw new Error("Koios provider not available")
  }
}

// Supported wallet types
export type WalletName = "lace" | "eternl" | "flint" | "gerowallet"

interface WalletContextType {
  walletName: WalletName | null
  lucid: Lucid | null
  address: string | null
  balance: string | null
  networkId: number | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  connect: (walletName: WalletName) => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const STORAGE_KEY = "metamesh_connected_wallet"

export function CardanoWalletProvider({ children }: { children: ReactNode }) {
  const [walletName, setWalletName] = useState<WalletName | null>(null)
  const [lucid, setLucid] = useState<Lucid | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get wallet provider by name
  const getWalletProvider = useCallback((name: WalletName) => {
    if (typeof window === "undefined" || !window.cardano) {
      return null
    }

    switch (name) {
      case "lace":
        return window.cardano.lace
      case "eternl":
        return window.cardano.eternl
      case "flint":
        return window.cardano.flint
      case "gerowallet":
        return window.cardano.gerowallet
      default:
        return null
    }
  }, [])

  // Calculate balance from UTXOs
  const calculateBalance = useCallback(async (lucidInstance: Lucid): Promise<string> => {
    try {
      const utxos = await lucidInstance.wallet.getUtxos()
      if (!utxos || utxos.length === 0) {
        return "0.00"
      }
      
      const totalLovelace = utxos.reduce((sum, utxo) => {
        const lovelace = utxo.assets?.lovelace || 0n
        return sum + lovelace
      }, 0n)
      
      // Convert to ADA (1 ADA = 1,000,000 lovelace)
      const ada = Number(totalLovelace) / 1_000_000
      return ada.toFixed(2)
    } catch (error) {
      console.error("Error calculating balance:", error)
      return "0.00"
    }
  }, [])

  // Connect wallet
  const connect = useCallback(async (name: WalletName) => {
    // Prevent multiple simultaneous connections
    if (isLoading) {
      console.warn("Connection already in progress")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get wallet provider
      const walletProvider = getWalletProvider(name)
      if (!walletProvider) {
        throw new Error(`${name} wallet not found. Please install the ${name} extension.`)
      }

      // Request CIP-30 access
      const wallet = await walletProvider.enable()
      if (!wallet) {
        throw new Error(`Failed to enable ${name} wallet`)
      }

      // Get network ID
      const networkId = await wallet.getNetworkId()
      
      // Validate network (0 = Preprod, 1 = Mainnet)
      if (networkId !== 0 && networkId !== 1) {
        throw new Error("Please switch your wallet to Preprod or Mainnet")
      }

      // Get Koios provider
      const KoiosProvider = await getKoiosProvider()
      if (!KoiosProvider) {
        throw new Error("Koios provider not available")
      }

      // Initialize Lucid
      const network = networkId === 0 ? "Preprod" : "Mainnet"
      const lucidInstance = await Lucid.new(
        new KoiosProvider("https://api.koios.rest/api/v0"),
        network
      )

      // Select wallet
      await lucidInstance.selectWallet(wallet)

      // Get address
      const userAddress = await lucidInstance.wallet.address()

      // Get balance
      const userBalance = await calculateBalance(lucidInstance)

      // Update state
      setWalletName(name)
      setLucid(lucidInstance)
      setAddress(userAddress)
      setBalance(userBalance)
      setNetworkId(networkId)

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, name)
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      const errorMessage = err.message || "Failed to connect wallet"
      setError(errorMessage)
      // Clear state on error
      setWalletName(null)
      setLucid(null)
      setAddress(null)
      setBalance(null)
      setNetworkId(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getWalletProvider, calculateBalance, isLoading])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWalletName(null)
    setLucid(null)
    setAddress(null)
    setBalance(null)
    setNetworkId(null)
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!lucid) return

    try {
      const newBalance = await calculateBalance(lucid)
      setBalance(newBalance)
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }, [lucid, calculateBalance])

  // Auto-reconnect on mount
  useEffect(() => {
    let mounted = true
    let reconnectAttempted = false
    
    const reconnect = async () => {
      if (typeof window === "undefined") return
      if (reconnectAttempted) return
      if (walletName !== null) return // Already connected

      const storedWalletName = localStorage.getItem(STORAGE_KEY) as WalletName | null
      if (!storedWalletName) return

      reconnectAttempted = true

      try {
        setIsLoading(true)
        // Get wallet provider
        const walletProvider = getWalletProvider(storedWalletName)
        if (!walletProvider) {
          throw new Error(`${storedWalletName} wallet not found`)
        }

        // Request CIP-30 access
        const wallet = await walletProvider.enable()
        if (!wallet) {
          throw new Error(`Failed to enable ${storedWalletName} wallet`)
        }

        // Get network ID
        const networkId = await wallet.getNetworkId()
        
        // Validate network (0 = Preprod, 1 = Mainnet)
        if (networkId !== 0 && networkId !== 1) {
          throw new Error("Please switch your wallet to Preprod or Mainnet")
        }

        // Get Koios provider
        const KoiosProvider = await getKoiosProvider()
        if (!KoiosProvider) {
          throw new Error("Koios provider not available")
        }

        // Initialize Lucid
        const network = networkId === 0 ? "Preprod" : "Mainnet"
        const lucidInstance = await Lucid.new(
          new KoiosProvider("https://api.koios.rest/api/v0"),
          network
        )

        // Select wallet
        await lucidInstance.selectWallet(wallet)

        // Get address
        const userAddress = await lucidInstance.wallet.address()

        // Get balance
        const userBalance = await calculateBalance(lucidInstance)

        // Update state
        if (mounted) {
          setWalletName(storedWalletName)
          setLucid(lucidInstance)
          setAddress(userAddress)
          setBalance(userBalance)
          setNetworkId(networkId)
        }
      } catch (error) {
        console.error("Auto-reconnect failed:", error)
        // Clear invalid stored wallet
        if (mounted) {
          localStorage.removeItem(STORAGE_KEY)
          setIsLoading(false)
        }
      }
    }

    reconnect()
    
    return () => {
      mounted = false
    }
  }, []) // Only run on mount - eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WalletContext.Provider
      value={{
        walletName,
        lucid,
        address,
        balance,
        networkId,
        isConnected: walletName !== null && lucid !== null,
        isLoading,
        error,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useCardanoWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useCardanoWallet must be used within a CardanoWalletProvider")
  }
  return context
}

// Type declarations for window.cardano
declare global {
  interface Window {
    cardano?: {
      lace?: {
        enable: () => Promise<any>
        getNetworkId: () => Promise<number>
      }
      eternl?: {
        enable: () => Promise<any>
        getNetworkId: () => Promise<number>
      }
      flint?: {
        enable: () => Promise<any>
        getNetworkId: () => Promise<number>
      }
      gerowallet?: {
        enable: () => Promise<any>
        getNetworkId: () => Promise<number>
      }
    }
  }
}

