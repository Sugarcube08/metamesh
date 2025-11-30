"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Download, Share2 } from "lucide-react"
import type { Screen } from "@/app/page"

interface PaymentSuccessScreenProps {
  onNavigate: (screen: Screen) => void
}

export function PaymentSuccessScreen({ onNavigate }: PaymentSuccessScreenProps) {
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
        <h1 className="flex-1 text-xl font-bold text-foreground">Payment Confirmed</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-primary" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold text-foreground">Payment Sent!</h2>
          <p className="text-muted-foreground">50 ADA to Alice.ada</p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full bg-card rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="text-foreground font-mono text-sm">abc...xyz</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-foreground font-semibold">50 ADA</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span className="text-foreground">0.17 ADA</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-muted-foreground">Status</span>
            <span className="text-primary font-medium">Confirmed</span>
          </div>
        </motion.div>

        {/* NFT Receipt Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <p className="text-sm text-muted-foreground mb-3">Receipt NFT (Minting...)</p>
          <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
            <span className="text-foreground/50">Receipt NFT Preview</span>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-3">
        <Button
          onClick={() => onNavigate("home")}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl"
        >
          Done
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 bg-card border-border text-foreground hover:bg-card/80 rounded-2xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Receipt
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-14 bg-card border-border text-foreground hover:bg-card/80 rounded-2xl"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
