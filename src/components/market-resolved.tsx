import { Button } from "./ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/contracts";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MarketResolvedProps {
    marketId: number;
    outcome: number;
    optionA: string;
    optionB: string;
}

export function MarketResolved({ 
    marketId,
    outcome, 
    optionA, 
    optionB
}: MarketResolvedProps) {
    const [isClaiming, setIsClaiming] = useState(false);
    const { writeContract, data: hash, error: writeError } = useWriteContract();
    const { data: receipt, isLoading: isConfirming, error: receiptError } = useWaitForTransactionReceipt({ 
        hash,
        query: {
            enabled: !!hash,
        },
    });
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Handle transaction success/failure
    useEffect(() => {
        if (receipt && receipt.status === 'success') {
            toast({
                title: "Rewards Claimed Successfully! 🎉",
                description: `Your rewards have been sent to your wallet. Hash: ${receipt.transactionHash.slice(0, 10)}...`,
                duration: 5000,
            });
            
            // Refresh data
            queryClient.invalidateQueries({ queryKey: ['readContract'] });
            setIsClaiming(false);
        } else if (receipt && receipt.status === 'reverted') {
            toast({
                title: "Transaction Failed ❌",
                description: "Rewards claim was reverted. You may not have rewards to claim.",
                variant: "destructive",
                duration: 5000,
            });
            setIsClaiming(false);
        } else if (receiptError) {
            toast({
                title: "Transaction Error ❌",
                description: receiptError.message || "Error processing rewards claim",
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
                description: writeError.message || "Failed to submit rewards claim",
                variant: "destructive",
                duration: 5000,
            });
            setIsClaiming(false);
        }
    }, [writeError, toast]);

    const handleClaimRewards = async () => {
        setIsClaiming(true);
        try {
            writeContract({
                address: PREDICTION_MARKET_ADDRESS,
                abi: PREDICTION_MARKET_ABI,
                functionName: "claimRewards",
                args: [BigInt(marketId)],
            });
            
            toast({
                title: "Claim Submitted ⏳",
                description: "Please confirm the transaction in your wallet...",
                duration: 3000,
            });
        } catch (error) {
            console.error(error);
            setIsClaiming(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="mb-2 bg-green-200 p-2 rounded-md text-center text-xs">
                Resolved: {outcome === 0 ? optionA : optionB}
            </div>
            <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleClaimRewards}
                disabled={isClaiming || isConfirming}
            >
                {isClaiming || isConfirming ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isConfirming ? "Processing..." : "Claiming..."}
                    </>
                ) : (
                    "Claim Rewards"
                )}
            </Button>
        </div>
    );
}
