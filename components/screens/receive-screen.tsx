"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Download, Share2 } from "lucide-react"
import type { Screen } from "@/app/page"

interface ReceiveScreenProps {
  onNavigate: (screen: Screen) => void
}

export function ReceiveScreen({ onNavigate }: ReceiveScreenProps) {
  const [copied, setCopied] = useState(false)
  const walletAddress = "addr1vy2u6p7xnn3l72xxm8t38t0p0h3cmr6hx8cxcpnjn3vn5jq5r79sz"

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => onNavigate("wallet")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">Receive</h1>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center space-y-8">
        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-accent rounded-3xl p-8"
        >
          <div className="w-64 h-64 bg-accent-foreground/10 rounded-2xl flex items-center justify-center">
            <span className="text-accent-foreground/30 text-sm">QR Code Placeholder</span>
          </div>
        </motion.div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-4"
        >
          <p className="text-center text-muted-foreground text-sm">Your wallet address</p>
          <div className="bg-card rounded-2xl p-4 flex items-center gap-3">
            <span className="flex-1 text-foreground font-mono text-sm truncate">{walletAddress}</span>
            <button
              onClick={handleCopy}
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Copy className={`w-5 h-5 ${copied ? "text-primary-foreground" : "text-primary-foreground"}`} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-3">
        <Button
          onClick={handleCopy}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl"
        >
          {copied ? "Copied!" : "Copy Address"}
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 bg-card border-border text-foreground hover:bg-card/80 rounded-2xl"
          >
            <Download className="w-5 h-5 mr-2" />
            QR
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
