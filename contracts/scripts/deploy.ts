import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy PredictToken first
  console.log("Deploying PredictToken...");
  const PredictToken = await ethers.getContractFactory("PredictToken");
  const predictToken = await PredictToken.deploy(deployer.address);
  await predictToken.waitForDeployment();
  const tokenAddress = await predictToken.getAddress();
  console.log("PredictToken deployed to:", tokenAddress);

  // Deploy PredictionMarket
  console.log("Deploying PredictionMarket...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(tokenAddress, deployer.address);
  await predictionMarket.waitForDeployment();
  const marketAddress = await predictionMarket.getAddress();
  console.log("PredictionMarket deployed to:", marketAddress);

  // Create a sample market
  console.log("Creating sample market...");
  const duration = 7 * 24 * 60 * 60; // 7 days
  await predictionMarket.createMarket(
    "Will Bitcoin reach $100,000 by end of 2024?",
    "Yes",
    "No",
    duration
  );
  console.log("Sample market created!");

  console.log("\n=== Deployment Summary ===");
  console.log("PredictToken:", tokenAddress);
  console.log("PredictionMarket:", marketAddress);
  console.log("\nUpdate your .env.local file with these addresses:");
  console.log(`TOKEN_CONTRACT_ADDRESS=${tokenAddress}`);
  console.log(`PREDICTION_MARKET_CONTRACT_ADDRESS=${marketAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });