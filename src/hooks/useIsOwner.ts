import { useAccount, useReadContract } from "wagmi";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/contracts";

export function useIsOwner() {
    const { address: account } = useAccount();

    const { data: ownerAddress, isLoading } = useReadContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: "owner",
        query: {
            enabled: !!account,
        },
    });

    const isOwner = !!(
        account && 
        ownerAddress && 
        account.toLowerCase() === ownerAddress.toLowerCase()
    );

    return {
        isOwner,
        ownerAddress,
        isLoading,
    };
}