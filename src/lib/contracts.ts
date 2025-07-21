// Contract ABIs for the prediction market
export const PREDICTION_MARKET_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {"name": "_token", "type": "address", "internalType": "address"},
      {"name": "_owner", "type": "address", "internalType": "address"}
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "buyShares",
    "inputs": [
      {"name": "_marketId", "type": "uint256", "internalType": "uint256"},
      {"name": "_isOptionA", "type": "bool", "internalType": "bool"},
      {"name": "_amount", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimRewards",
    "inputs": [
      {"name": "_marketId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createMarket",
    "inputs": [
      {"name": "_question", "type": "string", "internalType": "string"},
      {"name": "_optionA", "type": "string", "internalType": "string"},
      {"name": "_optionB", "type": "string", "internalType": "string"},
      {"name": "_duration", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getMarketInfo",
    "inputs": [
      {"name": "_marketId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [
      {"name": "question", "type": "string", "internalType": "string"},
      {"name": "optionA", "type": "string", "internalType": "string"},
      {"name": "optionB", "type": "string", "internalType": "string"},
      {"name": "endTime", "type": "uint256", "internalType": "uint256"},
      {"name": "outcome", "type": "uint8", "internalType": "uint8"},
      {"name": "totalOptionAShares", "type": "uint256", "internalType": "uint256"},
      {"name": "totalOptionBShares", "type": "uint256", "internalType": "uint256"},
      {"name": "resolved", "type": "bool", "internalType": "bool"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSharesBalance",
    "inputs": [
      {"name": "_marketId", "type": "uint256", "internalType": "uint256"},
      {"name": "_user", "type": "address", "internalType": "address"}
    ],
    "outputs": [
      {"name": "optionAShares", "type": "uint256", "internalType": "uint256"},
      {"name": "optionBShares", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "marketCount",
    "inputs": [],
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "resolveMarket",
    "inputs": [
      {"name": "_marketId", "type": "uint256", "internalType": "uint256"},
      {"name": "_outcome", "type": "uint8", "internalType": "enum PredictionMarket.MarketOutcome"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {"name": "", "type": "address", "internalType": "address"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "MarketCreated",
    "inputs": [
      {"name": "marketId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "question", "type": "string", "indexed": false, "internalType": "string"},
      {"name": "optionA", "type": "string", "indexed": false, "internalType": "string"},
      {"name": "optionB", "type": "string", "indexed": false, "internalType": "string"},
      {"name": "endTime", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SharesPurchased",
    "inputs": [
      {"name": "marketId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "user", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "isOptionA", "type": "bool", "indexed": false, "internalType": "bool"},
      {"name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256"},
      {"name": "shares", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  }
] as const;

export const ERC20_ABI = [
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {"name": "owner", "type": "address", "internalType": "address"},
      {"name": "spender", "type": "address", "internalType": "address"}
    ],
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {"name": "spender", "type": "address", "internalType": "address"},
      {"name": "amount", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [
      {"name": "", "type": "bool", "internalType": "bool"}
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {"name": "account", "type": "address", "internalType": "address"}
    ],
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      {"name": "", "type": "uint8", "internalType": "uint8"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mint",
    "inputs": [
      {"name": "to", "type": "address", "internalType": "address"},
      {"name": "amount", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {"name": "", "type": "string", "internalType": "string"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {"name": "", "type": "string", "internalType": "string"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {"name": "to", "type": "address", "internalType": "address"},
      {"name": "amount", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [
      {"name": "", "type": "bool", "internalType": "bool"}
    ],
    "stateMutability": "nonpayable"
  }
] as const;