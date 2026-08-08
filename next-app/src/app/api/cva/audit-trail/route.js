import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 104,
      recordId: 104,
      timestamp: new Date().toISOString(),
      poolName: "Monad Vault",
      amountUSD: 15000,
      cviTier: "CVI Accredited Tier 1",
      txHash: "0x8f3c4e91a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7"
    },
    {
      id: 103,
      recordId: 103,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      poolName: "Ethereum RWA Treasury Vault",
      amountUSD: 25000,
      cviTier: "CVI Accredited Tier 1",
      txHash: "0x2546bcd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d78f3c4e91"
    }
  ]);
}
