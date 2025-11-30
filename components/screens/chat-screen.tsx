"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Phone,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  BadgeCheck,
  Wallet,
  FileText,
  QrCode,
  Users,
  Receipt,
} from "lucide-react"
import type { Screen } from "@/app/page"

interface ChatScreenProps {
  chatId: string | null
  onNavigate: (screen: Screen) => void
}

const MESSAGES = [
  { id: "1", type: "received", content: "Hey! Can you send me 50 ADA for the concert tickets?", time: "10:30 AM" },
  { id: "2", type: "sent", content: "Let me check my wallet balance first", time: "10:31 AM" },
  { id: "3", type: "payment", direction: "sent", amount: "50", token: "ADA", status: "confirmed", time: "10:32 AM" },
  { id: "4", type: "received", content: "Payment received! 🎉", time: "10:32 AM" },
  { id: "5", type: "received", content: "Thanks so much! Here's the receipt NFT", time: "10:33 AM" },
  { id: "6", type: "nft", name: "Concert Ticket Receipt", txHash: "abc...xyz", time: "10:33 AM" },
]

export function ChatScreen({ chatId, onNavigate }: ChatScreenProps) {
  const [message, setMessage] = useState("")
  const [showAttachments, setShowAttachments] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleSend = () => {
    if (message.trim()) {
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-3 border-b border-border">
        <button
          onClick={() => onNavigate("home")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <button onClick={() => onNavigate("profile")} className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
              <span className="font-bold text-primary-foreground">A</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <BadgeCheck className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground">Alice.ada</p>
            <p className="text-xs text-foreground/50">Online</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors">
            <Phone className="w-5 h-5 text-primary" />
          </button>
          <button className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors">
            <MoreVertical className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
        {MESSAGES.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.type === "sent" || (msg.type === "payment" && msg.direction === "sent") ? "justify-end" : "justify-start"}`}
          >
            {msg.type === "received" && (
              <div className="max-w-[80%] bg-card rounded-2xl rounded-bl-md px-4 py-3">
                <p className="text-foreground">{msg.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
              </div>
            )}

            {msg.type === "sent" && (
              <div className="max-w-[80%] bg-primary rounded-2xl rounded-br-md px-4 py-3">
                <p className="text-primary-foreground">{msg.content}</p>
                <p className="text-xs text-primary-foreground/70 mt-1">{msg.time}</p>
              </div>
            )}

            {msg.type === "payment" && (
              <div
                className={`max-w-[80%] ${msg.direction === "sent" ? "bg-primary" : "bg-card"} rounded-2xl px-4 py-3`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wallet
                    className={`w-4 h-4 ${msg.direction === "sent" ? "text-primary-foreground" : "text-primary"}`}
                  />
                  <span
                    className={`text-sm font-medium ${msg.direction === "sent" ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    Payment {msg.direction === "sent" ? "Sent" : "Received"}
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${msg.direction === "sent" ? "text-primary-foreground" : "text-primary"}`}
                >
                  {msg.amount} {msg.token}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-2 h-2 rounded-full ${msg.status === "confirmed" ? "bg-green-400" : "bg-yellow-400"}`}
                  />
                  <span
                    className={`text-xs ${msg.direction === "sent" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {msg.status === "confirmed" ? "Confirmed" : "Pending"}
                  </span>
                </div>
              </div>
            )}

            {msg.type === "nft" && (
              <div className="max-w-[80%] bg-card rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Receipt NFT</span>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="font-semibold text-foreground">{msg.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">TX: {msg.txHash}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{msg.time}</p>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Menu */}
      <AnimatePresence>
        {showAttachments && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="px-4 pb-4"
          >
            <div className="bg-card rounded-2xl p-4 grid grid-cols-3 gap-4">
              {[
                { icon: Wallet, label: "Send Funds", color: "bg-green-500/20 text-green-400" },
                { icon: FileText, label: "Invoice", color: "bg-blue-500/20 text-blue-400" },
                { icon: QrCode, label: "QR Code", color: "bg-purple-500/20 text-purple-400" },
                { icon: Users, label: "Bill Split", color: "bg-orange-500/20 text-orange-400" },
                { icon: Receipt, label: "Receipt", color: "bg-pink-500/20 text-pink-400" },
                { icon: BadgeCheck, label: "Share DID", color: "bg-cyan-500/20 text-cyan-400" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.label === "Send Funds" && onNavigate("transactions")}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <div className="sticky bottom-0 bg-card/80 backdrop-blur-md px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setShowAttachments(!showAttachments)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            showAttachments
              ? "bg-primary text-primary-foreground"
              : "bg-background text-foreground hover:bg-background/80"
          }`}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message..."
            className="h-12 pr-12 bg-background border-0 text-foreground placeholder:text-muted-foreground rounded-2xl"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center"
        >
          <Send className="w-5 h-5 text-primary-foreground" />
        </motion.button>
      </div>
    </div>
  )
}
