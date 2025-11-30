"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import type { Screen } from "@/app/page"

interface ImportWalletScreenProps {
  onNavigate: (screen: Screen) => void
}

export function ImportWalletScreen({ onNavigate }: ImportWalletScreenProps) {
  const [seedPhrase, setSeedPhrase] = useState("")
  const [showPhrase, setShowPhrase] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const handleValidate = () => {
    if (seedPhrase.trim().split(/\s+/).length === 12) {
      setIsValid(true)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={() => onNavigate("login")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-foreground font-medium">Import Wallet</span>
      </div>

      <div className="flex-1 px-6 pt-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Enter Recovery Phrase</h2>
          <p className="text-muted-foreground">Paste your 12-word seed phrase to recover your wallet</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Recovery Phrase (12 words)</label>
          <div className="relative">
            <textarea
              value={seedPhrase}
              onChange={(e) => {
                setSeedPhrase(e.target.value)
                setIsValid(false)
              }}
              placeholder="word1 word2 word3 ... word12"
              className="w-full h-32 bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl p-4"
            />
            <button
              onClick={() => setShowPhrase(!showPhrase)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              {showPhrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/20 rounded-2xl p-4 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Seed phrase is valid!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 space-y-3">
        <Button
          onClick={handleValidate}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl"
        >
          Verify Phrase
        </Button>
        <Button
          onClick={() => isValid && onNavigate("otp")}
          disabled={!isValid}
          variant="outline"
          className="w-full h-14 border-border text-foreground rounded-2xl disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
