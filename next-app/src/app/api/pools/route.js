import { NextResponse } from 'next/server';

const mockPools = [
  {
    id: "pool-1",
    name: "Monad Vault",
    ticker: "USDC",
    chain: "Monad Testnet",
    protocol: "MonadSwap Protocol",
    contractAddress: "0x7a834e9100000000000000000000000000004e91",
    apyPercent: 12.8,
    tvlUSD: 5200000,
    isCVIVerified: true,
    riskRating: "Low Risk",
    complianceTier: "CVI Accredited Tier 1"
  },
  {
    id: "pool-2",
    name: "Ethereum RWA Treasury Vault",
    ticker: "USDC-RWA",
    chain: "Ethereum",
    protocol: "Ondo Finance / CleanAgent Wrapper",
    contractAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    apyPercent: 8.4,
    tvlUSD: 6100000,
    isCVIVerified: true,
    riskRating: "Low Risk",
    complianceTier: "CVI Accredited Tier 1"
  },
  {
    id: "pool-3",
    name: "Base Credit Vault",
    ticker: "USDC-cbETH",
    chain: "Base Mainnet",
    protocol: "Aerodrome Finance",
    contractAddress: "0x1111222233334444555566667777888899990000",
    apyPercent: 9.6,
    tvlUSD: 2450000,
    isCVIVerified: true,
    riskRating: "Medium Risk",
    complianceTier: "CVI Standard Tier 2"
  },
  {
    id: "pool-4",
    name: "Shadow High-Yield Pool",
    ticker: "SHDW",
    chain: "Monad Testnet",
    protocol: "Anonymous DEX",
    contractAddress: "0x9999888877776666555544443333222211110000",
    apyPercent: 34.5,
    tvlUSD: 500000,
    isCVIVerified: false,
    riskRating: "High Risk",
    complianceTier: "⚠️ UNVERIFIED (CVI Rejection 403)"
  }
];

export async function GET() {
  return NextResponse.json(mockPools);
}
