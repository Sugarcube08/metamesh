"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Hexagon, Wallet, Loader2, AlertCircle } from "lucide-react"
import type { Screen } from "@/app/page"
import { useCardanoWallet, type WalletName } from "@/lib/wallet/cardano-wallet-context"

interface ConnectWalletScreenProps {
  onNavigate: (screen: Screen) => void
}

const WALLETS: Array<{ name: WalletName; displayName: string; icon?: string }> = [
  { name: "lace", displayName: "Lace" },
  { name: "eternl", displayName: "Eternl" },
  { name: "flint", displayName: "Flint" },
  { name: "gerowallet", displayName: "Gero" },
]

export function ConnectWalletScreen({ onNavigate }: ConnectWalletScreenProps) {
  const { connect, isLoading, error } = useCardanoWallet()
  const [connectingWallet, setConnectingWallet] = useState<WalletName | null>(null)

  const handleConnect = async (walletName: WalletName) => {
    setConnectingWallet(walletName)
    try {
      await connect(walletName)
      // Navigate to home on success
      setTimeout(() => {
        onNavigate("home")
      }, 500) // Small delay to ensure state is updated
    } catch (err) {
      // Error is handled by context
      console.error("Connection error:", err)
      setConnectingWallet(null)
    }
  }

  // Check if wallet is available
  const isWalletAvailable = (walletName: WalletName): boolean => {
    if (typeof window === "undefined" || !window.cardano) return false
    
    switch (walletName) {
      case "lace":
        return !!window.cardano.lace
      case "eternl":
        return !!window.cardano.eternl
      case "flint":
        return !!window.cardano.flint
      case "gerowallet":
        return !!window.cardano.gerowallet
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00C28D" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glowing orb effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(0,194,141,0.3)]">
            <Hexagon className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-foreground text-center mb-4"
        >
          MetaMesh
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground text-center text-lg mb-12 max-w-sm"
        >
          Connect a Cardano Wallet
        </motion.p>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 w-full max-w-sm bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive mb-1">Connection Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Wallet Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-sm space-y-3"
        >
          {WALLETS.map((wallet) => {
            const available = isWalletAvailable(wallet.name)
            const isConnecting = connectingWallet === wallet.name && isLoading

            return (
              <Button
                key={wallet.name}
                onClick={() => handleConnect(wallet.name)}
                disabled={!available || isLoading}
                className="w-full h-14 bg-card hover:bg-card/80 border border-input text-foreground font-semibold text-lg rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 w-5 h-5" />
                    Connect {wallet.displayName}
                  </>
                )}
              </Button>
            )
          })}
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-sm text-muted-foreground text-center max-w-sm"
        >
          Don't have a wallet? Install one of the supported extensions to get started.
        </motion.p>
      </div>
    </div>
  )
}

