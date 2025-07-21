import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Only create config if we have a valid project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const config = projectId ? getDefaultConfig({
  appName: 'Prediction Market',
  projectId,
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org')
  },
  ssr: true,
}) : null;

export const PREDICTION_MARKET_ADDRESS = '0x553c346d69052e97255ee77F1Ae96d857fB42DB9' as const;
export const PREDICT_TOKEN_ADDRESS = '0x463aA55Bb41E2c63515d59Fb7eA44085DB21DE77' as const;