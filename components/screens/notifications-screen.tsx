"use client"

import { motion } from "framer-motion"
import { ChevronLeft, Trash2 } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { formatDistanceToNow } from "date-fns"

interface NotificationsScreenProps {
  onNavigate: (screen: any, data?: any) => void
}

export function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const { state, markNotificationRead } = useApp()

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id)
    if (notif.action) {
      onNavigate(notif.action.screen)
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      {/* Header */}
      <div className="bg-[#1C1C1C] border-b border-[#F2F2F2]/10 p-4 flex items-center gap-4">
        <button onClick={() => onNavigate("home")} className="p-2 hover:bg-[#F2F2F2]/10 rounded-lg transition">
          <ChevronLeft className="w-5 h-5 text-[#F2F2F2]" />
        </button>
        <h1 className="text-lg font-semibold text-[#F2F2F2]">Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {state.notifications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#8A8A8A]">No notifications</div>
        ) : (
          state.notifications.map((notif, idx) => (
            <motion.button
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`w-full px-4 py-4 border-b border-[#F2F2F2]/10 hover:bg-[#1C1C1C] transition text-left group ${
                !notif.read ? "bg-[#00C28D]/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#F2F2F2]">{notif.title}</h3>
                  <p className="text-xs text-[#8A8A8A] mt-1">{notif.message}</p>
                  <p className="text-xs text-[#8A8A8A] mt-2">
                    {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <button
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  )
}
