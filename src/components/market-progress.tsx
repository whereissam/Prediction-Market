import { Progress } from "@/components/ui/progress";
import { formatEther } from "viem";

interface MarketProgressProps {
    optionA: string;
    optionB: string;
    totalOptionAShares: bigint;
    totalOptionBShares: bigint;
}

export function MarketProgress({ 
    optionA, 
    optionB, 
    totalOptionAShares, 
    totalOptionBShares 
}: MarketProgressProps) {
    const totalShares = Number(totalOptionAShares) + Number(totalOptionBShares);
    const yesPercentage = totalShares > 0 
        ? (Number(totalOptionAShares) / totalShares) * 100 
        : 50;

    return (
        <div className="mb-4">
            <div className="flex justify-between mb-2">
                <span>
                    <span className="font-bold text-sm">
                        {optionA}: {Math.floor(parseInt(formatEther(totalOptionAShares)))}
                    </span>
                    {totalShares > 0 && (
                        <span className="text-xs text-muted-foreground"> {Math.floor(yesPercentage)}%</span>
                    )}
                </span>
                <span>
                    <span className="font-bold text-sm">
                        {optionB}: {Math.floor(parseInt(formatEther(totalOptionBShares)))}
                    </span>
                    {totalShares > 0 && (
                        <span className="text-xs text-muted-foreground"> {Math.floor(100 - yesPercentage)}%</span>
                    )}
                </span>
            </div>
            <Progress value={yesPercentage} className="h-2" />
        </div>
    );
}