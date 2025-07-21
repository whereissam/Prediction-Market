// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PredictToken} from "../src/PredictToken.sol";
import {PredictionMarket} from "../src/PredictionMarket.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying contracts with deployer:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        // Deploy PredictToken first
        console.log("Deploying PredictToken...");
        PredictToken predictToken = new PredictToken(deployer);
        console.log("PredictToken deployed at:", address(predictToken));
        
        // Deploy PredictionMarket
        console.log("Deploying PredictionMarket...");
        PredictionMarket predictionMarket = new PredictionMarket(
            address(predictToken), 
            deployer
        );
        console.log("PredictionMarket deployed at:", address(predictionMarket));
        
        // Create a sample market (7 days duration)
        console.log("Creating sample market...");
        uint256 duration = 7 * 24 * 60 * 60; // 7 days in seconds
        predictionMarket.createMarket(
            "Will Bitcoin reach $100,000 by end of 2024?",
            "Yes",
            "No",
            duration
        );
        console.log("Sample market created!");
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Summary ===");
        console.log("PredictToken:", address(predictToken));
        console.log("PredictionMarket:", address(predictionMarket));
        console.log("\nUpdate your frontend constants/contract.ts file:");
        console.log('export const contractAddress = "%s";', address(predictionMarket));
        console.log('export const tokenAddress = "%s";', address(predictToken));
    }
}