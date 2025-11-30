"use client"

import { motion } from "framer-motion"
import { ChevronLeft, Check } from "lucide-react"
import { useApp } from "@/lib/app-context"

interface NetworkSwitcherScreenProps {
  onNavigate: (screen: any, data?: any) => void
}

export function NetworkSwitcherScreen({ onNavigate }: NetworkSwitcherScreenProps) {
  const { state, switchNetwork } = useApp()

  const handleSwitchNetwork = (networkId: string) => {
    switchNetwork(networkId)
    onNavigate("home")
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      {/* Header */}
      <div className="bg-[#1C1C1C] border-b border-[#F2F2F2]/10 p-4 flex items-center gap-4">
        <button onClick={() => onNavigate("home")} className="p-2 hover:bg-[#F2F2F2]/10 rounded-lg transition">
          <ChevronLeft className="w-5 h-5 text-[#F2F2F2]" />
        </button>
        <h1 className="text-lg font-semibold text-[#F2F2F2]">Switch Network</h1>
      </div>

      {/* Network List */}
      <div className="flex-1 overflow-y-auto">
        {state.networks.map((network, idx) => (
          <motion.button
            key={network.id}
            onClick={() => handleSwitchNetwork(network.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="w-full px-4 py-3 border-b border-[#F2F2F2]/10 hover:bg-[#1C1C1C] transition text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{network.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-[#F2F2F2]">{network.name}</h3>
                  <p className="text-xs text-[#8A8A8A]">Chain ID: {network.chainId}</p>
                </div>
              </div>
              {state.activeNetwork.id === network.id && <Check className="w-5 h-5 text-[#00C28D]" />}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
