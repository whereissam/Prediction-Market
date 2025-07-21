import { useAccount, useReadContract } from "wagmi";
import { PREDICT_TOKEN_ADDRESS } from "@/lib/wagmi";
import { ERC20_ABI } from "@/lib/contracts";
import { formatEther } from "viem";

export function TokenBalance() {
  const { address: account } = useAccount();

  const { data: balance } = useReadContract({
    address: PREDICT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: account ? [account as `0x${string}`] : undefined,
    query: {
      enabled: !!account,
    },
  });

  if (!account || !balance) return null;

  const formattedBalance = parseFloat(formatEther(balance)).toFixed(2);

  return (
    <div className="text-sm text-muted-foreground mb-4">
      Your PREDICT balance: <span className="font-semibold text-foreground">{formattedBalance}</span>
      {parseFloat(formattedBalance) === 0 && (
        <span className="text-destructive ml-2">
          (You need tokens to trade! Click "Get Tokens")
        </span>
      )}
    </div>
  );
}