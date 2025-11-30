"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, CreditCard, Eye, EyeOff, TrendingUp, RefreshCw } from "lucide-react"
import type { Screen } from "@/app/page"
import { useState } from "react"

interface WalletScreenProps {
  onNavigate: (screen: Screen) => void
}

const TOKENS = [
  { symbol: "ADA", name: "Cardano", balance: "12,450.00", value: "$4,980.00", change: "+5.2%", positive: true },
  { symbol: "DJED", name: "Djed Stablecoin", balance: "500.00", value: "$500.00", change: "0%", positive: true },
  { symbol: "MIN", name: "Minswap", balance: "1,200.00", value: "$120.00", change: "-2.1%", positive: false },
  { symbol: "SNEK", name: "Snek", balance: "50,000.00", value: "$25.00", change: "+12.4%", positive: true },
]

const TRANSACTIONS = [
  { type: "received", from: "Alice.ada", amount: "+50 ADA", time: "Today" },
  { type: "sent", to: "Bob.ada", amount: "-25 ADA", time: "Yesterday" },
  { type: "received", from: "Staking Rewards", amount: "+12.5 ADA", time: "2 days ago" },
]

export function WalletScreen({ onNavigate }: WalletScreenProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => onNavigate("home")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">Wallet</h1>
        <button className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors">
          <RefreshCw className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Balance Card */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary/70 rounded-3xl p-6 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="wallet-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#wallet-grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary-foreground/70 text-sm">Total Balance</span>
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? (
                  <Eye className="w-5 h-5 text-primary-foreground/70" />
                ) : (
                  <EyeOff className="w-5 h-5 text-primary-foreground/70" />
                )}
              </button>
            </div>

            <h2 className="text-4xl font-bold text-primary-foreground mb-2">{showBalance ? "$5,625.00" : "••••••"}</h2>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
              <span className="text-primary-foreground text-sm">+$280.50 (5.2%) today</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-6">
        <div className="flex gap-3">
          <Button
            onClick={() => onNavigate("send-payment")}
            className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
          >
            <ArrowUpRight className="w-5 h-5 mr-2" />
            Send
          </Button>
          <Button
            onClick={() => onNavigate("receive")}
            className="flex-1 h-14 bg-card hover:bg-card/80 text-foreground rounded-2xl"
          >
            <ArrowDownLeft className="w-5 h-5 mr-2" />
            Receive
          </Button>
          <Button
            onClick={() => onNavigate("buy-crypto")}
            className="flex-1 h-14 bg-card hover:bg-card/80 text-foreground rounded-2xl"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Buy
          </Button>
        </div>
      </div>

      {/* Tokens */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Tokens</h3>
          <button className="text-primary text-sm">See all</button>
        </div>
        <div className="space-y-3">
          {TOKENS.map((token, index) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center">
                <span className="text-primary font-bold">{token.symbol[0]}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{token.name}</p>
                <p className="text-sm text-muted-foreground">
                  {token.balance} {token.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{token.value}</p>
                <p className={`text-sm ${token.positive ? "text-primary" : "text-destructive"}`}>{token.change}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <button className="text-primary text-sm">See all</button>
        </div>
        <div className="bg-card rounded-2xl overflow-hidden">
          {TRANSACTIONS.map((tx, index) => (
            <div
              key={index}
              className={`p-4 flex items-center gap-4 ${index !== TRANSACTIONS.length - 1 ? "border-b border-border" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  tx.type === "received" ? "bg-primary/20" : "bg-background"
                }`}
              >
                {tx.type === "received" ? (
                  <ArrowDownLeft className="w-5 h-5 text-primary" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{tx.type === "received" ? tx.from : tx.to}</p>
                <p className="text-sm text-muted-foreground">{tx.time}</p>
              </div>
              <p className={`font-semibold ${tx.amount.startsWith("+") ? "text-primary" : "text-foreground"}`}>
                {tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
