"use client";

import { useReadContract } from "wagmi";
import { PREDICTION_MARKET_ADDRESS } from "@/lib/wagmi";
import { PREDICTION_MARKET_ABI } from "@/lib/contracts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCard } from "./marketCard";
import { Navbar } from "./navbar";
import { MarketCardSkeleton } from "./market-card-skeleton";
import { Footer } from "./footer";
import { TokenBalance } from "./token-balance";
import { DebugInfo } from "./debug-info";
import Image from "next/image";

export function EnhancedPredictionMarketDashboard() {
  const { data: marketCount, isLoading: isLoadingMarketCount } =
    useReadContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: "marketCount",
    });

  // Show 6 skeleton cards while loading
  const skeletonCards = Array.from({ length: 6 }, (_, i) => (
    <MarketCardSkeleton key={`skeleton-${i}`} />
  ));

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-2 sm:p-4">
        <Navbar />
        <div className="mb-4 sm:mb-6 relative h-[160px] sm:h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1570304815928-ef0771059599?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Prediction Market Banner"
            fill
            priority
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 rounded-lg flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-primary-foreground text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2" style={{fontFamily: 'var(--font-serif)', letterSpacing: 'var(--tracking-tight)'}}>
                Prediction Market
              </h1>
              <p className="text-primary-foreground/90 text-sm sm:text-base md:text-lg font-medium hidden sm:block">
                Trade on future events with confidence
              </p>
            </div>
          </div>
        </div>
        <DebugInfo />
        <TokenBalance />
        <Tabs defaultValue="active" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 h-12 bg-muted/30 p-1" style={{boxShadow: 'var(--shadow-sm)', fontFamily: 'var(--font-sans)', letterSpacing: 'var(--tracking-normal)'}}>
              <TabsTrigger value="active" className="text-sm font-semibold px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg transition-all duration-200">
                <span className="hidden sm:inline">Active Markets</span>
                <span className="sm:hidden">Active</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-sm font-semibold px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg transition-all duration-200">
                <span className="hidden sm:inline">Pending</span>
                <span className="sm:hidden">Pending</span>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-sm font-semibold px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg transition-all duration-200">
                <span className="hidden sm:inline">Resolved</span>
                <span className="sm:hidden">Resolved</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {isLoadingMarketCount ? (
            <TabsContent value="active" className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {skeletonCards}
              </div>
            </TabsContent>
          ) : (
            <>
              <TabsContent value="active" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard key={index} index={index} filter="active" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard key={index} index={index} filter="pending" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resolved" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard key={index} index={index} filter="resolved" />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
