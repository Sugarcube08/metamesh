"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Copy, Shield } from "lucide-react"
import QRCode from "react-qr-code"
import type { Screen } from "@/app/page"
import { generateMnemonic, deriveKeysFromMnemonic, encryptMnemonic, saveWalletToStorage, type WalletData } from "@/lib/wallet/wallet-utils"
import { useWallet } from "@/lib/wallet/wallet-context"

interface CreateWalletScreenProps {
  onNavigate: (screen: Screen) => void
}

type Step = "mnemonic" | "confirm" | "password"

export function CreateWalletScreen({ onNavigate }: CreateWalletScreenProps) {
  const [step, setStep] = useState<Step>("mnemonic")
  const [mnemonic, setMnemonic] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const { setWallet } = useWallet()

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333'

  // Generate mnemonic on mount
  if (!mnemonic) {
    setMnemonic(generateMnemonic())
  }

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic)
  }

  const handleConfirmSaved = () => {
    setStep("password")
  }

  const validatePassword = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateWallet = async () => {
    if (!validatePassword()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Derive keys from mnemonic
      const { publicKey, address } = await deriveKeysFromMnemonic(mnemonic)

      // Encrypt mnemonic
      const encryptedMnemonic = encryptMnemonic(mnemonic, password)

      // Create wallet data
      const walletData: WalletData = {
        mnemonicEncrypted: encryptedMnemonic,
        publicKey,
        address,
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      saveWalletToStorage(walletData)

      // Update context
      setWallet(walletData)

      // Register with backend
      try {
        await fetch(`${backendUrl}/wallet/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicKey,
            createdAt: walletData.createdAt,
          }),
        })
      } catch (err) {
        console.error('Failed to register wallet with backend:', err)
        // Continue even if backend registration fails
      }

      // Navigate to home
      onNavigate("home")
    } catch (error) {
      console.error("Error creating wallet:", error)
      setErrors({ general: "Failed to create wallet. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={() => onNavigate("onboarding")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-foreground font-medium">Create Wallet</span>
      </div>

      <div className="flex-1 px-6 pt-8">
        <AnimatePresence mode="wait">
          {step === "mnemonic" && (
            <motion.div
              key="mnemonic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Your Recovery Phrase</h2>
                <p className="text-muted-foreground">
                  Write down these 12 words in order. Keep them safe and never share them with anyone.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-input space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {mnemonic.split(" ").map((word, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-6">{index + 1}.</span>
                      <span className="text-foreground font-medium">{word}</span>
                    </div>
                  ))}
                </div>
                
                {/* QR Code */}
                <div className="flex justify-center pt-4 border-t border-input">
                  <div className="bg-white p-4 rounded-xl">
                    <QRCode 
                      value={mnemonic}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleCopyMnemonic}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Phrase
                </Button>
              </div>

              <div className="bg-primary/10 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-medium mb-1">Important Security Notice</p>
                  <p className="text-muted-foreground">
                    If you lose this phrase, you will lose access to your wallet forever. Store it in a safe place.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleConfirmSaved}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl"
              >
                I have saved my phrase
                <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
              </Button>
            </motion.div>
          )}

          {step === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Create Password</h2>
                <p className="text-muted-foreground">
                  Create a password to encrypt your wallet locally. This password will be required to access your wallet.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 px-2">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 px-2">{errors.confirmPassword}</p>
                  )}
                </div>

                {errors.general && (
                  <p className="text-sm text-red-500 px-2">{errors.general}</p>
                )}
              </div>

              <Button
                onClick={handleCreateWallet}
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl disabled:opacity-50"
              >
                {isLoading ? "Creating Wallet..." : "Create Wallet"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

