import { Button } from "./ui/button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/contracts";
import { useState } from "react";
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
    const { writeContract, data: hash } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
        hash 
    });
    const { toast } = useToast();

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
                title: "Claiming Rewards!",
                description: "Your transaction has been submitted",
                duration: 5000,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Claim Failed",
                description: "There was an error claiming your rewards",
                variant: "destructive",
            });
        } finally {
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
                        {isConfirming ? "Confirming..." : "Claiming..."}
                    </>
                ) : (
                    "Claim Rewards"
                )}
            </Button>
        </div>
    );
}
