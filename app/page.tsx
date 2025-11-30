"use client"

import { useState } from "react"
import { AppProvider } from "@/lib/app-context"
import { OnboardingScreen } from "@/components/screens/onboarding-screen"
import { LoginScreen } from "@/components/screens/login-screen"
import { ImportWalletScreen } from "@/components/screens/import-wallet-screen"
import { OTPScreen } from "@/components/screens/otp-screen"
import { HomeScreen } from "@/components/screens/home-screen"
import { ChatScreen } from "@/components/screens/chat-screen"
import { NewChatScreen } from "@/components/screens/new-chat-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { WalletScreen } from "@/components/screens/wallet-screen"
import { SendPaymentScreen } from "@/components/screens/send-payment-screen"
import { RequestPaymentScreen } from "@/components/screens/request-payment-screen"
import { PaymentSuccessScreen } from "@/components/screens/payment-success-screen"
import { ReceiveScreen } from "@/components/screens/receive-screen"
import { BuyCryptoScreen } from "@/components/screens/buy-crypto-screen"
import { TransactionsScreen } from "@/components/screens/transactions-screen"
import { MerchantScreen } from "@/components/screens/merchant-screen"
import { MarketplaceScreen } from "@/components/screens/marketplace-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"
import { NFTGalleryScreen } from "@/components/screens/nft-gallery-screen"
import { NFTDetailsScreen } from "@/components/screens/nft-details-screen"
import { NetworkSwitcherScreen } from "@/components/screens/network-switcher-screen"
import { NotificationsScreen } from "@/components/screens/notifications-screen"

export type Screen =
  | "onboarding"
  | "login"
  | "import-wallet"
  | "otp"
  | "home"
  | "chat"
  | "new-chat"
  | "profile"
  | "wallet"
  | "send-payment"
  | "request-payment"
  | "payment-success"
  | "receive"
  | "buy-crypto"
  | "transactions"
  | "merchant"
  | "marketplace"
  | "settings"
  | "nft-gallery"
  | "nft-details"
  | "network-switcher"
  | "notifications"

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<{
    amount?: string
    token?: string
    recipient?: string
  } | null>(null)

  const navigate = (screen: Screen, chatId?: string, data?: any) => {
    setCurrentScreen(screen)
    if (chatId) setSelectedChat(chatId)
    if (data) setPaymentData(data)
  }

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === "onboarding" && <OnboardingScreen onNavigate={navigate} />}
      {currentScreen === "login" && <LoginScreen onNavigate={navigate} />}
      {currentScreen === "import-wallet" && <ImportWalletScreen onNavigate={navigate} />}
      {currentScreen === "otp" && <OTPScreen onNavigate={navigate} />}
      {currentScreen === "home" && <HomeScreen onNavigate={navigate} onSelectChat={(id) => navigate("chat", id)} />}
      {currentScreen === "chat" && <ChatScreen chatId={selectedChat} onNavigate={navigate} />}
      {currentScreen === "new-chat" && <NewChatScreen onNavigate={navigate} />}
      {currentScreen === "profile" && <ProfileScreen onNavigate={navigate} />}
      {currentScreen === "wallet" && <WalletScreen onNavigate={navigate} />}
      {currentScreen === "send-payment" && <SendPaymentScreen onNavigate={navigate} />}
      {currentScreen === "request-payment" && <RequestPaymentScreen onNavigate={navigate} />}
      {currentScreen === "payment-success" && <PaymentSuccessScreen onNavigate={navigate} />}
      {currentScreen === "receive" && <ReceiveScreen onNavigate={navigate} />}
      {currentScreen === "buy-crypto" && <BuyCryptoScreen onNavigate={navigate} />}
      {currentScreen === "transactions" && <TransactionsScreen onNavigate={navigate} />}
      {currentScreen === "merchant" && <MerchantScreen onNavigate={navigate} />}
      {currentScreen === "marketplace" && <MarketplaceScreen onNavigate={navigate} />}
      {currentScreen === "settings" && <SettingsScreen onNavigate={navigate} />}
      {currentScreen === "nft-gallery" && <NFTGalleryScreen onNavigate={navigate} />}
      {currentScreen === "nft-details" && <NFTDetailsScreen onNavigate={navigate} />}
      {currentScreen === "network-switcher" && <NetworkSwitcherScreen onNavigate={navigate} />}
      {currentScreen === "notifications" && <NotificationsScreen onNavigate={navigate} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
