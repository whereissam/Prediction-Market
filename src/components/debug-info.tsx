import { useAccount, useReadContract } from "wagmi";
import { PREDICTION_MARKET_ADDRESS, PREDICT_TOKEN_ADDRESS } from "@/lib/wagmi";
import { PREDICTION_MARKET_ABI, ERC20_ABI } from "@/lib/contracts";
import { formatEther } from "viem";

export function DebugInfo() {
  const { address, isConnected, chain } = useAccount();
  
  const { data: marketCount, isLoading, error } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: "marketCount",
  });

  const { data: tokenBalance } = useReadContract({
    address: PREDICT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const { data: tokenDecimals } = useReadContract({
    address: PREDICT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const { data: allowance } = useReadContract({
    address: PREDICT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address as `0x${string}`, PREDICTION_MARKET_ADDRESS],
    query: {
      enabled: !!address,
    },
  });

  return (
    <div className="bg-muted/50 p-4 rounded-lg text-sm mb-4 border" style={{boxShadow: 'var(--shadow-xs)', fontFamily: 'var(--font-mono)'}}>
      <h3 className="font-bold mb-2 text-foreground" style={{fontFamily: 'var(--font-sans)', letterSpacing: 'var(--tracking-normal)'}}>Debug Info:</h3>
      <div className="text-muted-foreground space-y-1" style={{letterSpacing: 'var(--tracking-normal)'}}>
        <div>Connected: <span className="text-foreground">{isConnected ? 'Yes' : 'No'}</span></div>
        <div>Address: <span className="text-foreground font-mono text-xs">{address || 'None'}</span></div>
        <div>Chain: <span className="text-foreground">{chain?.name || 'None'} (ID: {chain?.id})</span></div>
        <div>Contract: <span className="text-foreground font-mono text-xs">{PREDICTION_MARKET_ADDRESS}</span></div>
        <div>Token: <span className="text-foreground font-mono text-xs">{PREDICT_TOKEN_ADDRESS}</span></div>
        <div>Market Count Loading: <span className="text-foreground">{isLoading ? 'Yes' : 'No'}</span></div>
        <div>Market Count: <span className="text-foreground">{marketCount?.toString() || 'undefined'}</span></div>
        <div>Token Decimals: <span className="text-foreground">{tokenDecimals?.toString() || 'undefined'}</span></div>
        <div>Token Balance: <span className="text-foreground">{tokenBalance ? formatEther(tokenBalance) : 'undefined'} PREDICT</span></div>
        <div>Allowance: <span className="text-foreground">{allowance ? formatEther(allowance) : 'undefined'} PREDICT</span></div>
        <div>Error: <span className="text-foreground">{error?.message || 'None'}</span></div>
      </div>
    </div>
  );
}