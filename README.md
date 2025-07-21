# 🔮 Prediction Market DApp

A decentralized prediction market platform built on Base Sepolia testnet, allowing users to create markets, buy prediction shares, and claim rewards based on outcomes.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Market Resolution System](#market-resolution-system)
- [Frontend Features](#frontend-features)
- [Troubleshooting](#troubleshooting)
- [Contract Addresses](#contract-addresses)
- [FAQ](#faq)

## 🎯 Overview

This prediction market allows users to:
- **Create Markets**: Set up prediction questions with two options and expiration times
- **Buy Shares**: Purchase shares for Option A or Option B using PREDICT tokens
- **Resolve Markets**: Contract owners can resolve expired markets by choosing the winning outcome
- **Claim Rewards**: Winners receive proportional rewards from the losing side's tokens

## 🏗️ Architecture

### Smart Contracts
- **PredictionMarket.sol**: Main contract handling market creation, share purchases, and resolution
- **PredictToken.sol**: ERC20 token used for all transactions
- **Ownable Pattern**: Only contract owner can create and resolve markets

### Frontend Stack
- **Next.js 15**: React framework with App Router
- **Wagmi v2**: Ethereum interactions
- **RainbowKit**: Wallet connection
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

### Blockchain
- **Network**: Base Sepolia Testnet (Chain ID: 84532)
- **RPC Endpoints**: Multiple fallback endpoints for reliability
- **Block Explorer**: https://sepolia.basescan.org/

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- Wallet with Base Sepolia ETH
- WalletConnect Project ID

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/prediction-market
cd prediction-market

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
```

### Environment Variables
```env
# Required for wallet connection
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Optional - for contract deployment
PRIVATE_KEY=your_private_key_without_0x
BASESCAN_API_KEY=your_basescan_api_key
```

### Development
```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

### Getting Test Tokens
1. **Get Base Sepolia ETH**: Use Base faucet
2. **Get PREDICT Tokens**: Click "Get Tokens" button (owner only) or ask owner to send you some

## ⚖️ Market Resolution System

### Understanding Market States

#### 1. **Active Markets** 🟢
- Current time < market.endTime
- Users can buy shares for Option A or Option B
- Shows countdown timer

#### 2. **Expired Markets** 🟡
- Current time > market.endTime
- No new shares can be purchased
- **Awaiting owner resolution**

#### 3. **Resolved Markets** ✅
- Owner has chosen winning outcome
- Users can claim rewards
- Final results displayed

### Resolution Process

#### For Contract Owners:
1. **Connect owner wallet** (`0x683c2b9fbaedc26522f446e42bec896666390ec4`)
2. **Crown icon appears** in navbar showing owner status
3. **Orange resolution cards** appear on expired markets
4. **Click "Option A Wins" or "Option B Wins"**
5. **Confirm transaction** in wallet
6. **Market automatically updates** to resolved state

#### What Happens During Resolution:
```solidity
// Contract updates:
market.outcome = chosenOutcome;  // 1 for Option A, 2 for Option B  
market.resolved = true;          // Marks as resolved
emit MarketResolved(marketId, outcome);
```

#### Frontend Changes:
- ❌ Resolution buttons disappear
- ✅ "Resolved" badge appears
- 💰 "Claim Rewards" buttons appear for winners
- 📊 Final statistics displayed

### Reward Calculation

**Formula**: `yourReward = (yourWinningShares / totalWinningShares) * totalLosingTokens`

**Example**:
- You own: 20 Option A shares
- Total Option A: 100 shares (winners)
- Total Option B: 50 shares (losers)
- Your reward: (20/100) * 50 = **10 PREDICT tokens**
- Total return: 20 original + 10 reward = **30 PREDICT** (50% ROI!)

## 🎨 Frontend Features

### Enhanced Transaction Experience
- **Real-time feedback**: ⏳ Submitting → 🔄 Processing → 🎉 Success
- **Auto data refresh**: Balances and shares update automatically
- **Error handling**: Clear error messages for failed transactions
- **Loading states**: Visual feedback during all operations

### Owner-Only Features
- **Crown badge**: Shows when connected as contract owner
- **Resolution interface**: Orange cards on expired markets
- **Market creation**: Can create new prediction markets
- **Token minting**: Can mint PREDICT tokens for distribution

### User Features
- **Market browsing**: Filter by Active/Pending/Resolved
- **Share purchasing**: Multi-step approval flow
- **Reward claiming**: One-click reward claiming for resolved markets
- **Portfolio tracking**: See your shares across all markets

## 🔧 Troubleshooting

### Common Issues

#### "Cannot read properties of undefined (reading 'call')"
**Cause**: Frontend trying to call contract functions before wallet connection
**Solution**: ✅ Fixed - Added proper wallet connection checks

#### "Execution reverted for an unknown reason" 
**Cause**: Wrong outcome values sent to contract
**Solution**: ✅ Fixed - Frontend now converts values correctly:
- Frontend sends: 0, 1
- Contract receives: 1, 2 (OPTION_A, OPTION_B)

#### "Request is being rate limited"
**Cause**: RPC endpoint rate limiting
**Solution**: ✅ Fixed - Multiple fallback RPCs with retry logic:
- Primary: https://sepolia.base.org
- Fallback: https://base-sepolia-rpc.publicnode.com
- Fallback: https://base-sepolia.blockpi.network/v1/rpc/public

#### Wallet Shows "Pending" but Frontend Shows "Finished"
**Cause**: Different RPC sync speeds and confirmation requirements
**Solutions**:
1. Wait 1-2 minutes for wallet to sync
2. Check transaction on block explorer: https://sepolia.basescan.org/
3. Refresh wallet or disconnect/reconnect

#### "Only the contract owner can mint tokens"
**Cause**: Non-owner trying to use "Get Tokens" button
**Solution**: 
- Ask contract owner to send you PREDICT tokens
- Or get them from a DEX/exchange
- Owner address: `0x683c2b9fbaedc26522f446e42bec896666390ec4`

### Transaction Failures

#### Resolution Fails
**Check**:
1. Are you the contract owner?
2. Is the market expired?
3. Is the market already resolved?
4. Are you using the correct outcome values (1 or 2)?

#### Share Purchase Fails
**Check**:
1. Do you have enough PREDICT tokens?
2. Have you approved the contract to spend your tokens?
3. Is the market still active (not expired)?

## 📝 Contract Addresses

### Base Sepolia Testnet
```
PredictionMarket: 0x553c346d69052e97255ee77f1ae96d857fb42db9
PredictToken:     0x463aa55bb41e2c63515d59fb7ea44085db21de77
Contract Owner:   0x683c2b9fbaedc26522f446e42bec896666390ec4
```

### Block Explorer Links
- [PredictionMarket Contract](https://sepolia.basescan.org/address/0x553c346d69052e97255ee77f1ae96d857fb42db9)
- [PredictToken Contract](https://sepolia.basescan.org/address/0x463aa55bb41e2c63515d59fb7ea44085db21de77)

## ❓ FAQ

### Market Resolution

**Q: Do markets resolve automatically when they expire?**
A: **No**, markets need manual resolution by the contract owner. This prevents oracle problems and gives owner control over outcomes.

**Q: When will my expired markets be resolved?**  
A: Expired markets are resolved when the contract owner manually chooses the winning outcome. Current expired markets waiting for resolution:
- Market 0 (5min) - Expired 1h+ ago
- Market 1 (10min) - Expired 1h+ ago  
- Market 2 (30min) - Expired 1h+ ago
- Market 3 (1hour) - Expired recently
- Market 4 (2hour) - Expiring soon

**Q: How do I know if I won?**
A: After resolution, winning markets show "Claim Rewards" button. Losing markets show "No rewards to claim."

### Technical Questions

**Q: Why does my wallet show different status than the frontend?**
A: Different RPC endpoints and confirmation requirements. The frontend uses faster RPCs while wallets may wait for more confirmations.

**Q: What happens during market resolution?**
A: The contract owner chooses the winning outcome, which:
1. Sets `market.outcome` to the winning option
2. Sets `market.resolved = true`  
3. Emits a `MarketResolved` event
4. Enables reward claiming for winners
5. Frontend updates automatically

**Q: How are rewards calculated?**
A: Winners split the losing side's tokens proportionally:
`reward = (yourShares / totalWinningShares) * totalLosingTokens`

**Q: Can I resolve markets if I'm not the owner?**  
A: No, only the contract owner can resolve markets. This ensures fair and controlled resolution.

### Usage Questions

**Q: How do I get PREDICT tokens?**
A: 
- Click "Get Tokens" if you're the owner
- Ask the owner to send you tokens
- Trade for them on a DEX (if available)

**Q: What happens to my tokens if I lose?**
A: Losing shares become worthless, and your tokens go to the winners as rewards.

**Q: Can I sell my shares before resolution?**
A: No, the current version doesn't support secondary markets. You hold shares until resolution.

**Q: What networks are supported?**
A: Currently only Base Sepolia testnet. Mainnet deployment would need additional testing and audits.

## 🛠️ Development

### Smart Contract Development
```bash
cd contracts
forge build
forge test
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
```

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
```

## 📊 Current Market Status

**Deployed Markets** (as of deployment):
- 10 test markets with various durations (5min to 30 days)
- 5 markets currently expired and awaiting resolution
- Topics include: ETH price, BTC direction, NBA games, Apple stock, weather, etc.

**Next Steps**:
1. Resolve expired markets to test full cycle
2. Users can then claim rewards
3. Create new markets for ongoing testing

## 🔐 Security Notes

- Contracts use OpenZeppelin's battle-tested patterns
- Owner-only functions prevent unauthorized access
- ReentrancyGuard prevents reentrancy attacks
- All token transfers use safe transfer methods
- Testnet only - not audited for mainnet use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📜 License

MIT License - see LICENSE file for details

---

**Built with ❤️ on Base** 🔵