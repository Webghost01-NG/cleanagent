import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ==========================================
// CLEANAGENT PROTOCOL - AUTONOMOUS ENGINE STATE
// ==========================================

// Pre-configured CVI Identity Registry
let cviIdentities = {
  "0x2546BcD3c84621e976D8185a91A922aE77ECEc30": {
    wallet: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    name: "Charlie Sterling",
    entityType: "Institutional Accredited Vault",
    role: "Accredited Investor",
    isVerified: true,
    isAccredited: true,
    cviCertificateHash: "CVI-CERT-CLEANAGENT-88201",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F": {
    wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    name: "Alice Vance",
    entityType: "Individual Investor",
    role: "Verified Standard Investor",
    isVerified: true,
    isAccredited: false,
    cviCertificateHash: "CVI-CERT-CLEANAGENT-44109",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc": {
    wallet: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    name: "Bob Unverified Pool",
    entityType: "Unverified Liquidity Pool",
    role: "Unverified Entity",
    isVerified: false,
    isAccredited: false,
    cviCertificateHash: "UNVERIFIED",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
  }
};

// Target DeFi Liquidity Pools Evaluated by Autonomous AI Agent
let yieldPools = [
  {
    id: "pool-1",
    name: "Monad High-Yield Stable Vault",
    ticker: "CA-MONAD01",
    protocol: "CleanFi Monad",
    network: "Monad Protocol",
    poolAddress: "0x1111111111111111111111111111111111111111",
    asset: "USDC",
    apyPercent: 12.8,
    totalTVLUSD: 4200000,
    riskRating: "Low Risk",
    isCVIVerified: true,
    isCVIAccreditedOnly: true,
    cviCertificateHash: "CVI-CERT-POOL-MONAD-991"
  },
  {
    id: "pool-2",
    name: "Base Compliant Credit Vault",
    ticker: "CA-BASE88",
    protocol: "Base Credit",
    network: "Base Mainnet",
    poolAddress: "0x2222222222222222222222222222222222222222",
    asset: "USDC",
    apyPercent: 9.4,
    totalTVLUSD: 2800000,
    riskRating: "Low Risk",
    isCVIVerified: true,
    isCVIAccreditedOnly: false,
    cviCertificateHash: "CVI-CERT-POOL-BASE-441"
  },
  {
    id: "pool-3",
    name: "Arbitrum Clean Treasury Pool",
    ticker: "CA-ARB33",
    protocol: "Arbitrum Treasury",
    network: "Arbitrum One",
    poolAddress: "0x3333333333333333333333333333333333333333",
    asset: "USDT",
    apyPercent: 8.1,
    totalTVLUSD: 1950000,
    riskRating: "Ultra Low",
    isCVIVerified: true,
    isCVIAccreditedOnly: false,
    cviCertificateHash: "CVI-CERT-POOL-ARB-221"
  },
  {
    id: "pool-4",
    name: "Shadow Unverified Liquidity Farm",
    ticker: "SHADOW-DEX",
    protocol: "Shadow DEX",
    network: "Unknown EVM",
    poolAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    asset: "USDC",
    apyPercent: 28.5, // High APY honey trap
    totalTVLUSD: 850000,
    riskRating: "High Risk",
    isCVIVerified: false, // WILL REVERT
    isCVIAccreditedOnly: false,
    cviCertificateHash: "UNVERIFIED"
  }
];

// Agent Mandate Settings
let agentMandate = {
  maxSpendPerTxUSD: 25000,
  maxDailySpendUSD: 100000,
  currentDailySpendUSD: 10000,
  minRequiredYieldBps: 700, // 7.00% APY
  requireAccreditedPoolOnly: false,
  isAgentActive: true
};

// CVA Provenance Audit Trail
let auditTrail = [
  {
    id: 1,
    recordId: 101,
    agentMandateHash: "MANDATE-CLEANAGENT-EXEC-001",
    actionType: "AUTONOMOUS_REBALANCE",
    poolName: "Monad High-Yield Stable Vault",
    poolAddress: "0x1111111111111111111111111111111111111111",
    amountUSD: 10000,
    apyPercent: 12.8,
    isSuccessful: true,
    cviCertificateHash: "CVI-CERT-POOL-MONAD-991",
    rejectionReason: "",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    provenanceTxHash: "0xa84f19b2e7c91e0d34a59f1c4e7821039bc09142f6d897a1024e891b2c45de11"
  }
];

// API Endpoints

app.get('/api/health', (req, res) => {
  res.json({
    status: "ONLINE",
    protocol: "CleanAgent Autonomous DeFi Engine v2.0",
    agentFramework: "Cleanverse Agent Skill Framework (Capability #8)",
    cviState: "ACTIVE",
    cvaLedger: "SYNCED",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    activeAgentMandates: 1,
    totalTVLManagedUSD: 575000,
    totalPoolsEvaluated: yieldPools.length,
    successfulRebalances: auditTrail.filter(a => a.isSuccessful).length,
    cviViolationsBlocked: auditTrail.filter(a => !a.isSuccessful).length,
    agentExecutionSuccessRate: "100.0%"
  });
});

app.get('/api/pools', (req, res) => {
  res.json(yieldPools);
});

