"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, BadgeCheck } from "lucide-react"
import type { Screen } from "@/app/page"

interface NewChatScreenProps {
  onNavigate: (screen: Screen) => void
}

const SUGGESTED_CONTACTS = [
  { id: "1", name: "Alice.ada", avatar: "A", verified: true },
  { id: "2", name: "Bob.ada", avatar: "B", verified: true },
  { id: "3", name: "Charlie.ada", avatar: "C", verified: false },
  { id: "4", name: "Diana.ada", avatar: "D", verified: true },
  { id: "5", name: "Eve.ada", avatar: "E", verified: false },
  { id: "6", name: "Frank.ada", avatar: "F", verified: true },
]

export function NewChatScreen({ onNavigate }: NewChatScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = SUGGESTED_CONTACTS.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => onNavigate("home")}
          className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">New Chat</h1>
      </div>

      {/* Search */}
      <div className="sticky top-16 bg-background/80 backdrop-blur-md px-4 py-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="h-12 pl-12 bg-card border-0 text-foreground placeholder:text-muted-foreground rounded-2xl"
          />
        </div>
      </div>

      {/* Contacts */}
      <div className="flex-1 px-4 py-4 space-y-2">
        {filteredContacts.map((contact, index) => (
          <motion.button
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onNavigate("chat", contact.id)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-card transition-colors"
          >
            <div className="relative">
              <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{contact.avatar}</span>
              </div>
              {contact.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <BadgeCheck className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 text-left">
              <span className="font-semibold text-foreground">{contact.name}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
