import { NextResponse } from 'next/server';

let currentMandate = {
  maxSpendPerTxUSD: 25000,
  maxDailySpendUSD: 100000,
  currentDailySpendUSD: 10000,
  minRequiredYieldBps: 700,
  requireAccreditedPoolOnly: false,
  isAgentActive: true,
  lastUpdated: new Date().toISOString()
};

export async function GET() {
  return NextResponse.json(currentMandate);
}

export async function POST(req) {
  try {
    const body = await req.json();
    currentMandate = {
      ...currentMandate,
      ...body,
      lastUpdated: new Date().toISOString()
    };
    return NextResponse.json({ success: true, mandate: currentMandate });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
