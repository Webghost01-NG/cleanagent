import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      wallet: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      name: "Charlie (Primary Test Persona)",
      isVerified: true,
      isAccredited: true,
      riskScore: 12
    },
    {
      wallet: "0x7a834e9100000000000000000000000000004e91",
      name: "Monad Treasury Vault",
      isVerified: true,
      isAccredited: true,
      riskScore: 8
    }
  ]);
}
