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
    <div className="bg-gray-100 p-4 rounded-lg text-sm mb-4">
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
      <div>Address: {address || 'None'}</div>
      <div>Chain: {chain?.name || 'None'} (ID: {chain?.id})</div>
      <div>Contract: {PREDICTION_MARKET_ADDRESS}</div>
      <div>Token: {PREDICT_TOKEN_ADDRESS}</div>
      <div>Market Count Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Market Count: {marketCount?.toString() || 'undefined'}</div>
      <div>Token Decimals: {tokenDecimals?.toString() || 'undefined'}</div>
      <div>Token Balance: {tokenBalance ? formatEther(tokenBalance) : 'undefined'} PREDICT</div>
      <div>Allowance: {allowance ? formatEther(allowance) : 'undefined'} PREDICT</div>
      <div>Error: {error?.message || 'None'}</div>
    </div>
  );
}