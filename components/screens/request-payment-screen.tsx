"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ChevronDown, Calendar, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Screen } from "@/app/page"

interface RequestPaymentScreenProps {
  onNavigate: (screen: Screen) => void
}

const TOKENS = [
  { symbol: "ADA", name: "Cardano" },
  { symbol: "DJED", name: "Djed Stablecoin" },
]

export function RequestPaymentScreen({ onNavigate }: RequestPaymentScreenProps) {
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState(TOKENS[0])
  const [showTokenSelector, setShowTokenSelector] = useState(false)
  const [dueDate, setDueDate] = useState("")
  const [message, setMessage] = useState("")
  const [invoiceId] = useState(`INV-${Date.now().toString().slice(-8)}`)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => onNavigate("chat")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">Request Payment</h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Invoice ID */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Invoice ID</label>
          <Input value={invoiceId} disabled className="h-14 bg-card border-input text-foreground rounded-2xl" />
        </div>

        {/* Amount */}
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
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Due Date (optional)</label>
          <div className="relative">
            <Input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="h-14 bg-card border-input text-foreground rounded-2xl"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Message</label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Payment for..."
            className="h-14 bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl"
          />
        </div>
      </div>

      <div className="p-6">
        <Button
          onClick={() => onNavigate("payment-success")}
          disabled={!amount}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl disabled:opacity-50"
        >
          Send Invoice
        </Button>
      </div>

      {/* Token Selector */}
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
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
