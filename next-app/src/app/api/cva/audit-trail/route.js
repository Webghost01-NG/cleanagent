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
      txHash: "0x8f3c4e9100000000000000000000000000004e91"
    },
    {
      id: 103,
      recordId: 103,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      poolName: "Ethereum RWA Treasury Vault",
      amountUSD: 25000,
      cviTier: "CVI Accredited Tier 1",
      txHash: "0x2546bcd30000000000000000000000000000c30a"
    }
  ]);
}
