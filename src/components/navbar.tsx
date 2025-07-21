import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { parseEther } from "viem";
import { PREDICT_TOKEN_ADDRESS } from "@/lib/wagmi";
import { ERC20_ABI } from "@/lib/contracts";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function Navbar() {
  const { address: account } = useAccount();
  const { writeContract } = useWriteContract();
  const { toast } = useToast();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimTokens = async () => {
    if (!account) return;
    
    setIsClaiming(true);
    try {
      // This will only work if you're the contract owner
      writeContract({
        address: PREDICT_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "mint",
        args: [account, parseEther("100")],
      });

      toast({
        title: "Tokens Claimed!",
        description: "100 PREDICT tokens have been sent to your wallet",
        duration: 5000,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Claim Failed",
        description: "Only the contract owner can mint tokens. Get tokens from the owner or a DEX.",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        🔮 Prediction Market
      </h1>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {account && (
          <Button
            onClick={handleClaimTokens}
            disabled={isClaiming}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            {isClaiming ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                <span className="hidden xs:inline">Claiming...</span>
                <span className="xs:hidden">...</span>
              </>
            ) : (
              <>
                <span className="hidden xs:inline">Get Tokens</span>
                <span className="xs:hidden">Tokens</span>
              </>
            )}
          </Button>
        )}
        <div className="flex-shrink-0">
          <ConnectButton
            chainStatus="icon"
            accountStatus="avatar"
            showBalance={false}
          />
        </div>
      </div>
    </div>
  );
}