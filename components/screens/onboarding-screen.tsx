"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Hexagon, ArrowRight, Wallet } from "lucide-react"
import type { Screen } from "@/app/page"

interface OnboardingScreenProps {
  onNavigate: (screen: Screen) => void
}

export function OnboardingScreen({ onNavigate }: OnboardingScreenProps) {

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00C28D" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glowing orb effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(0,194,141,0.3)]">
            <Hexagon className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-foreground text-center mb-4"
        >
          MetaMesh
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground text-center text-lg mb-12 max-w-sm"
        >
          Decentralized messaging meets Web3 payments on Cardano
        </motion.p>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="px-6 pb-12 relative z-10"
      >
        <Button
          onClick={() => onNavigate("connect-wallet")}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl transition-all hover:shadow-[0_0_30px_rgba(0,194,141,0.3)]"
        >
          <Wallet className="mr-2 w-5 h-5" />
          Connect Wallet
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}

