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
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import type { Screen } from "@/app/page"
import { createInvoice, markIssued } from "@/lib/api/metamesh"
import { payInvoice } from "@/lib/cardano/payInvoice"

interface ChatScreenProps {
  chatId: string | null
  onNavigate: (screen: Screen) => void
}

interface Message {
  id: string
  type: "sent" | "received" | "payment" | "nft" | "invoice" | "receipt"
  content?: string
  amount?: string
  token?: string
  status?: string
  direction?: "sent" | "received"
  name?: string
  txHash?: string
  time: string
  // Invoice fields
  invoiceId?: string
  metadataURI?: string
  recipientAddress?: string
  description?: string
  // Receipt fields
  proofHash?: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: "1", type: "received", content: "Hey! Can you send me 50 ADA for the concert tickets?", time: "10:30 AM" },
  { id: "2", type: "sent", content: "Let me check my wallet balance first", time: "10:31 AM" },
]

export function ChatScreenEnhanced({ chatId, onNavigate }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [message, setMessage] = useState("")
  const [showAttachments, setShowAttachments] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Demo wallet address (replace with actual wallet connection)
  const recipientAddress = "addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9"
  const network = (process.env.NEXT_PUBLIC_CARDANO_NETWORK as "Preprod" | "Mainnet") || "Mainnet"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Detect invoice request in message
  const detectInvoiceRequest = (text: string): { amount: number; description: string } | null => {
    // Patterns: "Request ₹500 for logo", "Request 500 ADA for logo", "/invoice 500 Website"
    const patterns = [
      /request\s+(?:₹|rs\.?|ada\s+)?(\d+)\s+(?:ada\s+)?(?:for|to|payment\s+for)?\s*(.+)/i,
      /\/invoice\s+(\d+)\s+(.+)/i,
      /invoice\s+(\d+)\s+(.+)/i,
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return {
          amount: parseInt(match[1]),
          description: match[2]?.trim() || "Payment request",
        }
      }
    }

    return null
  }

  const handleSend = async () => {
    if (!message.trim() || isProcessing) return

    const text = message.trim()
    setMessage("")

    // Check if it's an invoice request
    const invoiceData = detectInvoiceRequest(text)

    if (invoiceData) {
      // Create invoice
      setIsProcessing(true)
      try {
        const invoice = await createInvoice({
          recipientDID: "did:test:user2",
          recipientAddress: recipientAddress,
          amount: (invoiceData.amount * 1000000).toString(), // Convert to lovelace
          description: invoiceData.description,
          issuer: "MetaMesh",
        })

        // Add invoice message
        const newMessage: Message = {
          id: Date.now().toString(),
          type: "invoice",
          invoiceId: invoice.id,
          metadataURI: invoice.metadataURI,
          recipientAddress: recipientAddress,
          amount: invoiceData.amount.toString(),
          description: invoiceData.description,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages((prev) => [...prev, newMessage])
      } catch (error) {
        console.error("Error creating invoice:", error)
        alert("Failed to create invoice: " + (error instanceof Error ? error.message : "Unknown error"))
      } finally {
        setIsProcessing(false)
      }
    } else {
      // Regular message
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "sent",
        content: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, newMessage])
    }
  }

  const handlePay = async (invoiceId: string, metadataURI: string, recipientAddr: string) => {
    setIsProcessing(true)
    try {
      // Pay invoice (mint NFT receipt)
      const txHash = await payInvoice({
        metadataURI,
        recipientAddr,
        network,
      })

      // Mark as issued in backend
      await markIssued(invoiceId, txHash)

      // Add receipt message
      const receiptMessage: Message = {
        id: Date.now().toString(),
        type: "receipt",
        txHash,
        metadataURI,
        status: "paid",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, receiptMessage])

      // Update invoice message status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.invoiceId === invoiceId ? { ...msg, status: "paid" } : msg
        )
      )
    } catch (error) {
      console.error("Error paying invoice:", error)
      alert("Payment failed: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsProcessing(false)
    }
  }

  const getExplorerUrl = (txHash: string) => {
    return network === "Mainnet"
      ? `https://cardanoscan.io/transaction/${txHash}`
      : `https://preprod.cardanoscan.io/transaction/${txHash}`
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
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.type === "sent" || (msg.type === "payment" && msg.direction === "sent")
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {/* Regular Messages */}
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

            {/* Invoice Message */}
            {msg.type === "invoice" && (
              <div className="max-w-[80%] bg-blue-500/10 border border-blue-500/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-foreground">Payment Request</span>
                </div>
                <div className="bg-background/50 rounded-xl p-3 mb-3">
                  <p className="text-2xl font-bold text-blue-400">{msg.amount} ADA</p>
                  <p className="text-sm text-muted-foreground mt-1">{msg.description}</p>
                </div>
                {msg.status === "paid" ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs">Paid</span>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      msg.invoiceId &&
                      msg.metadataURI &&
                      msg.recipientAddress &&
                      handlePay(msg.invoiceId, msg.metadataURI, msg.recipientAddress)
                    }
                    disabled={isProcessing}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Processing..." : "Pay"}
                  </button>
                )}
                <p className="text-xs text-muted-foreground mt-2">{msg.time}</p>
              </div>
            )}

            {/* Receipt Message */}
            {msg.type === "receipt" && (
              <div className="max-w-[80%] bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-foreground">Payment Receipt</span>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div className="bg-background/50 rounded-xl p-3 mb-3">
                  <p className="font-semibold text-foreground mb-2">Payment Successful!</p>
                  <p className="text-xs text-muted-foreground mb-2">TX: {msg.txHash?.substring(0, 20)}...</p>
                  {msg.metadataURI && (
                    <p className="text-xs text-muted-foreground">Metadata: {msg.metadataURI.substring(0, 30)}...</p>
                  )}
                </div>
                {msg.txHash && (
                  <a
                    href={getExplorerUrl(msg.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium"
                  >
                    <span>View on Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <p className="text-xs text-muted-foreground mt-2">{msg.time}</p>
              </div>
            )}

            {/* Payment Message */}
            {msg.type === "payment" && (
              <div
                className={`max-w-[80%] ${
                  msg.direction === "sent" ? "bg-primary" : "bg-card"
                } rounded-2xl px-4 py-3`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wallet
                    className={`w-4 h-4 ${
                      msg.direction === "sent" ? "text-primary-foreground" : "text-primary"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      msg.direction === "sent" ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    Payment {msg.direction === "sent" ? "Sent" : "Received"}
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    msg.direction === "sent" ? "text-primary-foreground" : "text-primary"
                  }`}
                >
                  {msg.amount} {msg.token}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      msg.status === "confirmed" ? "bg-green-400" : "bg-yellow-400"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      msg.direction === "sent" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {msg.status === "confirmed" ? "Confirmed" : "Pending"}
                  </span>
                </div>
              </div>
            )}

            {/* NFT Message */}
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
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message or 'Request ₹500 for logo design'..."
            disabled={isProcessing}
            className="h-12 pr-12 bg-background border-0 text-foreground placeholder:text-muted-foreground rounded-2xl disabled:opacity-50"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={isProcessing || !message.trim()}
          className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5 text-primary-foreground" />
        </motion.button>
      </div>
    </div>
  )
}

