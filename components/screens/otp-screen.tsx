"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import type { Screen } from "@/app/page"

interface OTPScreenProps {
  onNavigate: (screen: Screen) => void
}

export function OTPScreen({ onNavigate }: OTPScreenProps) {
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-4 p-4">
        <button
          onClick={() => onNavigate("import-wallet")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-foreground font-medium">Verify Identity</span>
      </div>

      <div className="flex-1 px-6 pt-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Enter OTP Code</h2>
          <p className="text-muted-foreground">We've sent a verification code to your email</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">6-Digit Code</label>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
            placeholder="000000"
            maxLength="6"
            className="h-14 text-center text-2xl tracking-widest bg-card border-input text-foreground placeholder:text-muted-foreground rounded-2xl font-semibold"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          Code expires in {timeLeft} seconds
        </motion.div>
      </div>

      <div className="p-6">
        <Button
          onClick={() => otp.length === 6 && onNavigate("home")}
          disabled={otp.length !== 6}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl disabled:opacity-50"
        >
          Verify
        </Button>
      </div>
    </div>
  )
}