app.get('/api/agent/mandate', (req, res) => {
  res.json(agentMandate);
});

app.post('/api/agent/mandate', (req, res) => {
  const { maxSpendPerTxUSD, maxDailySpendUSD, minRequiredYieldBps, requireAccreditedPoolOnly, isAgentActive } = req.body;
  if (maxSpendPerTxUSD !== undefined) agentMandate.maxSpendPerTxUSD = parseFloat(maxSpendPerTxUSD);
  if (maxDailySpendUSD !== undefined) agentMandate.maxDailySpendUSD = parseFloat(maxDailySpendUSD);
  if (minRequiredYieldBps !== undefined) agentMandate.minRequiredYieldBps = parseFloat(minRequiredYieldBps);
  if (requireAccreditedPoolOnly !== undefined) agentMandate.requireAccreditedPoolOnly = !!requireAccreditedPoolOnly;
  if (isAgentActive !== undefined) agentMandate.isAgentActive = !!isAgentActive;

  res.json({ success: true, message: "CleanAgent Mandate parameters updated!", mandate: agentMandate });
});

// CORE AUTONOMOUS AGENT EXECUTION CYCLE ENDPOINT
app.post('/api/agent/run', async (req, res) => {
  const { targetPoolId, amountUSD } = req.body;
  const pool = yieldPools.find(p => p.id === targetPoolId) || yieldPools[0];
  const spendUSD = parseFloat(amountUSD) || 15000;

  if (!agentMandate.isAgentActive) {
    return res.status(400).json({ error: "Agent Mandate is currently paused" });
  }

  // 1. Spend Check
  if (spendUSD > agentMandate.maxSpendPerTxUSD) {
    const reason = `Agent Mandate Violation: Transaction amount ($${spendUSD.toLocaleString()}) exceeds per-tx limit ($${agentMandate.maxSpendPerTxUSD.toLocaleString()})`;
    const record = createAuditRecord(pool, spendUSD, false, reason);
    auditTrail.unshift(record);

    return res.status(403).json({
      success: false,
      blocked: true,
      reason: reason,
      auditRecord: record
    });
  }

  // 2. Yield Check
  if (pool.apyPercent < (agentMandate.minRequiredYieldBps / 100)) {
    const reason = `Agent Mandate Violation: Pool APY (${pool.apyPercent}%) is below minimum required yield threshold (${agentMandate.minRequiredYieldBps / 100}%)`;
    const record = createAuditRecord(pool, spendUSD, false, reason);
    auditTrail.unshift(record);

    return res.status(403).json({
      success: false,
      blocked: true,
      reason: reason,
      auditRecord: record
    });
  }

  // 3. Cleanverse CVI Counterparty Verification Check
  if (!pool.isCVIVerified) {
    const reason = `Cleanverse CVI Error 403: Target pool '${pool.name}' (${pool.poolAddress.slice(0,6)}...) lacks Cleanverse Verified Identity (CVI). Autonomous agent refused capital deposit.`;
    const record = createAuditRecord(pool, spendUSD, false, reason);
    auditTrail.unshift(record);

    return res.status(403).json({
      success: false,
      blocked: true,
      reason: reason,
      auditRecord: record
    });
  }

  if (agentMandate.requireAccreditedPoolOnly && !pool.isCVIAccreditedOnly) {
    const reason = `Cleanverse CVI Error 403: Target pool '${pool.name}' lacks Institutional Accreditation Certificate required by active Agent Mandate.`;
    const record = createAuditRecord(pool, spendUSD, false, reason);
    auditTrail.unshift(record);

    return res.status(403).json({
      success: false,
      blocked: true,
      reason: reason,
      auditRecord: record
    });
  }

  // Approved Execution
  agentMandate.currentDailySpendUSD += spendUSD;
  const record = createAuditRecord(pool, spendUSD, true, "");
  auditTrail.unshift(record);

  res.json({
    success: true,
    blocked: false,
    message: `Autonomous Agent rebalanced $${spendUSD.toLocaleString()} USDC into ${pool.name} (${pool.apyPercent}% APY). Cleanverse CVI Passed & CVA Logged!`,
    auditRecord: record
  });
});

app.get('/api/cvi/identities', (req, res) => {
  res.json(Object.values(cviIdentities));
});

app.get('/api/cva/audit-trail', (req, res) => {
  res.json(auditTrail);
});

function createAuditRecord(pool, spendUSD, isSuccessful, rejectionReason) {
  const id = auditTrail.length + 1;
  const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;

  return {
    id: id,
    recordId: 100 + id,
    agentMandateHash: `MANDATE-CLEANAGENT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    actionType: isSuccessful ? "AUTONOMOUS_REBALANCE" : "BLOCKED_CVI_VIOLATION",
    poolName: pool.name,
    poolAddress: pool.poolAddress,
    amountUSD: spendUSD,
    apyPercent: pool.apyPercent,
    isSuccessful: isSuccessful,
    cviCertificateHash: pool.cviCertificateHash || "UNVERIFIED",
    rejectionReason: rejectionReason,
    timestamp: new Date().toISOString(),
    provenanceTxHash: txHash
  };
}

app.listen(PORT, () => {
  console.log(`🚀 CleanAgent Protocol API running on http://localhost:${PORT}`);
});
