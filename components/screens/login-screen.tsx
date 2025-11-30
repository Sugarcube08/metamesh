"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, EyeOff, Copy, Check, Hexagon } from "lucide-react"
import type { Screen } from "@/app/page"

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void
}

const SEED_PHRASE = [
  "abandon",
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "absurd",
  "abuse",
  "access",
  "accident",
]

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [step, setStep] = useState<"username" | "seed" | "choice">("choice")
  const [username, setUsername] = useState("")
  const [showSeed, setShowSeed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(SEED_PHRASE.join(" "))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContinue = () => {
    if (step === "username" && username) {
      setStep("seed")
    } else if (step === "seed") {
      onNavigate("otp")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={() => {
            if (step !== "choice") setStep("choice")
            else onNavigate("onboarding")
          }}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-foreground font-medium">
          {step === "choice" ? "Get Started" : step === "username" ? "Create Identity" : "Secure Your Wallet"}
        </span>
      </div>

      <div className="flex-1 px-6 pt-8">
        <AnimatePresence mode="wait">
          {step === "choice" && (
            <motion.div
              key="choice"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Choose an option</h2>
                <p className="text-muted-foreground">Create a new wallet or import an existing one</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setStep("username")}
                  className="w-full p-6 bg-card rounded-2xl hover:bg-card/80 transition-colors text-left"
                >
                  <p className="font-semibold text-foreground mb-1">Create New Wallet</p>
                  <p className="text-sm text-muted-foreground">Generate a new recovery phrase</p>
                </button>

                <button
                  onClick={() => onNavigate("import-wallet")}
                  className="w-full p-6 bg-card rounded-2xl hover:bg-card/80 transition-colors text-left"
                >
                  <p className="font-semibold text-foreground mb-1">Import Wallet</p>
                  <p className="text-sm text-muted-foreground">Use an existing recovery phrase</p>
                </button>
              </div>
            </motion.div>
          )}

          {step === "username" && (
            <motion.div
              key="username"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Choose your username</h2>
                <p className="text-muted-foreground">This will be your decentralized identity on the network</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="h-14 pl-9 bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl text-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Your DID will be linked to this username</p>
              </div>
            </motion.div>
          )}

          {step === "seed" && (
            <motion.div
              key="seed"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Your Recovery Phrase</h2>
                <p className="text-muted-foreground">Write these words down and keep them safe. Never share them.</p>
              </div>

              <div className="bg-accent rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hexagon className="w-5 h-5 text-accent-foreground" />
                    <span className="font-semibold text-accent-foreground">Seed Phrase</span>
                  </div>
                  <button
                    onClick={() => setShowSeed(!showSeed)}
                    className="text-accent-foreground/60 hover:text-accent-foreground transition-colors"
                  >
                    {showSeed ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {SEED_PHRASE.map((word, i) => (
                    <div key={i} className="bg-accent-foreground/10 rounded-xl px-3 py-2 flex items-center gap-2">
                      <span className="text-xs text-accent-foreground/50">{i + 1}</span>
                      <span className={`text-sm font-medium text-accent-foreground ${!showSeed ? "blur-sm" : ""}`}>
                        {word}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="w-full h-12 bg-transparent border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10 rounded-xl"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-destructive/10 rounded-2xl p-4">
                <p className="text-sm text-destructive">
                  ⚠️ If you lose your seed phrase, you will lose access to your wallet and funds forever.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6">
        <Button
          onClick={handleContinue}
          disabled={step === "username" && !username}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === "username" ? "Continue" : step === "seed" ? "I've Saved My Phrase" : "Next"}
        </Button>
      </div>
    </div>
  )
}
