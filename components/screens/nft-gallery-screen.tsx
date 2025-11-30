"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Search } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Input } from "@/components/ui/input"

interface NFTGalleryScreenProps {
  onNavigate: (screen: any, data?: any) => void
}

export function NFTGalleryScreen({ onNavigate }: NFTGalleryScreenProps) {
  const { state, selectNFT } = useApp()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNFTs = state.nfts.filter((nft) => nft.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectNFT = (nftId: string) => {
    selectNFT(nftId)
    onNavigate("nft-details")
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      {/* Header */}
      <div className="bg-[#1C1C1C] border-b border-[#F2F2F2]/10 p-4 flex items-center gap-4">
        <button onClick={() => onNavigate("home")} className="p-2 hover:bg-[#F2F2F2]/10 rounded-lg transition">
          <ChevronLeft className="w-5 h-5 text-[#F2F2F2]" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-[#F2F2F2]">My NFTs</h1>
          <p className="text-sm text-[#8A8A8A]">{state.nfts.length} items</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#F2F2F2]/10">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#8A8A8A]" />
          <Input
            placeholder="Search NFTs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1C1C1C] border-[#F2F2F2]/20 text-[#F2F2F2] placeholder:text-[#8A8A8A] pl-9"
          />
        </div>
      </div>

      {/* NFT Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredNFTs.map((nft) => (
            <motion.button
              key={nft.id}
              onClick={() => handleSelectNFT(nft.id)}
              whileHover={{ y: -4 }}
              className="text-left"
            >
              <div className="bg-[#1C1C1C] rounded-2xl overflow-hidden border border-[#F2F2F2]/10 hover:border-[#00C28D] transition">
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-[#F2F2F2] truncate">{nft.name}</h3>
                  <p className="text-xs text-[#00C28D]">{nft.price} ETH</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
