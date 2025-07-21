// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PredictionMarket} from "../src/PredictionMarket.sol";

contract CreateMarketsScript is Script {
    address constant PREDICTION_MARKET_ADDRESS = 0x553c346d69052e97255ee77F1Ae96d857fB42DB9;
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        PredictionMarket market = PredictionMarket(PREDICTION_MARKET_ADDRESS);
        
        console.log("Creating 10 different prediction markets...");
        
        // 1. Short-term market (5 minutes) - for quick testing
        market.createMarket(
            "Will ETH price be above $2,500 in 5 minutes?",
            "Above $2,500",
            "Below $2,500",
            5 * 60 // 5 minutes
        );
        console.log("Market 1 created: ETH price 5-minute prediction");
        
        // 2. Another short-term market (10 minutes)
        market.createMarket(
            "Will BTC/USD be green in the next 10 minutes?",
            "Green (Up)",
            "Red (Down)",
            10 * 60 // 10 minutes
        );
        console.log("Market 2 created: BTC direction 10-minute prediction");
        
        // 3. Sports - short term (30 minutes)
        market.createMarket(
            "Will the next NBA game have over 220 total points?",
            "Over 220",
            "Under 220",
            30 * 60 // 30 minutes
        );
        console.log("Market 3 created: NBA game prediction");
        
        // 4. Tech prediction (1 hour)
        market.createMarket(
            "Will Apple stock close higher today?",
            "Higher Close",
            "Lower Close",
            1 * 60 * 60 // 1 hour
        );
        console.log("Market 4 created: Apple stock prediction");
        
        // 5. Weather prediction (2 hours)
        market.createMarket(
            "Will it rain in New York in the next 2 hours?",
            "Will Rain",
            "No Rain",
            2 * 60 * 60 // 2 hours
        );
        console.log("Market 5 created: Weather prediction");
        
        // 6. Crypto market (6 hours)
        market.createMarket(
            "Will Solana (SOL) outperform Ethereum today?",
            "SOL Wins",
            "ETH Wins",
            6 * 60 * 60 // 6 hours
        );
        console.log("Market 6 created: SOL vs ETH prediction");
        
        // 7. Political prediction (1 day)
        market.createMarket(
            "Will there be a major political announcement today?",
            "Yes, Major News",
            "No Major News",
            24 * 60 * 60 // 1 day
        );
        console.log("Market 7 created: Political prediction");
        
        // 8. Sports prediction (3 days)
        market.createMarket(
            "Will Team USA win their next Olympic event?",
            "USA Wins",
            "USA Loses",
            3 * 24 * 60 * 60 // 3 days
        );
        console.log("Market 8 created: Olympic prediction");
        
        // 9. Tech prediction (1 week)
        market.createMarket(
            "Will Tesla announce new product this week?",
            "Yes, New Product",
            "No Announcement",
            7 * 24 * 60 * 60 // 1 week
        );
        console.log("Market 9 created: Tesla prediction");
        
        // 10. Long-term crypto prediction (1 month)
        market.createMarket(
            "Will Bitcoin be above $80,000 by next month?",
            "Above $80K",
            "Below $80K",
            30 * 24 * 60 * 60 // 1 month
        );
        console.log("Market 10 created: Bitcoin long-term prediction");
        
        vm.stopBroadcast();
        
        console.log("\n=== All 10 Markets Created! ===");
        console.log("Markets with different time durations:");
        console.log("- 2 short-term (5-10 min) for quick testing");
        console.log("- 3 medium-term (30 min - 2 hours)");
        console.log("- 3 daily predictions (6-24 hours)");
        console.log("- 2 long-term (1 week - 1 month)");
        console.log("\nRefresh your frontend to see all markets!");
    }
}