import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const contractAddress = "0x12334951a76c5139F87e799bb8b6d96AF5064BD1";
export const tokenAddress = "0xE1308d26B169C81cd1Aff9F32F1F735Bb64F10Af";

export const contract = getContract({
    client: client,
    chain: baseSepolia, 
    address: contractAddress
});

export const tokenContract = getContract({
    client: client,
    chain: baseSepolia,
    address: tokenAddress
});