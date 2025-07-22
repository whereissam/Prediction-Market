import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { parseEther } from "viem";
import { PREDICT_TOKEN_ADDRESS } from "@/lib/wagmi";
import { ERC20_ABI } from "@/lib/contracts";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { OwnerInfo } from "./owner-info";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { address: account } = useAccount();
  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isClaiming, setIsClaiming] = useState(false);

  // Transaction receipt monitoring
  const { data: receipt, isLoading: isWaitingForReceipt, error: receiptError } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
    query: {
      enabled: !!hash && !!account,
    },
  });

  // Handle transaction success/failure
  useEffect(() => {
    if (receipt && receipt.status === 'success') {
      toast({
        title: "Tokens Claimed Successfully! 🎉",
        description: `100 PREDICT tokens sent to your wallet. Hash: ${receipt.transactionHash.slice(0, 10)}...`,
        duration: 5000,
      });
      
      // Refresh token balance
      queryClient.invalidateQueries({ queryKey: ['readContract'] });
      setIsClaiming(false);
    } else if (receipt && receipt.status === 'reverted') {
      toast({
        title: "Transaction Failed ❌",
        description: "Token claim was reverted. You may not have permission.",
        variant: "destructive",
        duration: 5000,
      });
      setIsClaiming(false);
    } else if (receiptError) {
      toast({
        title: "Transaction Error ❌",
        description: receiptError.message || "Error processing token claim",
        variant: "destructive",
        duration: 5000,
      });
      setIsClaiming(false);
    }
  }, [receipt, receiptError, toast, queryClient]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      toast({
        title: "Claim Failed ❌",
        description: "Only the contract owner can mint tokens. Get tokens from the owner or a DEX.",
        variant: "destructive",
        duration: 5000,
      });
      setIsClaiming(false);
    }
  }, [writeError, toast]);

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
        title: "Token Claim Submitted ⏳",
        description: "Please confirm the transaction in your wallet...",
        duration: 3000,
      });
    } catch (error: any) {
      console.error(error);
      setIsClaiming(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground" style={{fontFamily: 'var(--font-serif)', letterSpacing: 'var(--tracking-tight)'}}>
        🔮 Prediction Market
      </h1>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <OwnerInfo />
        {account && (
          <Button
            onClick={handleClaimTokens}
            disabled={isClaiming || isWaitingForReceipt}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            {(isClaiming || isWaitingForReceipt) ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                <span className="hidden xs:inline">{isWaitingForReceipt ? 'Processing...' : 'Claiming...'}</span>
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
        <ThemeToggle />
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