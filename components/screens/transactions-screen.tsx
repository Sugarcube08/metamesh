"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, QrCode, ChevronDown, X, Shield, Lock } from "lucide-react"
import type { Screen } from "@/app/page"

interface TransactionsScreenProps {
  onNavigate: (screen: Screen) => void
}

const TOKENS = [
  { symbol: "ADA", name: "Cardano", balance: "12,450.00" },
  { symbol: "DJED", name: "Djed Stablecoin", balance: "500.00" },
  { symbol: "MIN", name: "Minswap", balance: "1,200.00" },
]

export function TransactionsScreen({ onNavigate }: TransactionsScreenProps) {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [selectedToken, setSelectedToken] = useState(TOKENS[0])
  const [showTokenSelector, setShowTokenSelector] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [privacyMode, setPrivacyMode] = useState<"public" | "private">("public")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => onNavigate("wallet")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">Send</h1>
        <button
          onClick={() => setShowQR(true)}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <QrCode className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Recipient Input */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="@username or wallet address"
            className="h-14 bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl"
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Amount</label>
          <div className="relative">
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              className="h-14 pr-28 bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl text-xl font-semibold"
            />
            <button
              onClick={() => setShowTokenSelector(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-2 rounded-xl"
            >
              <span className="font-semibold text-foreground">{selectedToken.symbol}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Available: {selectedToken.balance} {selectedToken.symbol}
          </p>
        </div>

        {/* Privacy Toggle */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Privacy Mode</label>
          <div className="flex gap-3">
            <button
              onClick={() => setPrivacyMode("public")}
              className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 transition-colors ${
                privacyMode === "public" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Public</span>
            </button>
            <button
              onClick={() => setPrivacyMode("private")}
              className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 transition-colors ${
                privacyMode === "private" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="font-medium">Private</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {privacyMode === "public"
              ? "Transaction visible on Cardano blockchain"
              : "Private transaction via Midnight protocol"}
          </p>
        </div>

        {/* Fee Estimate */}
        <div className="bg-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Network Fee</span>
            <span className="text-foreground">~0.17 ADA</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estimated Time</span>
            <span className="text-foreground">~20 seconds</span>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <div className="p-6">
        <Button
          disabled={!amount || !recipient}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl disabled:opacity-50"
        >
          Send {amount || "0"} {selectedToken.symbol}
        </Button>
      </div>

      {/* Token Selector Modal */}
      <AnimatePresence>
        {showTokenSelector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setShowTokenSelector(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Select Token</h3>
                <button onClick={() => setShowTokenSelector(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-2">
                {TOKENS.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => {
                      setSelectedToken(token)
                      setShowTokenSelector(false)
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-colors ${
                      selectedToken.symbol === token.symbol ? "bg-primary/20" : "bg-background hover:bg-background/80"
                    }`}
                  >
                    <div className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center">
                      <span className="text-primary font-bold">{token.symbol[0]}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{token.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {token.balance} {token.symbol}
                      </p>
                    </div>
                    {selectedToken.symbol === token.symbol && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQR && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setShowQR(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 bg-card rounded-3xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Scan QR Code</h3>
                <button onClick={() => setShowQR(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="aspect-square bg-accent rounded-2xl flex items-center justify-center">
                <QrCode className="w-24 h-24 text-accent-foreground/20" />
              </div>
              <p className="text-center text-muted-foreground mt-4 text-sm">Point your camera at a QR code to scan</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
