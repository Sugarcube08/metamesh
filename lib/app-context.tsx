"use client"

import React, { createContext, useReducer, useCallback, type ReactNode } from "react"
import {
  DUMMY_USER,
  DUMMY_WALLETS,
  DUMMY_NETWORKS,
  DUMMY_NFTS,
  DUMMY_TRANSACTIONS,
  DUMMY_NOTIFICATIONS,
} from "./dummy-data"

// State Types
export interface AppState {
  user: typeof DUMMY_USER
  connectedWallet: (typeof DUMMY_WALLETS)[0] | null
  wallets: typeof DUMMY_WALLETS
  activeNetwork: (typeof DUMMY_NETWORKS)[0]
  networks: typeof DUMMY_NETWORKS
  nfts: typeof DUMMY_NFTS
  transactions: typeof DUMMY_TRANSACTIONS
  notifications: typeof DUMMY_NOTIFICATIONS
  selectedNFT: (typeof DUMMY_NFTS)[0] | null
  selectedTransaction: (typeof DUMMY_TRANSACTIONS)[0] | null
  isLoading: boolean
  uiState: {
    sidebarOpen: boolean
    notificationsOpen: boolean
    networkSwitcherOpen: boolean
    walletSelectorOpen: boolean
  }
}

type Action =
  | { type: "CONNECT_WALLET"; payload: string }
  | { type: "DISCONNECT_WALLET" }
  | { type: "SWITCH_NETWORK"; payload: string }
  | { type: "SELECT_NFT"; payload: string | null }
  | { type: "SELECT_TRANSACTION"; payload: string | null }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_NOTIFICATIONS" }
  | { type: "TOGGLE_NETWORK_SWITCHER" }
  | { type: "TOGGLE_WALLET_SELECTOR" }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_BALANCE"; payload: { walletId: string; balance: string } }
  | { type: "ADD_TRANSACTION"; payload: (typeof DUMMY_TRANSACTIONS)[0] }

const initialState: AppState = {
  user: DUMMY_USER,
  connectedWallet: DUMMY_WALLETS[0],
  wallets: DUMMY_WALLETS,
  activeNetwork: DUMMY_NETWORKS[0],
  networks: DUMMY_NETWORKS,
  nfts: DUMMY_NFTS,
  transactions: DUMMY_TRANSACTIONS,
  notifications: DUMMY_NOTIFICATIONS,
  selectedNFT: null,
  selectedTransaction: null,
  isLoading: false,
  uiState: {
    sidebarOpen: false,
    notificationsOpen: false,
    networkSwitcherOpen: false,
    walletSelectorOpen: false,
  },
}

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "CONNECT_WALLET":
      return {
        ...state,
        connectedWallet: state.wallets.find((w) => w.id === action.payload) || null,
        uiState: { ...state.uiState, walletSelectorOpen: false },
      }
    case "DISCONNECT_WALLET":
      return {
        ...state,
        connectedWallet: null,
      }
    case "SWITCH_NETWORK":
      return {
        ...state,
        activeNetwork: state.networks.find((n) => n.id === action.payload) || state.activeNetwork,
        uiState: { ...state.uiState, networkSwitcherOpen: false },
      }
    case "SELECT_NFT":
      return {
        ...state,
        selectedNFT: action.payload ? state.nfts.find((n) => n.id === action.payload) || null : null,
      }
    case "SELECT_TRANSACTION":
      return {
        ...state,
        selectedTransaction: action.payload ? state.transactions.find((t) => t.id === action.payload) || null : null,
      }
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        uiState: { ...state.uiState, sidebarOpen: !state.uiState.sidebarOpen },
      }
    case "TOGGLE_NOTIFICATIONS":
      return {
        ...state,
        uiState: { ...state.uiState, notificationsOpen: !state.uiState.notificationsOpen },
      }
    case "TOGGLE_NETWORK_SWITCHER":
      return {
        ...state,
        uiState: { ...state.uiState, networkSwitcherOpen: !state.uiState.networkSwitcherOpen },
      }
    case "TOGGLE_WALLET_SELECTOR":
      return {
        ...state,
        uiState: { ...state.uiState, walletSelectorOpen: !state.uiState.walletSelectorOpen },
      }
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n)),
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "UPDATE_BALANCE":
      return {
        ...state,
        wallets: state.wallets.map((w) =>
          w.id === action.payload.walletId ? { ...w, balance: action.payload.balance } : w,
        ),
      }
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  connectWallet: (walletId: string) => void
  disconnectWallet: () => void
  switchNetwork: (networkId: string) => void
  selectNFT: (nftId: string | null) => void
  selectTransaction: (txId: string | null) => void
  toggleSidebar: () => void
  toggleNotifications: () => void
  toggleNetworkSwitcher: () => void
  toggleWalletSelector: () => void
  markNotificationRead: (notifId: string) => void
  setLoading: (loading: boolean) => void
  updateBalance: (walletId: string, balance: string) => void
  addTransaction: (tx: (typeof DUMMY_TRANSACTIONS)[0]) => void
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const connectWallet = useCallback((walletId: string) => {
    dispatch({ type: "CONNECT_WALLET", payload: walletId })
  }, [])

  const disconnectWallet = useCallback(() => {
    dispatch({ type: "DISCONNECT_WALLET" })
  }, [])

  const switchNetwork = useCallback((networkId: string) => {
    dispatch({ type: "SWITCH_NETWORK", payload: networkId })
  }, [])

  const selectNFT = useCallback((nftId: string | null) => {
    dispatch({ type: "SELECT_NFT", payload: nftId })
  }, [])

  const selectTransaction = useCallback((txId: string | null) => {
    dispatch({ type: "SELECT_TRANSACTION", payload: txId })
  }, [])

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }, [])

  const toggleNotifications = useCallback(() => {
    dispatch({ type: "TOGGLE_NOTIFICATIONS" })
  }, [])

  const toggleNetworkSwitcher = useCallback(() => {
    dispatch({ type: "TOGGLE_NETWORK_SWITCHER" })
  }, [])

  const toggleWalletSelector = useCallback(() => {
    dispatch({ type: "TOGGLE_WALLET_SELECTOR" })
  }, [])

  const markNotificationRead = useCallback((notifId: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: notifId })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading })
  }, [])

  const updateBalance = useCallback((walletId: string, balance: string) => {
    dispatch({ type: "UPDATE_BALANCE", payload: { walletId, balance } })
  }, [])

  const addTransaction = useCallback((tx: (typeof DUMMY_TRANSACTIONS)[0]) => {
    dispatch({ type: "ADD_TRANSACTION", payload: tx })
  }, [])

  return (
    <AppContext.Provider
      value={{
        state,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        selectNFT,
        selectTransaction,
        toggleSidebar,
        toggleNotifications,
        toggleNetworkSwitcher,
        toggleWalletSelector,
        markNotificationRead,
        setLoading,
        updateBalance,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
