import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useAccount, useReadContract } from "wagmi";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/contracts";
import { MarketProgress } from "./market-progress";
import { MarketTime } from "./market-time";
import { MarketCardSkeleton } from "./market-card-skeleton";
import { MarketResolved } from "./market-resolved";
import { MarketPending } from "./market-pending";
import { MarketBuyInterface } from "./market-buy-interface";
import { MarketSharesDisplay } from "./market-shares-display";
import { MarketOwnerResolve } from "./market-owner-resolve";
import { useIsOwner } from "@/hooks/useIsOwner";

// Props for the MarketCard component
// index is the market id
// filter is the filter to apply to the market
interface MarketCardProps {
  index: number;
  filter: 'active' | 'pending' | 'resolved';
}

// Interface for the market data
interface Market {
  question: string;
  optionA: string;
  optionB: string;
  endTime: bigint;
  outcome: number;
  totalOptionAShares: bigint;
  totalOptionBShares: bigint;
  resolved: boolean;
}

// Interface for the shares balance
interface SharesBalance {
  optionAShares: bigint;
  optionBShares: bigint;
}

export function MarketCard({ index, filter }: MarketCardProps) {
    // Get the active account
    const { address: account } = useAccount();
    
    // Check if current user is contract owner
    const { isOwner } = useIsOwner();

    // Get the market data
    const { data: marketData, isLoading: isLoadingMarketData } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: "getMarketInfo",
        args: [BigInt(index)],
    });

    // Parse the market data
    const market: Market | undefined = marketData ? {
        question: marketData[0],
        optionA: marketData[1],
        optionB: marketData[2],
        endTime: marketData[3],
        outcome: marketData[4],
        totalOptionAShares: marketData[5],
        totalOptionBShares: marketData[6],
        resolved: marketData[7]
    } : undefined;

    // Get the shares balance
    const { data: sharesBalanceData } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: "getSharesBalance",
        args: account ? [BigInt(index), account as `0x${string}`] : undefined,
        query: {
            enabled: !!account,
        },
    });

    // Parse the shares balance
    const sharesBalance: SharesBalance | undefined = sharesBalanceData ? {
        optionAShares: sharesBalanceData[0],
        optionBShares: sharesBalanceData[1]
    } : undefined;

    // Check if the market is expired
    const isExpired = new Date(Number(market?.endTime) * 1000) < new Date();
    // Check if the market is resolved
    const isResolved = market?.resolved;

    // Check if the market should be shown
    const shouldShow = () => {
        if (!market) return false;
        
        switch (filter) {
            case 'active':
                return !isExpired;
            case 'pending':
                return isExpired && !isResolved;
            case 'resolved':
                return isExpired && isResolved;
            default:
                return true;
        }
    };

    // If the market should not be shown, return null
    if (!shouldShow()) {
        return null;
    }

    return (
        <Card key={index} className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
            {isLoadingMarketData ? (
                <MarketCardSkeleton />
            ) : (
                <>
                    <CardHeader className="pb-3">
                        {market && <MarketTime endTime={market.endTime} />}
                        <CardTitle className="text-base sm:text-lg leading-tight min-h-[2.5rem] flex items-center">
                            {market?.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pb-3">
                        {market && (
                            <div className="mb-4">
                                <MarketProgress 
                                    optionA={market.optionA}
                                    optionB={market.optionB}
                                    totalOptionAShares={market.totalOptionAShares}
                                    totalOptionBShares={market.totalOptionBShares}
                                />
                            </div>
                        )}
                        {new Date(Number(market?.endTime) * 1000) < new Date() ? (
                            market?.resolved ? (
                                <MarketResolved 
                                    marketId={index}
                                    outcome={market.outcome}
                                    optionA={market.optionA}
                                    optionB={market.optionB}
                                />
                            ) : (
                                <>
                                    {isOwner && market && (
                                        <MarketOwnerResolve
                                            marketId={index}
                                            market={market}
                                        />
                                    )}
                                    <MarketPending />
                                </>
                            )
                        ) : (
                            <MarketBuyInterface 
                                marketId={index}
                                market={market!}
                            />
                        )}
                    </CardContent>
                    <CardFooter className="pt-3 border-t bg-muted/5 dark:bg-muted/10">
                        {market && sharesBalance && (
                            <MarketSharesDisplay 
                                market={market}
                                sharesBalance={sharesBalance}
                            />
                        )}
                    </CardFooter>
                </>
            )}
        </Card>
    )
}