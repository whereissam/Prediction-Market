import { NextResponse } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { tokenAddress as PREDICT_TOKEN_ADDRESS } from "@/constants/contract";

// This would be your backend wallet's private key (keep secure!)
const BACKEND_PRIVATE_KEY = process.env.BACKEND_PRIVATE_KEY;

const ERC20_ABI = [
  {
    "name": "mint",
    "type": "function",
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;

export async function POST(request: Request) {
  if (!BACKEND_PRIVATE_KEY) {
    return NextResponse.json(
      { error: "Backend not configured" },
      { status: 500 }
    );
  }

  try {
    const { address } = await request.json();
    
    // Create wallet client
    const account = privateKeyToAccount(`0x${BACKEND_PRIVATE_KEY}`);
    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http()
    });

    // Mint 100 tokens to the user
    const hash = await walletClient.writeContract({
      address: PREDICT_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: "mint",
      args: [address, parseEther("100")],
    });

    return NextResponse.json({ 
      success: true, 
      transactionHash: hash 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to mint tokens" },
      { status: 500 }
    );
  }
}