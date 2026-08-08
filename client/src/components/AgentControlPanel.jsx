import React, { useState } from 'react';
import { Bot, Play, ShieldAlert, ShieldCheck, CheckCircle2, AlertOctagon, Cpu, DollarSign, Sliders, ArrowRight, RefreshCw, Zap } from 'lucide-react';

export default function AgentControlPanel({ 
  pools, 
  mandate, 
  onRunAgentCycle, 
  onUpdateMandate,
  currentWallet,
  identities 
}) {
  const [selectedPoolId, setSelectedPoolId] = useState(pools[0]?.id || "pool-1");
  const [rebalanceAmountUSD, setRebalanceAmountUSD] = useState(15000);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [evaluationSteps, setEvaluationSteps] = useState([]);

  const currentPool = pools.find(p => p.id === selectedPoolId) || pools[0];
  const currentIdentity = identities.find(i => i.wallet === currentWallet) || { name: "Current Wallet", isVerified: false };

  const handleTriggerAgentCycle = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    setEvaluationSteps([
      { step: 1, text: "Reading Cleanverse Agent Skill Mandate parameters...", status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 300));
    setEvaluationSteps(prev => [
      { step: 1, text: `Mandate Check: Per-Tx Limit $${mandate.maxSpendPerTxUSD.toLocaleString()} USD`, status: rebalanceAmountUSD <= mandate.maxSpendPerTxUSD ? "pass" : "fail" },
      { step: 2, text: `Target Yield Check: Pool ${currentPool.apyPercent}% APY vs Required ${(mandate.minRequiredYieldBps / 100)}% APY`, status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 400));
    const yieldPass = currentPool.apyPercent >= (mandate.minRequiredYieldBps / 100);
    setEvaluationSteps(prev => [
      prev[0],
      { step: 2, text: `Target Yield Check: Pool ${currentPool.apyPercent}% APY vs Required ${(mandate.minRequiredYieldBps / 100)}% APY`, status: yieldPass ? "pass" : "fail" },
      { step: 3, text: `Evaluating Cleanverse CVI Counterparty Clearance (${currentPool.name})...`, status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 400));
    
    // Execute backend agent cycle
    const result = await onRunAgentCycle({
      targetPoolId: selectedPoolId,
      amountUSD: rebalanceAmountUSD
    });

    const cviPass = currentPool.isCVIVerified;
    setEvaluationSteps(prev => [
      prev[0],
      prev[1],
      { step: 3, text: `CVI Counterparty Check: ${currentPool.name} (${cviPass ? 'CVI VERIFIED' : 'UNVERIFIED POOL - REVERT'})`, status: cviPass ? "pass" : "fail" }
    ]);

    setExecutionResult(result);
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Kicker Banner */}
      <div className="glass-panel p-6 border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" />
                AUTONOMOUS DEFI AGENT
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">Cleanverse Capability #8: Agent Skill Framework</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              Autonomous Compliant Yield & Rebalance Engine
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              CleanAgent continuously scans target liquidity pools, checks **Cleanverse Verified Identity (CVI)** counterparty credentials on-chain, enforces spend limits, and executes automated rebalance mandates with cryptographic **CVA audit logging**.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerAgentCycle}
              disabled={isExecuting}
              className="btn-primary py-3.5 px-6 text-base flex items-center gap-2.5 shadow-xl shadow-purple-500/25"
            >
              {isExecuting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Agent Executing Cycle...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                  Run Autonomous Agent Cycle
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel & Live Evaluation Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Configure Agent Cycle */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-purple-400" />
            Configure Autonomous Agent Mandate & Target Pool
          </h3>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">SELECT TARGET LIQUIDITY POOL FOR REBALANCE:</label>
            <select
              value={selectedPoolId}
              onChange={(e) => setSelectedPoolId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {pools.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.ticker}) — {p.apyPercent}% APY | {p.isCVIVerified ? 'CVI Verified' : '⚠️ UNVERIFIED POOL (WILL REVERT)'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            
            {/* Rebalance Amount Slider */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">REBALANCE AMOUNT:</span>
                <span className="text-lg font-bold text-emerald-400">${rebalanceAmountUSD.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={rebalanceAmountUSD}
                onChange={(e) => setRebalanceAmountUSD(parseInt(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Max Single Tx Limit: ${mandate.maxSpendPerTxUSD.toLocaleString()}</span>
            </div>

            {/* Mandate Constraints */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-slate-400 block font-bold text-[10px] uppercase">ACTIVE MANDATE CONSTRAINTS:</span>
              <div className="flex justify-between">
                <span className="text-slate-400">MIN YIELD REQ:</span>
                <span className="text-sky-400 font-bold">{(mandate.minRequiredYieldBps / 100)}% APY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DAILY SPEND LIMIT:</span>
                <span className="text-purple-400 font-bold">${mandate.maxDailySpendUSD.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">COUNTERPARTY REQUIREMENT:</span>
                <span className="text-emerald-400 font-bold">Cleanverse CVI Required</span>
              </div>
            </div>

          </div>

          {/* Quick Scenario Preset Buttons */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">TEST SCENARIO PRESETS:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-1");
                  setRebalanceAmountUSD(15000);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold"
              >
                1. Monad Vault (CVI Passed - 12.8% APY)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-4");
                  setRebalanceAmountUSD(20000);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-semibold"
              >
                2. Shadow Unverified Pool (CVI Error 403 Rejection)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-1");
                  setRebalanceAmountUSD(35000); // Exceeds limit
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold"
              >
                3. Spend Limit Exceeded Violation
              </button>
            </div>
          </div>

        </div>

        {/* Right: Live Evaluation Trace & Audit Result */}
        <div className="glass-panel p-6 space-y-4 flex flex-col justify-between border-slate-700">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu className="w-5 h-5 text-purple-400" />
              Real-Time Agent Evaluation Trace
            </h3>

            <div className="mt-4 space-y-2 font-mono text-xs">
              {evaluationSteps.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  Click <span className="text-purple-400 font-bold">Run Autonomous Agent Cycle</span> to see the Cleanverse Agent Skill Framework evaluate mandate rules & counterparty CVI compliance in real-time.
                </div>
              ) : (
                evaluationSteps.map((s, idx) => (
                  <div key={idx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    s.status === 'pass' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' :
                    s.status === 'fail' ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 font-bold' :
                    'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {s.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {s.status === 'fail' && <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />}
                    {s.status === 'pending' && <span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin shrink-0"></span>}
                    <span>{s.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {executionResult && (
            <div className={`p-4 rounded-xl border space-y-3 font-mono animate-in fade-in duration-300 ${
              executionResult.blocked 
                ? 'bg-rose-950/60 border-rose-500/80 text-rose-100 shadow-2xl shadow-rose-950/50' 
                : 'bg-emerald-950/60 border-emerald-500/80 text-emerald-100 shadow-2xl shadow-emerald-950/50'
            }`}>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide">
                {executionResult.blocked ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    <span className="text-rose-400">AGENT MANDATE ABORTED ON-CHAIN!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>AUTONOMOUS EXECUTION COMPLIANT!</span>
                  </>
                )}
              </div>

              <p className="text-xs leading-relaxed font-medium">
                {executionResult.reason || executionResult.message}
              </p>

              {executionResult.auditRecord && (
                <div className="pt-2 border-t border-white/10 text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="opacity-70">MANDATE RECORD ID:</span>
                    <span className="font-bold">#{executionResult.auditRecord.recordId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">CVA PROVENANCE HASH:</span>
                    <span className="font-mono text-purple-300 truncate max-w-[140px] inline-block">{executionResult.auditRecord.provenanceTxHash}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
