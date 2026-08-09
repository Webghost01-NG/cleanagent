import { NextResponse } from 'next/server';
import { globalAuditLogs } from '@/lib/auditStore';

export async function GET() {
  return NextResponse.json(globalAuditLogs);
}
