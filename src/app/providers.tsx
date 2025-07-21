'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { Toaster } from '@/components/ui/toaster';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Configuration Required</h2>
          <p className="text-gray-600 mb-4">
            Please set up your WalletConnect Project ID to use this app.
          </p>
          <div className="text-sm text-gray-500">
            <p>1. Visit <a href="https://cloud.walletconnect.com" className="text-blue-500 underline">cloud.walletconnect.com</a></p>
            <p>2. Create a project and get your Project ID</p>
            <p>3. Add it to .env.local as NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}