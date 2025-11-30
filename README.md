# MetaMesh

> **Decentralized messaging meets Web3 payments on Cardano**

MetaMesh is a revolutionary chat-based payment platform that seamlessly integrates Cardano blockchain transactions with private messaging. Convert chat messages into invoices, pay with Cardano wallets, and receive NFT receipts with privacy-preserving Midnight ZK proofs.

![MetaMesh](https://img.shields.io/badge/MetaMesh-v1.0.0-00C28D?style=for-the-badge)
![Cardano](https://img.shields.io/badge/Cardano-Enabled-0033AD?style=for-the-badge&logo=cardano)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express)

---

## 📖 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Demo Script](#-demo-script)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Introduction

MetaMesh combines the convenience of chat-based communication with the power of Cardano blockchain payments. Users can:

- **Request payments** through natural chat messages (e.g., "Request ₹500 for logo design")
- **Automatically generate invoices** with IPFS-hosted metadata
- **Pay invoices** using CIP-30 compatible Cardano wallets (Lace, Eternl, Flint, Gero)
- **Receive NFT receipts** on Cardano with CIP-25 metadata
- **Attach Midnight ZK proofs** for privacy-preserving payment verification

### Key Technologies

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Express.js, Node.js
- **Blockchain:** Cardano (Lucid SDK, Koios API)
- **Storage:** IPFS (metadata), Local JSON files (demo)
- **Privacy:** Midnight ZK proof integration
- **Wallets:** CIP-30 (Lace, Eternl, Flint, Gero)

---

## ✨ Features

### Core Features

- ✅ **Chat-Based Payments**
  - Natural language invoice requests
  - Automatic invoice generation from chat messages
  - Real-time payment status updates

- ✅ **Cardano Wallet Integration**
  - CIP-30 wallet support (Lace, Eternl, Flint, Gero)
  - Auto-reconnect on page load
  - Network validation (Preprod/Mainnet)
  - Real-time balance display

- ✅ **NFT Receipt Minting**
  - Automatic NFT minting on payment
  - CIP-25 metadata standard
  - IPFS-hosted metadata
  - Transaction explorer links

- ✅ **Midnight ZK Proofs**
  - Privacy-preserving proof generation
  - Proof hash in transaction metadata
  - Eligibility and payment amount verification

- ✅ **User Authentication**
  - Secure password-based signup
  - bcrypt password hashing
  - User session management

- ✅ **Modern UI/UX**
  - Beautiful, responsive design
  - Smooth animations (Framer Motion)
  - Dark/light theme support
  - Mobile-friendly interface

### Backend Features

- RESTful API with Express.js
- IPFS metadata pinning (with fallback for demo)
- JSON-based data storage
- CORS support for frontend
- User and wallet registration
- Invoice request management

### Frontend Features

- Next.js 16 with App Router
- TypeScript for type safety
- Context-based state management
- Real-time wallet connection
- Chat interface with payment integration
- NFT gallery and details views

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│    Backend      │────────▶│   IPFS/Storage  │
│   (Next.js)     │  HTTP   │   (Express)     │  API    │   (Metadata)    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Cardano Wallet │         │  Local Storage  │
│   (CIP-30)      │         │   (JSON files)  │
└─────────────────┘         └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Cardano Chain  │
│  (Koios API)    │
└─────────────────┘
```

### Data Flow

1. **Invoice Request:**
   ```
   User types message → Frontend detects pattern → Backend creates invoice → IPFS metadata → Returns metadataURI
   ```

2. **Payment Flow:**
   ```
   User clicks Pay → Wallet connects → Lucid builds transaction → Mints NFT → Submits to Cardano → Updates chat
   ```

3. **Receipt Display:**
   ```
   Transaction confirmed → Backend marks as issued → Frontend shows receipt bubble → Links to explorer
   ```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **pnpm** package manager
- **Git** ([Download](https://git-scm.com/))

### Browser Extensions

Install at least one of the following Cardano wallets:

- **Lace Wallet** ([Chrome](https://chrome.google.com/webstore/detail/lace/iakegglcibkhlnbjlcjiiigioiamdlla))
- **Eternl** ([Chrome](https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka))
- **Flint Wallet** ([Chrome](https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmgladlglchlgoiaikia))
- **Gero Wallet** ([Chrome](https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe))

### API Keys (Optional for Demo)

- **NFT.Storage API Key** (for IPFS) - Optional, fallback available
- **Koios API** - No key required (public API)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "final cardano project"
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
# From project root
npm install
```

### Step 4: Configure Environment Variables

#### Backend Configuration

Create a `.env` file in the `backend/` directory (optional for demo):

```env
NFT_STORAGE_API_KEY=your_nft_storage_key_here
PORT=3333
```

**Note:** If `NFT_STORAGE_API_KEY` is not set, the system will use a fallback mechanism for demo purposes.

#### Frontend Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3333
NEXT_PUBLIC_CARDANO_NETWORK=Mainnet
```

**Network Options:**
- `Mainnet` - Cardano mainnet (production)
- `Preprod` - Cardano testnet (development)

---

## ⚙️ Configuration

### Backend Configuration

The backend server runs on port `3333` by default. You can change this by setting the `PORT` environment variable.

**Data Storage:**
- User data: `backend/data/users.json`
- Wallet data: `backend/data/wallets.json`
- Invoice data: `backend/data/store.json`

### Frontend Configuration

The frontend runs on port `3000` by default (Next.js default).

**Key Configuration Files:**
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration

---

## 📖 Usage Guide

### Starting the Application

#### 1. Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
Backend listening on :3333
```

#### 2. Start the Frontend Development Server

```bash
# From project root
npm run dev
```

You should see:
```
✓ Ready in X ms
○ Local:        http://localhost:3000
```

#### 3. Open the Application

Navigate to `http://localhost:3000` in your browser.

### First-Time Setup

1. **Connect Your Wallet:**
   - Click "Connect Cardano Wallet" on the onboarding screen
   - Select your installed wallet (Lace, Eternl, Flint, or Gero)
   - Approve the connection request
   - Ensure your wallet is set to Preprod or Mainnet

2. **Navigate to Chat:**
   - After connecting, you'll be redirected to the home screen
   - Click on a chat or create a new one

3. **Request a Payment:**
   - Type a message like: `Request ₹500 for logo design`
   - The system will automatically detect the invoice request
   - An invoice bubble will appear in the chat

4. **Pay an Invoice:**
   - Click the "Pay" button on an invoice bubble
   - Your wallet will open for transaction approval
   - Sign the transaction
   - Wait for confirmation
   - A receipt bubble will appear with NFT details

### Chat Commands

The system automatically detects invoice requests from natural language:

- `Request ₹500 for logo design`
- `Request 500 ADA for website`
- `/invoice 500 Website development`
- `Invoice 1000 for consulting`

### Wallet Management

- **View Wallet:** Navigate to Wallet screen from home
- **Disconnect:** Click "Disconnect Wallet" button
- **Refresh Balance:** Click refresh icon on wallet screen
- **Auto-Reconnect:** Wallet automatically reconnects on page load

---

## 📡 API Documentation

### Backend Endpoints

#### Base URL
```
http://localhost:3333
```

#### 1. Create Invoice Request

**Endpoint:** `POST /issue-request`

**Request Body:**
```json
{
  "recipientDID": "did:test:user2",
  "recipientAddress": "addr1...",
  "amount": "500000000",
  "description": "Logo design",
  "issuer": "MetaMesh"
}
```

**Response:**
```json
{
  "id": "1234567890",
  "metadataURI": "ipfs://Qm..."
}
```

#### 2. Mark Invoice as Issued

**Endpoint:** `POST /mark-issued`

**Request Body:**
```json
{
  "id": "1234567890",
  "txId": "abc123..."
}
```

**Response:**
```json
{
  "ok": true
}
```

#### 3. Get All Invoices

**Endpoint:** `GET /requests`

**Response:**
```json
{
  "1234567890": {
    "id": "1234567890",
    "metadataURI": "ipfs://Qm...",
    "status": "issued",
    "txId": "abc123...",
    "metadata": { ... }
  }
}
```

#### 4. User Signup

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "alice",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true
}
```

#### 5. Register Wallet

**Endpoint:** `POST /wallet/register`

**Request Body:**
```json
{
  "publicKey": "addr1...",
  "createdAt": "2025-11-30T12:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "publicKey": "addr1..."
}
```

#### 6. Get Wallet Info

**Endpoint:** `GET /wallet/:publicKey`

**Response:**
```json
{
  "publicKey": "addr1...",
  "createdAt": "2025-11-30T12:00:00.000Z",
  "lastSeen": "2025-11-30T12:00:00.000Z"
}
```

### Frontend API Functions

Located in `lib/api/metamesh.ts`:

```typescript
// Create invoice
const invoice = await createInvoice({
  recipientDID: "did:test:user2",
  recipientAddress: "addr1...",
  amount: "500000000",
  description: "Logo design",
  issuer: "MetaMesh"
});

// Mark as issued
await markIssued(invoiceId, txHash);

// Get all invoices
const invoices = await getInvoices();
```

---

## 📁 Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main app entry point
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── test-mint/               # Test minting page
│
├── backend/                      # Express backend
│   ├── server.js                # Main server file
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   └── wallet.js            # Wallet routes
│   ├── services/                # Business logic
│   │   ├── ipfs.js              # IPFS pinning
│   │   ├── store.js             # Data storage
│   │   └── users.js             # User management
│   ├── data/                    # JSON data files
│   │   ├── store.json           # Invoice storage
│   │   ├── users.json           # User accounts
│   │   └── wallets.json         # Wallet metadata
│   ├── controllers/             # Request handlers
│   ├── examples/                # Example scripts
│   └── package.json             # Backend dependencies
│
├── components/                   # React components
│   ├── screens/                 # Screen components
│   │   ├── onboarding-screen.tsx
│   │   ├── connect-wallet-screen.tsx
│   │   ├── home-screen.tsx
│   │   ├── chat-screen-enhanced.tsx
│   │   ├── wallet-screen.tsx
│   │   └── ...
│   └── ui/                      # UI components (shadcn/ui)
│
├── lib/                          # Utility libraries
│   ├── api/                     # API clients
│   │   └── metamesh.ts          # Backend API calls
│   ├── cardano/                 # Cardano integration
│   │   ├── payInvoice.ts        # Payment & NFT minting
│   │   ├── mint.ts              # Basic minting
│   │   ├── mint-with-proof.ts   # Minting with proofs
│   │   └── ...
│   ├── wallet/                   # Wallet management
│   │   ├── cardano-wallet-context.tsx  # Wallet context
│   │   └── wallet-utils.ts      # Wallet utilities
│   ├── app-context.tsx          # App state management
│   └── utils.ts                 # General utilities
│
├── midnight/                     # Midnight ZK proofs
│   ├── proof.ts                 # Frontend proof generation
│   ├── contract.ts              # Backend proof generation
│   ├── test-proof.ts            # Proof testing
│   └── proof_samples/           # Example proofs
│
├── public/                       # Static assets
├── styles/                       # Additional styles
├── hooks/                        # React hooks
│
├── .env.local                    # Frontend environment variables
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Frontend dependencies
└── README.md                     # This file
```

---

## 🛠️ Development

### Development Workflow

1. **Backend Development:**
   ```bash
   cd backend
   npm run dev  # Start with nodemon (if configured)
   # OR
   npm start    # Start normally
   ```

2. **Frontend Development:**
   ```bash
   npm run dev  # Start Next.js dev server
   ```

3. **Build for Production:**
   ```bash
   # Frontend
   npm run build
   npm start
   
   # Backend
   cd backend
   npm start
   ```

### Code Structure

- **Components:** React functional components with TypeScript
- **State Management:** React Context API
- **Styling:** Tailwind CSS with custom theme
- **Animations:** Framer Motion
- **Type Safety:** TypeScript throughout

### Adding New Features

1. **New API Endpoint:**
   - Add route in `backend/routes/`
   - Add handler in `backend/controllers/`
   - Update `backend/server.js`

2. **New Screen:**
   - Create component in `components/screens/`
   - Add route in `app/page.tsx`
   - Update navigation

3. **New Wallet Support:**
   - Update `lib/wallet/cardano-wallet-context.tsx`
   - Add wallet detection logic
   - Update `components/screens/connect-wallet-screen.tsx`

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

Or test endpoints manually:

```bash
# Test invoice creation
curl -X POST http://localhost:3333/issue-request \
  -H "Content-Type: application/json" \
  -d '{
    "recipientDID": "did:test:user",
    "recipientAddress": "addr1...",
    "amount": "500000000",
    "description": "Test payment",
    "issuer": "MetaMesh"
  }'
```

### Frontend Testing

1. **Manual Testing:**
   - Open `http://localhost:3000`
   - Test wallet connection
   - Test invoice creation
   - Test payment flow

2. **Test Mint Page:**
   - Navigate to `http://localhost:3000/test-mint`
   - Test NFT minting functionality

### Integration Testing

1. Start both backend and frontend
2. Connect wallet
3. Create invoice via chat
4. Pay invoice
5. Verify receipt NFT appears
6. Check transaction on explorer

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Wallet Connection Fails

**Problem:** Wallet doesn't connect or shows error.

**Solutions:**
- Ensure wallet extension is installed and unlocked
- Check that wallet is set to Preprod or Mainnet
- Refresh the page and try again
- Check browser console for errors

#### 2. Backend Not Starting

**Problem:** Backend server fails to start.

**Solutions:**
- Check if port 3333 is already in use
- Verify Node.js version (18+)
- Check `backend/package.json` dependencies
- Review error messages in terminal

#### 3. Frontend Build Errors

**Problem:** Next.js build or dev server errors.

**Solutions:**
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`
- Verify environment variables in `.env.local`

#### 4. Transaction Fails

**Problem:** Cardano transaction submission fails.

**Solutions:**
- Ensure wallet has sufficient ADA for fees
- Check network matches (Preprod vs Mainnet)
- Verify Koios API is accessible
- Check transaction in wallet for details

#### 5. IPFS Metadata Not Loading

**Problem:** Metadata URI doesn't resolve.

**Solutions:**
- Check if `NFT_STORAGE_API_KEY` is set (optional)
- System uses fallback for demo - this is normal
- Verify metadata structure in backend logs

### Debug Mode

Enable verbose logging:

**Backend:**
```javascript
// Add to server.js
console.log('Debug:', data);
```

**Frontend:**
```typescript
// Check browser console
console.log('Debug:', data);
```

### Getting Help

1. Check existing documentation files:
   - `GETTING-STARTED.md`
   - `TROUBLESHOOTING.md`
   - `DEMO-SCRIPT.md`

2. Review error messages in:
   - Browser console (F12)
   - Terminal/command prompt
   - Network tab (for API calls)

---

## 🎬 Demo Script

For hackathon judges or demonstrations:

### Quick Demo (2-3 minutes)

1. **Introduction (30s)**
   - "MetaMesh converts chat messages into Cardano payments"

2. **Connect Wallet (30s)**
   - Show wallet connection screen
   - Connect Lace/Eternl wallet

3. **Request Payment (1min)**
   - Type: "Request ₹500 for logo design"
   - Show invoice bubble appearing

4. **Pay Invoice (1min)**
   - Click "Pay" button
   - Show wallet popup
   - Sign transaction
   - Show receipt NFT bubble

5. **View Receipt (30s)**
   - Click receipt bubble
   - Show NFT details
   - Open Cardano explorer link

### Full Demo Script

See `DEMO-SCRIPT.md` for complete demonstration guide.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Cardano Foundation** - For the Cardano blockchain
- **Lucid** - For the Cardano SDK
- **Koios** - For the public Cardano API
- **Midnight** - For ZK proof technology
- **Next.js Team** - For the amazing framework
- **shadcn/ui** - For beautiful UI components

---

## 📞 Support & Contact

- **Documentation:** See `GETTING-STARTED.md` for detailed setup
- **Issues:** Check `TROUBLESHOOTING.md` for common problems
- **Demo:** See `DEMO-SCRIPT.md` for demonstration guide

---

## 🚀 Roadmap

### Phase 2 ✅ (Complete)
- Backend API with IPFS
- Cardano NFT minting
- Midnight proof integration
- Basic chat interface

### Phase 3 ✅ (Complete)
- Chat-based invoice generation
- Payment flow integration
- Receipt NFT display
- Wallet connection UI

### Future Phases
- [ ] Multi-chain support
- [ ] Advanced Midnight contracts
- [ ] Mobile app
- [ ] Decentralized identity (DID)
- [ ] Group payments
- [ ] Payment scheduling

---

**Built with ❤️ for the Cardano ecosystem**

---

*Last Updated: November 2025*
