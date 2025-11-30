"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CreditCard, DollarSign } from "lucide-react"
import type { Screen } from "@/app/page"
import { useState } from "react"

interface BuyCryptoScreenProps {
  onNavigate: (screen: Screen) => void
}

export function BuyCryptoScreen({ onNavigate }: BuyCryptoScreenProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => onNavigate("wallet")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">Buy ADA</h1>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Amount (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              className="h-14 pl-12 bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl text-xl font-semibold"
            />
          </div>
          <p className="text-sm text-muted-foreground">≈ {(Number(amount) / 0.4).toFixed(2)} ADA</p>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Payment Method</label>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-colors border ${
                paymentMethod === "card"
                  ? "bg-primary/20 border-primary"
                  : "bg-card border-border hover:border-border/80"
              }`}
            >
              <CreditCard
                className={`w-5 h-5 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="text-left">
                <p className={`font-medium ${paymentMethod === "card" ? "text-foreground" : "text-foreground"}`}>
                  Credit Card
                </p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("bank")}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-colors border ${
                paymentMethod === "bank"
                  ? "bg-primary/20 border-primary"
                  : "bg-card border-border hover:border-border/80"
              }`}
            >
              <CreditCard
                className={`w-5 h-5 ${paymentMethod === "bank" ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="text-left">
                <p className={`font-medium ${paymentMethod === "bank" ? "text-foreground" : "text-foreground"}`}>
                  Bank Transfer
                </p>
                <p className="text-xs text-muted-foreground">ACH, Wire, SEPA</p>
              </div>
            </button>
          </div>
        </div>

        {/* Fee Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Processing Fee (2%)</span>
            <span className="text-foreground">${(Number(amount) * 0.02).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-foreground font-semibold">Total</span>
            <span className="text-foreground font-semibold">${(Number(amount) * 1.02).toFixed(2)}</span>
          </div>
        </motion.div>
      </div>

      <div className="p-6">
        <Button
          disabled={!amount}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl disabled:opacity-50"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
