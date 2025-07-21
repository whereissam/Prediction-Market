import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';
import { http, fallback } from 'wagmi';

// Only create config if we have a valid project ID
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const config = projectId ? getDefaultConfig({
  appName: 'Prediction Market',
  projectId,
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: fallback([
      http('https://sepolia.base.org', {
        retryCount: 2,
        retryDelay: 1000,
      }),
      http('https://base-sepolia-rpc.publicnode.com', {
        retryCount: 2, 
        retryDelay: 1500,
      }),
      http('https://base-sepolia.blockpi.network/v1/rpc/public', {
        retryCount: 1,
        retryDelay: 2000,
      }),
    ])
  },
  ssr: true,
}) : null;

export const PREDICTION_MARKET_ADDRESS = '0x553c346d69052e97255ee77f1ae96d857fb42db9' as const;
export const PREDICT_TOKEN_ADDRESS = '0x463aa55bb41e2c63515d59fb7ea44085db21de77' as const;