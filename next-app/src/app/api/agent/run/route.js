import { NextResponse } from 'next/server';

let auditLogs = [
  {
    id: 104,
    recordId: 104,
    timestamp: new Date().toISOString(),
    poolName: "Monad Vault",
    amountUSD: 15000,
    cviTier: "CVI Accredited Tier 1",
    txHash: "0x8f3c4e9100000000000000000000000000004e91"
  }
];

export async function POST(req) {
  try {
    const body = await req.json();
    const { targetPoolId = "pool-1", amountUSD = 15000 } = body;

    const mockPools = [
      { id: "pool-1", name: "Monad Vault", isCVIVerified: true, apyPercent: 12.8 },
      { id: "pool-4", name: "Shadow High-Yield Pool", isCVIVerified: false, apyPercent: 34.5 }
    ];

    const pool = mockPools.find(p => p.id === targetPoolId) || mockPools[0];

    // Evaluate Mandates
    if (amountUSD > 25000) {
      return NextResponse.json({
        success: false,
        blocked: true,
        reason: `Mandate Spend Limit Exceeded: Requested $${amountUSD.toLocaleString()} USD exceeds Max Tx Limit ($25,000 USD)`
      });
    }

    if (!pool.isCVIVerified) {
      return NextResponse.json({
        success: false,
        blocked: true,
        reason: `CVI Error 403 (UnverifiedPool): Destination vault '${pool.name}' failed Cleanverse CVI counterparty attestation`
      });
    }

    const newRecordId = auditLogs.length + 105;
    const newTxHash = `0x${Math.random().toString(16).substring(2, 12)}${Math.random().toString(16).substring(2, 12)}000000000000000000004e91`;

    const newRecord = {
      id: newRecordId,
      recordId: newRecordId,
      timestamp: new Date().toISOString(),
      poolName: pool.name,
      amountUSD: amountUSD,
      cviTier: "CVI Accredited Tier 1",
      txHash: newTxHash
    };

    auditLogs.unshift(newRecord);

    return NextResponse.json({
      success: true,
      blocked: false,
      message: `Autonomous rebalance of $${amountUSD.toLocaleString()} USD into ${pool.name} approved & executed on Monad Testnet`,
      auditRecord: newRecord
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(auditLogs);
}
