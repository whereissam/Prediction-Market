# 🏗️ Prediction Market Smart Contracts

This directory contains the Solidity smart contracts for the Prediction Market DApp built with **Foundry**.

## 📋 Contract Overview

### **PredictionMarket.sol**
- Main contract for creating and managing prediction markets
- Handles market creation, share buying, resolution, and rewards
- Integrates with the PREDICT token for payments

### **PredictToken.sol** 
- ERC20 utility token for the prediction market
- Used as payment currency for buying shares
- Mintable by contract owner for testing/distribution

## 🔧 Prerequisites

1. **Install Foundry**:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Get Base Sepolia ETH**:
   - Visit [Base Sepolia Bridge](https://bridge.base.org/)
   - Get testnet ETH for deployment gas fees

3. **Get BaseScan API Key** (optional, for verification):
   - Visit [BaseScan](https://basescan.org/apis)
   - Create account and get API key

## ⚙️ Environment Setup

Create `.env` file in the contracts directory:

```bash
# Required for deployment
PRIVATE_KEY=0x_your_wallet_private_key_here

# Optional - for contract verification on BaseScan
BASESCAN_API_KEY=your_basescan_api_key_here
```

**⚠️ Security Warning**: Never commit your private key to version control!

## 🏗️ Development Workflow

### **1. Build Contracts**
Compile all smart contracts:
```bash
forge build
```

### **2. Run Tests**
Execute the full test suite:
```bash
forge test
```

Run tests with detailed output:
```bash
forge test -vvv
```

### **3. Code Formatting**
Format all Solidity code:
```bash
forge fmt
```

### **4. Gas Analysis**
Generate gas usage snapshots:
```bash
forge snapshot
```

## 🚀 Deployment Process

### **Step 1: Prepare for Deployment**

1. **Check your wallet balance**:
   ```bash
   cast balance 0xYourWalletAddress --rpc-url https://sepolia.base.org
   ```

2. **Verify contract compilation**:
   ```bash
   forge build
   ```

### **Step 2: Deploy to Base Sepolia Testnet**

**Option A: Deploy with Verification**
```bash
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast --verify --etherscan-api-key $BASESCAN_API_KEY
```

**Option B: Deploy without Verification**
```bash
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast
```

### **Step 3: Verify Deployment**

The deployment script will output:
```
=== Deployment Summary ===
PredictToken: 0x463aA55Bb41E2c63515d59Fb7eA44085DB21DE77
PredictionMarket: 0x553c346d69052e97255ee77F1Ae96d857fB42DB9

Update your frontend constants/contract.ts file:
export const contractAddress = "0x553c346d69052e97255ee77F1Ae96d857fB42DB9";
export const tokenAddress = "0x463aA55Bb41E2c63515d59Fb7eA44085DB21DE77";
```

### **Step 4: Update Frontend**

Update the contract addresses in your frontend:

1. **Update `src/lib/wagmi.ts`**:
   ```typescript
   export const PREDICTION_MARKET_ADDRESS = '0xYourDeployedMarketAddress' as const;
   export const PREDICT_TOKEN_ADDRESS = '0xYourDeployedTokenAddress' as const;
   ```

2. **Update `src/constants/contract.ts`**:
   ```typescript
   export const contractAddress = "0xYourDeployedMarketAddress" as const;
   export const tokenAddress = "0xYourDeployedTokenAddress" as const;
   ```

## 🧪 Testing and Verification

### **1. Local Testing with Anvil**

Start local blockchain:
```bash
anvil
```

Deploy to local network:
```bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

### **2. Interact with Deployed Contracts**

**Check token balance**:
```bash
cast call 0xYourTokenAddress "balanceOf(address)" 0xYourWalletAddress --rpc-url https://sepolia.base.org
```

**Check market count**:
```bash
cast call 0xYourMarketAddress "marketCount()" --rpc-url https://sepolia.base.org
```

**Get market info**:
```bash
cast call 0xYourMarketAddress "getMarketInfo(uint256)" 0 --rpc-url https://sepolia.base.org
```

### **3. Manual Contract Verification**

If automatic verification fails:

1. Visit [BaseScan Contract Verification](https://sepolia.basescan.org/verifyContract)
2. Select "Solidity (Single File)"
3. Upload flattened contract code:
   ```bash
   forge flatten src/PredictionMarket.sol > PredictionMarket_flattened.sol
   ```

## 📊 Contract Functions Reference

### **PredictionMarket Contract**

| Function | Description | Access |
|----------|-------------|---------|
| `createMarket()` | Create new prediction market | Owner only |
| `buyShares()` | Purchase shares for an outcome | Anyone |
| `resolveMarket()` | Set winning outcome | Owner only |
| `claimRewards()` | Claim winnings from resolved market | Anyone |
| `getMarketInfo()` | Get market details | View |
| `getSharesBalance()` | Get user's share balance | View |

### **PredictToken Contract**

| Function | Description | Access |
|----------|-------------|---------|
| `mint()` | Mint new tokens | Owner only |
| `burn()` | Burn your tokens | Anyone |
| `transfer()` | Transfer tokens | Anyone |
| `approve()` | Approve spending | Anyone |

## 🔍 Common Issues & Solutions

### **Deployment Fails**
- **Check gas balance**: Ensure you have enough Base Sepolia ETH
- **Check private key format**: Must start with `0x`
- **Verify RPC URL**: Use `https://sepolia.base.org`

### **Verification Fails**
- **Check API key**: Ensure BaseScan API key is correct
- **Manual verification**: Use BaseScan web interface
- **Flattened contract**: Use `forge flatten` for complex contracts

### **Frontend Can't Connect**
- **Update addresses**: Ensure frontend has correct contract addresses
- **Check network**: Frontend must be on Base Sepolia (Chain ID: 84532)
- **RPC issues**: Verify blockchain connection

## 🛠️ Advanced Usage

### **Custom RPC Endpoints**
```bash
# Using Alchemy
--rpc-url https://base-sepolia.g.alchemy.com/v2/your-api-key

# Using Infura  
--rpc-url https://base-sepolia.infura.io/v3/your-project-id
```

### **Gas Optimization**
```bash
# Analyze gas usage
forge test --gas-report

# Optimize deployments
forge script script/Deploy.s.sol --optimize --optimizer-runs 200
```

### **Debugging Transactions**
```bash
# Debug failed transaction
cast run 0xTransactionHash --rpc-url https://sepolia.base.org

# Simulate transaction
cast call 0xContractAddress "functionName()" --rpc-url https://sepolia.base.org
```

## 📚 Additional Resources

- [Foundry Documentation](https://book.getfoundry.sh/)
- [Base Network Docs](https://docs.base.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🔗 Useful Links

- **Base Sepolia Explorer**: https://sepolia.basescan.org/
- **Base Sepolia Bridge**: https://bridge.base.org/
- **Base Faucet**: https://coinbase.com/faucets/base-ethereum-sepolia-faucet
- **Chain Details**: 
  - Network Name: Base Sepolia
  - RPC URL: https://sepolia.base.org
  - Chain ID: 84532
  - Symbol: ETH

---

Built with ❤️ using Foundry and deployed on Base Sepolia testnet.
