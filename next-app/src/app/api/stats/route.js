import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalAUMUSD: 14250000,
    totalExecutionsCount: 384,
    activeMandatesCount: 12,
    cviVerifiedPoolsCount: 4,
    unverifiedPoolsCount: 1,
    monadTestnetChainId: 10143
  });
}
