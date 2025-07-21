// Contract addresses - hardcoded for server-side compatibility
export const contractAddress = "0x553c346d69052e97255ee77f1ae96d857fb42db9" as const;
export const tokenAddress = "0x463aa55bb41e2c63515d59fb7ea44085db21de77" as const;

// Legacy exports for backward compatibility
export const contract = {
  address: contractAddress,
};

export const tokenContract = {
  address: tokenAddress,
};