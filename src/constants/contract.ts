// Contract addresses - hardcoded for server-side compatibility
export const contractAddress = "0x553c346d69052e97255ee77F1Ae96d857fB42DB9" as const;
export const tokenAddress = "0x463aA55Bb41E2c63515d59Fb7eA44085DB21DE77" as const;

// Legacy exports for backward compatibility
export const contract = {
  address: contractAddress,
};

export const tokenContract = {
  address: tokenAddress,
};