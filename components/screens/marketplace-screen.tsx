"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, Filter, Heart, ShoppingBag } from "lucide-react"
import type { Screen } from "@/app/page"

interface MarketplaceScreenProps {
  onNavigate: (screen: Screen) => void
}

const CATEGORIES = ["All", "Art", "Music", "Collectibles", "Gaming", "Utility"]

const ITEMS = [
  { id: "1", name: "Cosmic Dreamer #42", creator: "ArtistAda", price: "250", image: "cosmic", likes: 142 },
  { id: "2", name: "Midnight Protocol", creator: "CryptoCreator", price: "500", image: "protocol", likes: 89 },
  { id: "3", name: "Genesis Block", creator: "CardanoKing", price: "1,200", image: "genesis", likes: 324 },
  { id: "4", name: "Neural Network", creator: "AIArtist", price: "180", image: "neural", likes: 56 },
  { id: "5", name: "Plutus Script", creator: "DevMaster", price: "75", image: "plutus", likes: 203 },
  { id: "6", name: "Staking Rewards", creator: "PoolOp", price: "320", image: "staking", likes: 167 },
]

export function MarketplaceScreen({ onNavigate }: MarketplaceScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md z-30 px-4 py-3 space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("home")}
            className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="flex-1 text-xl font-bold text-foreground">Marketplace</h1>
          <button className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center hover:bg-card/80 transition-colors">
            <ShoppingBag className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NFTs..."
              className="h-12 pl-12 bg-card border-0 text-foreground placeholder:text-muted-foreground rounded-2xl"
            />
          </div>
          <button className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-card/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl overflow-hidden"
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{item.name[0]}</span>
                  </div>
                </div>
                <button className="absolute top-3 right-3 w-8 h-8 bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <p className="font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">by {item.creator}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">{item.price} ₳</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="w-3 h-3" />
                    <span className="text-xs">{item.likes}</span>
                  </div>
                </div>
                <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm">
                  Buy with ADA
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
