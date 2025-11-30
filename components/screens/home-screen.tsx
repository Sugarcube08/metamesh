"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Search, QrCode, Settings, MessageSquarePlus, Wallet, Store, User, Home, X, BadgeCheck } from "lucide-react"
import type { Screen } from "@/app/page"

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void
  onSelectChat: (chatId: string) => void
}

const CHATS = [
  {
    id: "1",
    name: "Alice.ada",
    avatar: "A",
    lastMessage: "Payment received! 🎉",
    time: "2m",
    unread: 2,
    verified: true,
    hasPayment: true,
  },
  {
    id: "2",
    name: "Bob.ada",
    avatar: "B",
    lastMessage: "Can you send the invoice?",
    time: "15m",
    unread: 0,
    verified: true,
    hasPayment: false,
  },
  {
    id: "3",
    name: "Cardano DAO",
    avatar: "C",
    lastMessage: "Vote ends in 2 days",
    time: "1h",
    unread: 5,
    verified: true,
    hasPayment: false,
  },
  {
    id: "4",
    name: "Charlie.ada",
    avatar: "C",
    lastMessage: "Thanks for the NFT!",
    time: "3h",
    unread: 0,
    verified: false,
    hasPayment: true,
  },
  {
    id: "5",
    name: "DeFi Group",
    avatar: "D",
    lastMessage: "New staking rewards available",
    time: "1d",
    unread: 12,
    verified: true,
    hasPayment: false,
  },
]

export function HomeScreen({ onNavigate, onSelectChat }: HomeScreenProps) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = CHATS.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Sidebar Drawer */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setShowSidebar(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card z-50 p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">@metamesh_user</p>
                    <p className="text-sm text-muted-foreground">12,450 ₳</p>
                  </div>
                </div>
                <button onClick={() => setShowSidebar(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: Home, label: "Home", screen: "home" as Screen },
                  { icon: Wallet, label: "Wallet", screen: "wallet" as Screen },
                  { icon: Store, label: "Marketplace", screen: "marketplace" as Screen },
                  { icon: User, label: "Profile", screen: "profile" as Screen },
                  { icon: Settings, label: "Settings", screen: "settings" as Screen },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.label === "Marketplace") {
                        onNavigate("merchant")
                      } else {
                        onNavigate(item.screen)
                      }
                      setShowSidebar(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                      item.screen === "home"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSidebar(true)}
            className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center"
          >
            <span className="text-primary font-bold">M</span>
          </button>
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors">
              <QrCode className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={() => onNavigate("settings")}
              className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="h-12 pl-12 bg-card border-0 text-foreground placeholder:text-muted-foreground rounded-2xl"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 px-4 py-2">
        {filteredChats.map((chat, index) => (
          <motion.button
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectChat(chat.id)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-card transition-colors mb-2"
          >
            <div className="relative">
              <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{chat.avatar}</span>
              </div>
              {chat.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <BadgeCheck className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{chat.name}</span>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  {chat.hasPayment && <span className="text-primary text-xs">₳</span>}
                  <span className="text-sm text-muted-foreground truncate max-w-[180px]">{chat.lastMessage}</span>
                </div>
                {chat.unread > 0 && (
                  <div className="min-w-[20px] h-5 bg-primary rounded-full flex items-center justify-center px-1.5">
                    <span className="text-xs font-bold text-primary-foreground">{chat.unread}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate("new-chat")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,194,141,0.3)] z-20"
      >
        <MessageSquarePlus className="w-6 h-6 text-primary-foreground" />
      </motion.button>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-card/80 backdrop-blur-md border-t border-border px-6 py-3">
        <div className="flex items-center justify-around">
          {[
            { icon: Home, label: "Home", screen: "home" as Screen, active: true },
            { icon: Wallet, label: "Wallet", screen: "wallet" as Screen, active: false },
            { icon: Store, label: "Market", screen: "marketplace" as Screen, active: false },
            { icon: User, label: "Profile", screen: "profile" as Screen, active: false },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="flex flex-col items-center gap-1"
            >
              <item.icon className={`w-6 h-6 ${item.active ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs ${item.active ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
