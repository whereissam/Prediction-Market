import { Button } from "./ui/button";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/contracts";
import { useState, useEffect } from "react";
import { Loader2, Gavel } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MarketOwnerResolveProps {
    marketId: number;
    market: {
        question: string;
        optionA: string;
        optionB: string;
        endTime: bigint;
        resolved: boolean;
    };
}

export function MarketOwnerResolve({ marketId, market }: MarketOwnerResolveProps) {
    const { address: account } = useAccount();
    const { writeContract, data: hash, error: writeError } = useWriteContract();
    const { data: receipt, isLoading: isWaitingForReceipt, error: receiptError } = useWaitForTransactionReceipt({
        hash,
        query: {
            enabled: !!hash,
        },
    });
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [resolvingOutcome, setResolvingOutcome] = useState<number | null>(null);

    // Handle transaction success/failure
    useEffect(() => {
        if (receipt && receipt.status === 'success') {
            const outcomeText = resolvingOutcome === 0 ? market.optionA : market.optionB;
            toast({
                title: "Market Resolved Successfully! 🎉",
                description: `Market resolved with outcome: ${outcomeText}. Hash: ${receipt.transactionHash.slice(0, 10)}...`,
                duration: 5000,
            });
            
            // Refresh data
            queryClient.invalidateQueries({ queryKey: ['readContract'] });
            setResolvingOutcome(null);
        } else if (receipt && receipt.status === 'reverted') {
            toast({
                title: "Resolution Failed ❌",
                description: "Market resolution was reverted. Please try again.",
                variant: "destructive",
                duration: 5000,
            });
            setResolvingOutcome(null);
        } else if (receiptError) {
            toast({
                title: "Transaction Error ❌",
                description: receiptError.message || "Error processing market resolution",
                variant: "destructive",
                duration: 5000,
            });
            setResolvingOutcome(null);
        }
    }, [receipt, receiptError, toast, queryClient, resolvingOutcome, market.optionA, market.optionB]);

    // Handle write errors
    useEffect(() => {
        if (writeError) {
            toast({
                title: "Resolution Failed ❌",
                description: writeError.message || "Failed to submit resolution transaction",
                variant: "destructive",
                duration: 5000,
            });
            setResolvingOutcome(null);
        }
    }, [writeError, toast]);

    const handleResolve = (outcome: number) => {
        if (!account) {
            toast({
                title: "Wallet Not Connected",
                description: "Please connect your wallet to resolve markets",
                variant: "destructive",
            });
            return;
        }

        // Convert frontend outcome (0,1) to contract enum values (1,2)
        const contractOutcome = outcome === 0 ? 1 : 2; // OPTION_A = 1, OPTION_B = 2
        
        setResolvingOutcome(outcome);
        try {
            writeContract({
                address: PREDICTION_MARKET_ADDRESS,
                abi: PREDICTION_MARKET_ABI,
                functionName: "resolveMarket",
                args: [BigInt(marketId), contractOutcome],
            });

            const outcomeText = outcome === 0 ? market.optionA : market.optionB;
            toast({
                title: "Resolution Submitted ⏳",
                description: `Resolving market with outcome: ${outcomeText}. Please confirm in your wallet...`,
                duration: 3000,
            });
        } catch (error) {
            console.error(error);
            setResolvingOutcome(null);
        }
    };

    // Check if market is expired
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = currentTime > Number(market.endTime);
    const isResolved = market.resolved;

    // Don't show if market is not expired yet or already resolved
    if (!isExpired || isResolved) {
        return null;
    }

    return (
        <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-3">
                <Gavel className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">Owner Resolution Required</span>
            </div>
            
            <p className="text-xs text-orange-700 mb-3">
                This market has expired and needs resolution. Choose the winning outcome:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
                <Button
                    onClick={() => handleResolve(0)}
                    disabled={resolvingOutcome !== null || isWaitingForReceipt}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-green-500/50 hover:bg-green-500/10 hover:border-green-500/70 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                    {resolvingOutcome === 0 || (resolvingOutcome === null && isWaitingForReceipt) ? (
                        <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            {isWaitingForReceipt ? 'Processing...' : 'Resolving...'}
                        </>
                    ) : (
                        <>
                            <span className="truncate">{market.optionA} Wins</span>
                        </>
                    )}
                </Button>
                
                <Button
                    onClick={() => handleResolve(1)}
                    disabled={resolvingOutcome !== null || isWaitingForReceipt}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500/50 hover:bg-red-500/10 hover:border-red-500/70 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                    {resolvingOutcome === 1 || (resolvingOutcome === null && isWaitingForReceipt) ? (
                        <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            {isWaitingForReceipt ? 'Processing...' : 'Resolving...'}
                        </>
                    ) : (
                        <>
                            <span className="truncate">{market.optionB} Wins</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}