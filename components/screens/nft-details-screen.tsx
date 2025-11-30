"use client"

import { motion } from "framer-motion"
import { ChevronLeft, Share2, Heart } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"

interface NFTDetailsScreenProps {
  onNavigate: (screen: any, data?: any) => void
}

export function NFTDetailsScreen({ onNavigate }: NFTDetailsScreenProps) {
  const { state } = useApp()
  const nft = state.selectedNFT

  if (!nft) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <p className="text-[#8A8A8A]">NFT not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      {/* Header */}
      <div className="bg-[#1C1C1C] border-b border-[#F2F2F2]/10 p-4 flex items-center justify-between">
        <button onClick={() => onNavigate("nft-gallery")} className="p-2 hover:bg-[#F2F2F2]/10 rounded-lg transition">
          <ChevronLeft className="w-5 h-5 text-[#F2F2F2]" />
        </button>
        <h1 className="text-lg font-semibold text-[#F2F2F2]">NFT Details</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1C1C1C] rounded-2xl overflow-hidden border border-[#F2F2F2]/10"
        >
          <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full aspect-square object-cover" />
        </motion.div>

        {/* Title & Actions */}
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold text-[#F2F2F2]">{nft.name}</h2>
            <p className="text-sm text-[#8A8A8A]">{nft.description}</p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-[#00C28D] hover:bg-[#00B078] text-[#000000]">Buy Now</Button>
            <button className="p-3 bg-[#1C1C1C] rounded-lg hover:bg-[#F2F2F2]/10 transition">
              <Heart className="w-5 h-5 text-[#F2F2F2]" />
            </button>
            <button className="p-3 bg-[#1C1C1C] rounded-lg hover:bg-[#F2F2F2]/10 transition">
              <Share2 className="w-5 h-5 text-[#F2F2F2]" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#1C1C1C] rounded-xl p-4 border border-[#F2F2F2]/10">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#8A8A8A] mb-1">Price</p>
              <p className="text-lg font-semibold text-[#00C28D]">{nft.price} ETH</p>
            </div>
            <div>
              <p className="text-xs text-[#8A8A8A] mb-1">Rarity</p>
              <p className="text-lg font-semibold text-[#F2F2F2] capitalize">{nft.rarity}</p>
            </div>
            <div>
              <p className="text-xs text-[#8A8A8A] mb-1">Token ID</p>
              <p className="text-lg font-semibold text-[#F2F2F2]">#{nft.tokenId}</p>
            </div>
          </div>
        </div>

        {/* Contract Info */}
        <div className="bg-[#1C1C1C] rounded-xl p-4 border border-[#F2F2F2]/10">
          <h3 className="text-sm font-semibold text-[#F2F2F2] mb-3">Contract</h3>
          <p className="text-xs text-[#8A8A8A] font-mono break-all">{nft.contractAddress}</p>
        </div>
      </div>
    </div>
  )
}
