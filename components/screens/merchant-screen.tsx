"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, QrCode, TrendingUp, Clock, CheckCircle, X } from "lucide-react"
import type { Screen } from "@/app/page"

interface MerchantScreenProps {
  onNavigate: (screen: Screen) => void
}

const SALES_DATA = [
  { id: "1", amount: "150 ADA", from: "Alice.ada", time: "Today, 10:32 AM", status: "confirmed" },
  { id: "2", amount: "75 ADA", from: "Bob.ada", time: "Today, 9:15 AM", status: "confirmed" },
  { id: "3", amount: "200 ADA", from: "Charlie.ada", time: "Yesterday, 3:45 PM", status: "confirmed" },
]

export function MerchantScreen({ onNavigate }: MerchantScreenProps) {
  const [showQR, setShowQR] = useState(false)

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
        <h1 className="flex-1 text-xl font-bold text-foreground">Merchant</h1>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Business Name */}
        <div>
          <p className="text-muted-foreground text-sm">Business Name</p>
          <h2 className="text-2xl font-bold text-foreground">Coffee Shop ☕</h2>
        </div>

        {/* Today's Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary/70 rounded-3xl p-6 text-primary-foreground"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="opacity-70">Today's Sales</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-4xl font-bold mb-2">425 ADA</h3>
          <p className="opacity-70">5 transactions</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setShowQR(true)}
            className="flex-1 h-14 bg-card hover:bg-card/80 text-foreground rounded-2xl"
          >
            <QrCode className="w-5 h-5 mr-2" />
            Generate QR
          </Button>
          <Button className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl">
            <Clock className="w-5 h-5 mr-2" />
            History
          </Button>
        </div>

        {/* Recent Payments */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {SALES_DATA.map((sale, index) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{sale.from}</p>
                  <p className="text-sm text-muted-foreground">{sale.time}</p>
                </div>
                <span className="font-semibold text-primary">{sale.amount}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Modal */}
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
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 bg-card rounded-3xl z-50 p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Payment QR Code</h3>
                <button onClick={() => setShowQR(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="bg-accent rounded-2xl p-8 flex items-center justify-center">
                <div className="w-56 h-56 bg-accent-foreground/10 rounded-xl flex items-center justify-center">
                  <span className="text-accent-foreground/30">QR Code</span>
                </div>
              </div>
              <Button
                onClick={() => setShowQR(false)}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              >
                Done
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
