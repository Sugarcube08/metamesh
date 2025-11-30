"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  BadgeCheck,
  Star,
  Settings,
  Copy,
  ExternalLink,
  Wallet,
  FileText,
  Receipt,
  Shield,
} from "lucide-react"
import type { Screen } from "@/app/page"

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void
}

const TABS = ["Transactions", "Invoices", "Receipts", "Permissions"]

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="relative">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-br from-primary/30 to-primary/5" />

        {/* Back button */}
        <button
          onClick={() => onNavigate("home")}
          className="absolute top-4 left-4 w-10 h-10 bg-background/50 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        {/* Settings button */}
        <button
          onClick={() => onNavigate("settings")}
          className="absolute top-4 right-4 w-10 h-10 bg-background/50 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <Settings className="w-5 h-5 text-foreground" />
        </button>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center border-4 border-background shadow-[0_0_40px_rgba(0,194,141,0.3)]">
            <span className="text-3xl font-bold text-primary-foreground">M</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
            <BadgeCheck className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-16 px-6 text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">@metamesh_user</h1>
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground text-sm">did:ada:1234...abcd</span>
          <button className="text-primary">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Reputation */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex items-center gap-1 bg-card px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-foreground font-semibold">4.9</span>
            <span className="text-muted-foreground text-sm">(128 reviews)</span>
          </div>
          <div className="bg-primary/20 px-3 py-1.5 rounded-full">
            <span className="text-primary text-sm font-medium">Trusted</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-6 flex gap-3">
        <Button
          onClick={() => onNavigate("wallet")}
          className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
        >
          <Wallet className="w-5 h-5 mr-2" />
          Wallet
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-12 bg-transparent border-border text-foreground hover:bg-card hover:text-foreground rounded-2xl"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Share
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                index === 0 ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-card/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-6 pb-6 space-y-3">
        {[
          {
            icon: Wallet,
            title: "Payment to Alice.ada",
            amount: "-50 ADA",
            time: "Today, 10:32 AM",
            status: "Confirmed",
          },
          { icon: FileText, title: "Invoice #1234", amount: "+120 ADA", time: "Yesterday, 3:45 PM", status: "Paid" },
          { icon: Receipt, title: "Concert Ticket Receipt", amount: "NFT", time: "Today, 10:33 AM", status: "Minted" },
          { icon: Shield, title: "Permission: View Balance", amount: "", time: "2 days ago", status: "Granted" },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.time}</p>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${item.amount.startsWith("+") ? "text-primary" : item.amount.startsWith("-") ? "text-foreground" : "text-muted-foreground"}`}
              >
                {item.amount}
              </p>
              <p className="text-xs text-muted-foreground">{item.status}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
