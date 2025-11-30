"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loadWalletFromStorage, hasWallet, type WalletData } from "./wallet-utils"

interface WalletContextType {
  wallet: WalletData | null
  setWallet: (wallet: WalletData | null) => void
  hasWallet: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWalletState] = useState<WalletData | null>(null)
  const [hasWalletState, setHasWalletState] = useState(false)

  useEffect(() => {
    // Load wallet from storage on mount
    const stored = loadWalletFromStorage()
    if (stored) {
      setWalletState(stored)
      setHasWalletState(true)
    } else {
      setHasWalletState(hasWallet())
    }
  }, [])

  const setWallet = (newWallet: WalletData | null) => {
    setWalletState(newWallet)
    setHasWalletState(newWallet !== null)
  }

  return (
    <WalletContext.Provider value={{ wallet, setWallet, hasWallet: hasWalletState }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}


