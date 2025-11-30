"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ChevronRight,
  Shield,
  Smartphone,
  User,
  Moon,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Key,
  Eye,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { Screen } from "@/app/page"

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void
}

const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Identity / DID", description: "Manage your decentralized identity", hasArrow: true },
      { icon: Key, label: "Wallet Backup", description: "Backup your recovery phrase", hasArrow: true },
      { icon: Lock, label: "Security", description: "Password, biometrics, 2FA", hasArrow: true },
    ],
  },
  {
    title: "Privacy",
    items: [
      { icon: Eye, label: "Midnight Privacy", description: "Configure private transactions", hasArrow: true },
      { icon: Shield, label: "Data Protection", description: "Manage your data settings", hasArrow: true },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        icon: Bell,
        label: "Notifications",
        description: "Push, email, and in-app alerts",
        hasToggle: true,
        toggleKey: "notifications",
      },
      {
        icon: Moon,
        label: "Dark Mode",
        description: "Always on",
        hasToggle: true,
        toggleKey: "darkMode",
        defaultOn: true,
      },
      { icon: Smartphone, label: "Connected Devices", description: "2 devices connected", hasArrow: true },
    ],
  },
  {
    title: "Support",
    items: [{ icon: HelpCircle, label: "About MetaMesh", description: "Version 1.0.0", hasArrow: true }],
  },
]

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    notifications: true,
    darkMode: true,
  })

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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
        <h1 className="flex-1 text-xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Settings List */}
      <div className="flex-1 px-4 py-4 space-y-6">
        {SETTINGS_SECTIONS.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">{section.title}</h3>
            <div className="bg-card rounded-2xl overflow-hidden">
              {section.items.map((item, index) => (
                <button
                  key={item.label}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-background/50 transition-colors ${
                    index !== section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-background rounded-2xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.hasArrow && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                  {item.hasToggle && item.toggleKey && (
                    <Switch
                      checked={toggles[item.toggleKey]}
                      onCheckedChange={() => handleToggle(item.toggleKey!)}
                      className="data-[state=checked]:bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-destructive/10 rounded-2xl p-4 flex items-center justify-center gap-3"
        >
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="font-medium text-destructive">Log Out</span>
        </motion.button>
      </div>
    </div>
  )
}
