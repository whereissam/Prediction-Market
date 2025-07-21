# 🔮 Prediction Market DApp

A decentralized prediction market built with Next.js, TypeScript, and Solidity smart contracts on Base Sepolia testnet.

![Prediction Market Banner](https://images.unsplash.com/photo-1570304815928-ef0771059599?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## ✨ Features

- **Create Markets**: Administrators can create prediction markets with custom questions and options
- **Buy Shares**: Users can purchase shares for either outcome using PREDICT tokens  
- **Real-time Updates**: Live market data with share counts and percentages
- **Multi-wallet Support**: Connect with MetaMask, Coinbase Wallet, Rainbow, and more
- **Social Login**: Sign in with Google, Telegram, Email, or X (Twitter)
- **Token Faucet**: Claim free PREDICT tokens for testing
- **Market Resolution**: Automatic reward distribution when markets resolve
- **Responsive Design**: Beautiful UI that works on all devices

## 🏗️ Architecture

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives  
- **RainbowKit + Wagmi** - Modern Web3 connection toolkit
- **Lucide React** - Beautiful icons

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Secure contract libraries
- **Foundry** - Development and deployment toolkit

### Blockchain
- **Base Sepolia** - Ethereum L2 testnet
- **PREDICT Token** - ERC20 utility token
- **Account Abstraction** - Gasless transactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/prediction-market.git
cd prediction-market
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup

Create a `.env.local` file:

```env
# RainbowKit Configuration (Required)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here

# Backend Configuration for Token Claiming (Optional - only if you want the claim tokens feature)
BACKEND_WALLET_ADDRESS=your_backend_wallet_address_here
ENGINE_URL=https://your-engine-url.com
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🎯 Backend Requirements (Optional)

The prediction market works fully **without a backend**! Users can:
- Connect their wallets using RainbowKit
- Buy/sell prediction market shares directly on-chain
- Claim rewards from resolved markets

### Token Claiming Feature (Optional)

The "Claim Tokens" button in the navbar requires a backend API endpoint. If you want this feature:

1. **Keep the backend configuration** in `.env.local`
2. **Implement the API endpoint** at `src/app/api/claimToken/route.ts`
3. **Set up Thirdweb Engine** for gasless token distribution

If you **don't need the claim tokens feature**:

1. **Remove the backend configuration** from `.env.local`  
2. **Remove the claim button** from `src/components/navbar.tsx`
3. Users can get tokens through other means (DEX, manual distribution, etc.)

## 📋 Smart Contract Deployment (Foundry)

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Configure Environment

Create `contracts/.env`:

```env
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
BASESCAN_API_KEY=your_basescan_api_key_for_verification
```

### 3. Compile Contracts

```bash
cd contracts
forge build
```

### 4. Deploy to Base Sepolia

```bash
# Deploy contracts
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast --verify

# Or using environment variable
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
```

### 5. Update Frontend Configuration

After deployment, update `src/lib/wagmi.ts` with your deployed contract addresses:

```typescript
export const PREDICTION_MARKET_ADDRESS = "0xYourDeployedMarketAddress" as const;
export const PREDICT_TOKEN_ADDRESS = "0xYourDeployedTokenAddress" as const;
```

## 🔧 Configuration

### RainbowKit Setup

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Get your Project ID from the dashboard
4. Add it to your environment variables as `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

### Wallet Configuration

The app supports multiple wallet options through RainbowKit:

- **Popular Wallets**: MetaMask, Coinbase Wallet, Rainbow, WalletConnect
- **Hardware Wallets**: Ledger, Trezor
- **Mobile Wallets**: Trust Wallet, Argent, and many more

### Contract Addresses

Current testnet deployment:
- **Prediction Market**: `0x12334951a76c5139F87e799bb8b6d96AF5064BD1`
- **PREDICT Token**: `0xE1308d26B169C81cd1Aff9F32F1F735Bb64F10Af`

## 📚 How It Works

### Market Lifecycle

1. **Creation**: Admin creates market with question, two options, and duration
2. **Trading**: Users buy shares for either outcome using PREDICT tokens  
3. **Resolution**: After market ends, admin resolves with winning outcome
4. **Rewards**: Winning share holders claim proportional rewards

### Smart Contract Functions

**PredictionMarket.sol**:
- `createMarket()` - Create new prediction market
- `buyShares()` - Purchase shares for an outcome
- `resolveMarket()` - Set winning outcome (admin only)
- `claimRewards()` - Claim winnings from resolved market
- `getMarketInfo()` - Get market details
- `getSharesBalance()` - Get user's share balance

**PredictToken.sol**:
- Standard ERC20 with mint/burn functionality
- Used as payment token for market participation

## 🎮 Usage Guide

### For Users

1. **Connect Wallet**: Click "Sign In" and connect your preferred wallet
2. **Get Tokens**: Click "Claim Tokens" to receive 100 PREDICT tokens  
3. **Browse Markets**: View active, pending, and resolved markets
4. **Make Predictions**: Click on an option to buy shares
5. **Claim Rewards**: After resolution, claim your winnings

### For Administrators  

1. **Deploy Contracts**: Follow deployment guide above
2. **Create Markets**: Use `createMarket()` function
3. **Resolve Markets**: Call `resolveMarket()` after end time
4. **Manage Tokens**: Mint additional tokens if needed

## 🛠️ Development

### Project Structure

```
prediction-market/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   └── market-*.tsx   # Market-specific components
│   ├── constants/         # Contract addresses and config
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
├── contracts/            # Smart contracts
│   ├── PredictionMarket.sol
│   ├── PredictToken.sol
│   └── scripts/          # Deployment scripts
├── public/              # Static assets
└── config files
```

### Key Components

- `EnhancedPredictionMarketDashboard` - Main dashboard component
- `MarketCard` - Individual market display
- `MarketBuyInterface` - Share purchasing interface  
- `Navbar` - Header with wallet connection
- `Footer` - Footer component

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔐 Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Owner-only functions for market creation/resolution
- **Input Validation**: Comprehensive parameter validation
- **Emergency Functions**: Emergency withdrawal capability
- **Gasless Transactions**: Account abstraction for better UX

## 🧪 Testing

### Frontend Testing

```bash
# Run development server and test manually
npm run dev
```

### Contract Testing

```bash
cd contracts
forge test
```

### Testnet Testing

1. Get Base Sepolia ETH from [Base Sepolia Faucet](https://bridge.base.org/)  
2. Deploy contracts to testnet
3. Test all functionality with real transactions

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy automatically

### Contract Deployment

Follow the Smart Contract Deployment section above.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RainbowKit](https://rainbowkit.com) - Web3 wallet connection
- [Wagmi](https://wagmi.sh) - React hooks for Ethereum
- [Base](https://base.org) - Ethereum L2 platform  
- [OpenZeppelin](https://openzeppelin.com) - Secure smart contracts
- [Radix UI](https://radix-ui.com) - Accessible components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS

## 📞 Support

- Create an [Issue](https://github.com/yourusername/prediction-market/issues)
- Follow [@bungeegumeee](https://twitter.com/bungeegumeee) on Twitter
- Join our [Discord](https://discord.gg/prediction-market)

---

Built with ❤️ by [Sam](https://twitter.com/bungeegumeee)