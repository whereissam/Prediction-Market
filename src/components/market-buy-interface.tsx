import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { PREDICTION_MARKET_ADDRESS, PREDICT_TOKEN_ADDRESS } from "@/lib/wagmi";
import { PREDICTION_MARKET_ABI, ERC20_ABI } from "@/lib/contracts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast"

// Types for the component props
interface MarketBuyInterfaceProps {
    marketId: number;
    market: {
        optionA: string;
        optionB: string;
        question: string;
    };
}

// Type aliases for better readability
type BuyingStep = 'initial' | 'allowance' | 'confirm';
type Option = 'A' | 'B' | null;

export function MarketBuyInterface({ marketId, market }: MarketBuyInterfaceProps) {
    // Blockchain interactions
    const { address: account } = useAccount();
    const { writeContract } = useWriteContract();
    const { toast } = useToast()

    // UI state management
    const [isBuying, setIsBuying] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [containerHeight, setContainerHeight] = useState('auto');
    const contentRef = useRef<HTMLDivElement>(null);

    // Transaction state
    const [selectedOption, setSelectedOption] = useState<Option>(null);
    const [amount, setAmount] = useState(0);
    const [buyingStep, setBuyingStep] = useState<BuyingStep>('initial');
    const [isApproving, setIsApproving] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // Add to state variables
    const [error, setError] = useState<string | null>(null);

    // Update container height when content changes
    useEffect(() => {
        if (contentRef.current) {
            setTimeout(() => {
                setContainerHeight(`${contentRef.current?.offsetHeight || 0}px`);
            }, 0);
        }
    }, [isBuying, buyingStep, isVisible, error]);

    // Handlers for user interactions
    const handleBuy = (option: 'A' | 'B') => {
        setIsVisible(false);
        setTimeout(() => {
            setIsBuying(true);
            setSelectedOption(option);
            setIsVisible(true);
        }, 200); // Match transition duration
    };

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsBuying(false);
            setBuyingStep('initial');
            setSelectedOption(null);
            setAmount(0);
            setError(null);
            setIsVisible(true);
        }, 200);
    };

    // Get user's token allowance
    const { data: userAllowance } = useReadContract({
        address: PREDICT_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [account as `0x${string}`, PREDICTION_MARKET_ADDRESS],
        query: {
            enabled: !!account,
        },
    });

    // Check if user needs to approve token spending
    const checkApproval = async () => {
        if (amount <= 0) {
            setError("Amount must be greater than 0");
            return;
        }
        setError(null);

        try {
            const amountWei = parseEther(amount.toString());
            setBuyingStep((userAllowance || BigInt(0)) < amountWei ? 'allowance' : 'confirm');
        } catch (error) {
            console.error(error);
        }
    };

    // Handle token approval transaction
    const handleSetApproval = async () => {
        setIsApproving(true);
        setError(null);
        try {
            writeContract({
                address: PREDICT_TOKEN_ADDRESS,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [PREDICTION_MARKET_ADDRESS, parseEther(amount.toString())],
            });
            
            toast({
                title: "Approval Submitted",
                description: "Please confirm the transaction in your wallet",
                duration: 3000,
            });
            
            setBuyingStep('confirm');
        } catch (error: any) {
            console.error(error);
            setError(error?.message || "Approval failed");
            toast({
                title: "Approval Failed",
                description: error?.message || "There was an error with the approval",
                variant: "destructive",
            });
        } finally {
            setIsApproving(false);
        }
    };

    // Handle share purchase transaction
    const handleConfirm = async () => {
        if (!selectedOption || amount <= 0) {
            setError("Must select an option and enter an amount greater than 0");
            return;
        }

        setIsConfirming(true);
        setError(null);
        try {
            writeContract({
                address: PREDICTION_MARKET_ADDRESS,
                abi: PREDICTION_MARKET_ABI,
                functionName: "buyShares",
                args: [BigInt(marketId), selectedOption === 'A', parseEther(amount.toString())],
            });
            
            toast({
                title: "Purchase Submitted",
                description: "Please confirm the transaction in your wallet",
                duration: 3000,
            });
            
            handleCancel();
        } catch (error: any) {
            console.error(error);
            setError(error?.message || "Purchase failed");
            toast({
                title: "Purchase Failed",
                description: error?.message || "There was an error processing your purchase",
                variant: "destructive",
            });
        } finally {
            setIsConfirming(false);
        }
    };

    // Render the component
    return (
        <div 
            className="relative transition-[height] duration-200 ease-in-out overflow-hidden" 
            style={{ height: containerHeight }}
        >
            <div 
                ref={contentRef}
                className={cn(
                    "w-full transition-all duration-200 ease-in-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
            >
                {!isBuying ? (
                    // Initial option selection buttons
                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mb-4">
                        <Button 
                            className="flex-1 min-h-[2.5rem] text-sm font-medium" 
                            onClick={() => handleBuy('A')}
                            aria-label={`Vote ${market.optionA} for "${market.question}"`}
                            disabled={!account}
                        >
                            <span className="truncate">{market.optionA}</span>
                        </Button>
                        <Button 
                            className="flex-1 min-h-[2.5rem] text-sm font-medium"
                            onClick={() => handleBuy('B')}
                            aria-label={`Vote ${market.optionB} for "${market.question}"`}
                            disabled={!account}
                        >
                            <span className="truncate">{market.optionB}</span>
                        </Button>
                    </div>
                ) : (
                    // Buy interface with different steps
                    <div className="flex flex-col mb-4">
                        {buyingStep === 'allowance' ? (
                            // Approval step
                            <div className="flex flex-col border-2 border-gray-200 rounded-lg p-3 sm:p-4">
                                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Approval Needed</h2>
                                <p className="text-sm sm:text-base mb-3 sm:mb-4">You need to approve the transaction before proceeding.</p>
                                <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                                    <Button 
                                        onClick={handleSetApproval} 
                                        className="order-2 sm:order-1"
                                        size="sm"
                                        disabled={isApproving}
                                    >
                                        {isApproving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                <span className="hidden xs:inline">Approving...</span>
                                                <span className="xs:hidden">...</span>
                                            </>
                                        ) : (
                                            'Set Approval'
                                        )}
                                    </Button>
                                    <Button 
                                        onClick={handleCancel} 
                                        className="order-1 sm:order-2" 
                                        variant="outline"
                                        size="sm"
                                        disabled={isApproving}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : buyingStep === 'confirm' ? (
                            // Confirmation step
                            <div className="flex flex-col border-2 border-gray-200 rounded-lg p-3 sm:p-4">
                                <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Confirm Transaction</h2>
                                <p className="text-sm sm:text-base mb-3 sm:mb-4">
                                    You are about to buy <span className="font-bold">
                                        {amount} {selectedOption === 'A' ? market.optionA : market.optionB}
                                    </span> share(s).
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                                    <Button 
                                        onClick={handleConfirm} 
                                        className="order-2 sm:order-1"
                                        size="sm"
                                        disabled={isConfirming}
                                    >
                                        {isConfirming ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                <span className="hidden xs:inline">Confirming...</span>
                                                <span className="xs:hidden">...</span>
                                            </>
                                        ) : (
                                            'Confirm'
                                        )}
                                    </Button>
                                    <Button 
                                        onClick={handleCancel} 
                                        className="order-1 sm:order-2" 
                                        variant="outline"
                                        size="sm"
                                        disabled={isConfirming}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Amount input step
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 mb-2">
                                    {`1 ${selectedOption === 'A' ? market.optionA : market.optionB} = 1 PREDICT`}
                                </span>
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                        <div className="flex-grow">
                                            <Input
                                                type="number"
                                                min="0"
                                                step="1"
                                                placeholder="Enter amount"
                                                value={amount}
                                                onChange={(e) => {
                                                    const value = Math.max(0, Number(e.target.value));
                                                    setAmount(value);
                                                    setError(null);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === '-' || e.key === 'e') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className={cn(
                                                    "w-full text-sm sm:text-base",
                                                    error && "border-red-500 focus-visible:ring-red-500"
                                                )}
                                            />
                                        </div>
                                        <span className="font-bold text-sm whitespace-nowrap text-center sm:text-left">
                                            {selectedOption === 'A' ? market.optionA : market.optionB}
                                        </span>
                                    </div>
                                    <div className="min-h-[20px]">
                                        {error && (
                                            <span className="text-xs sm:text-sm text-red-500">
                                                {error}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <Button onClick={checkApproval} className="flex-1 order-2 sm:order-1" size="sm">
                                        Confirm
                                    </Button>
                                    <Button onClick={handleCancel} variant="outline" className="flex-1 order-1 sm:order-2" size="sm">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
