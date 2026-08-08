import React, { useState } from 'react';
import { Bot, ShieldAlert, ShieldCheck, CheckCircle2, AlertOctagon, Cpu, Sliders, Zap, Activity } from 'lucide-react';

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

  const runCycleForPool = async (targetPoolId, amountUSD) => {
    const targetPool = pools.find(p => p.id === targetPoolId) || currentPool;
    setIsExecuting(true);
    setExecutionResult(null);
    setEvaluationSteps([
      { step: 1, text: "Reading Cleanverse Agent Skill Mandate parameters...", status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 250));
    setEvaluationSteps(prev => [
      { step: 1, text: `Mandate Check: Per-Tx Limit $${mandate.maxSpendPerTxUSD.toLocaleString()} USD`, status: amountUSD <= mandate.maxSpendPerTxUSD ? "pass" : "fail" },
      { step: 2, text: `Target Yield Check: Pool ${targetPool.apyPercent}% APY vs Required ${(mandate.minRequiredYieldBps / 100)}% APY`, status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 350));
    const yieldPass = targetPool.apyPercent >= (mandate.minRequiredYieldBps / 100);
    setEvaluationSteps(prev => [
      prev[0],
      { step: 2, text: `Target Yield Check: Pool ${targetPool.apyPercent}% APY vs Required ${(mandate.minRequiredYieldBps / 100)}% APY`, status: yieldPass ? "pass" : "fail" },
      { step: 3, text: `Evaluating Cleanverse CVI Counterparty Clearance (${targetPool.name})...`, status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 350));
    
    // Execute backend agent cycle
    const result = await onRunAgentCycle({
      targetPoolId: targetPoolId,
      amountUSD: amountUSD
    });

    const cviPass = targetPool.isCVIVerified && (amountUSD <= mandate.maxSpendPerTxUSD) && yieldPass;
    setEvaluationSteps(prev => [
      prev[0],
      prev[1],
      { step: 3, text: `CVI Counterparty Check: ${targetPool.name} (${targetPool.isCVIVerified ? 'CVI VERIFIED' : 'UNVERIFIED POOL - REVERT'})`, status: targetPool.isCVIVerified ? "pass" : "fail" }
    ]);

    setExecutionResult(result);
    setIsExecuting(false);
  };

  const handleTriggerAgentCycle = () => {
    runCycleForPool(selectedPoolId, rebalanceAmountUSD);
  };

  const handlePresetSelect = (poolId, amount) => {
    setSelectedPoolId(poolId);
    setRebalanceAmountUSD(amount);
    runCycleForPool(poolId, amount);
  };

  return (
    <div id="agent-control-panel-section" className="space-y-8 pt-4">
      
      {/* Hero Highlight Banner */}
      <div className="glass-panel p-8 relative overflow-hidden border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#0d1324] to-indigo-950/30">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold uppercase flex items-center gap-1.5 shadow-lg">
                <Bot className="w-4 h-4 text-purple-400" />
                AUTONOMOUS DEFI AGENT ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Capability #8: Agent Skill Framework
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
              Autonomous Compliant Yield & Rebalance Platform
            </h2>
            
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              CleanAgent continuously evaluates target liquidity pools, checks **Cleanverse Verified Identity (CVI)** counterparty credentials on-chain, enforces spend limits, and executes automated rebalance mandates with cryptographic **CVA audit logging**.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleTriggerAgentCycle}
              disabled={isExecuting}
              className="btn-primary w-full sm:w-auto py-4 px-8 text-base flex items-center justify-center gap-3 shadow-2xl shadow-purple-500/30"
            >
              {isExecuting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Agent Executing Cycle...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                  Run Autonomous Agent Execution
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Metrics Pill Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 font-mono">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">AGENT MANDATE STATUS</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              ACTIVE & MONITORING
            </span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">MAX PER-TX LIMIT</span>
            <span className="text-white font-bold text-sm mt-0.5 block">${mandate.maxSpendPerTxUSD.toLocaleString()} USD</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">MIN APY TARGET</span>
            <span className="text-purple-300 font-bold text-sm mt-0.5 block">{(mandate.minRequiredYieldBps / 100)}% APY</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">COUNTERPARTY RULE</span>
            <span className="text-emerald-400 font-bold text-sm mt-0.5 block">Cleanverse CVI Required</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Configure Mandate & Pool */}
        <div className="lg:col-span-2 glass-panel p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Configure Autonomous Rebalance Mandate</h3>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold">Step 1 of 2</span>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2 font-semibold">SELECT TARGET DEFI LIQUIDITY POOL:</label>
            <select
              value={selectedPoolId}
              onChange={(e) => setSelectedPoolId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 text-white text-sm font-mono rounded-xl p-3.5 focus:outline-none focus:border-purple-500 cursor-pointer shadow-inner"
            >
              {pools.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.ticker}) — {p.apyPercent}% APY | {p.isCVIVerified ? 'Cleanverse CVI Verified' : '⚠️ UNVERIFIED POOL (WILL REVERT)'}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Slider */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-3 font-mono">
            <div className="flex justify-between items-center">
              <label className="text-xs text-slate-300 font-bold">REBALANCE EXECUTION AMOUNT:</label>
              <span className="text-2xl font-black text-emerald-400">${rebalanceAmountUSD.toLocaleString()} USD</span>
            </div>
            
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={rebalanceAmountUSD}
              onChange={(e) => setRebalanceAmountUSD(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
            />
            
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Min: $1,000</span>
              <span>Max Tx Limit: ${mandate.maxSpendPerTxUSD.toLocaleString()}</span>
            </div>
          </div>

          {/* Scenario Presets (Instant Auto-Run) */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold block">1-CLICK TEST SCENARIO PRESETS (AUTO-RUN):</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => handlePresetSelect("pool-1", 15000)}
                className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-left transition-all font-semibold hover:scale-105"
              >
                <div className="text-[10px] text-emerald-400 font-bold">PRESET 1 (PASS)</div>
                <div>Monad Vault</div>
                <div className="text-[10px] opacity-75">12.8% APY | CVI Verified</div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect("pool-4", 20000)}
                className="p-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/50 text-rose-300 text-left transition-all font-semibold hover:scale-105"
              >
                <div className="text-[10px] text-rose-400 font-bold">PRESET 2 (REVERT)</div>
                <div>Shadow Pool</div>
                <div className="text-[10px] opacity-75">Unverified | CVI Error 403</div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect("pool-1", 35000)}
                className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-950/80 border border-amber-500/50 text-amber-300 text-left transition-all font-semibold hover:scale-105"
              >
                <div className="text-[10px] text-amber-400 font-bold">PRESET 3 (ABORT)</div>
                <div>Spend Limit Exceeded</div>
                <div className="text-[10px] opacity-75">$35,000 &gt; $25,000 Limit</div>
              </button>
            </div>
          </div>

        </div>

        {/* Right: Live Evaluation Trace & Callout */}
        <div className="glass-panel p-8 space-y-5 flex flex-col justify-between border-slate-700">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-4">
              <Cpu className="w-5 h-5 text-purple-400" />
              Real-Time Protocol Evaluation Trace
            </h3>

            <div className="mt-4 space-y-3 font-mono text-xs">
              {evaluationSteps.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl leading-relaxed">
                  Click <span className="text-purple-400 font-bold">Run Autonomous Agent Execution</span> or select a <span className="text-emerald-400 font-bold">Preset Button</span> to see the Cleanverse Agent Skill Framework evaluate mandate rules & counterparty CVI compliance in real-time.
                </div>
              ) : (
                evaluationSteps.map((s, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                    s.status === 'pass' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
                    s.status === 'fail' ? 'bg-rose-950/50 border-rose-500/50 text-rose-300 font-bold shadow-lg shadow-rose-950/50' :
                    'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {s.status === 'pass' && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />}
                    {s.status === 'fail' && <AlertOctagon className="w-4.5 h-4.5 text-rose-400 shrink-0" />}
                    {s.status === 'pending' && <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin shrink-0"></span>}
                    <span>{s.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {executionResult && (
            <div className={`p-5 rounded-2xl border space-y-3 font-mono animate-in fade-in duration-300 ${
              executionResult.blocked 
                ? 'bg-rose-950/70 border-rose-500/80 text-rose-100 shadow-2xl shadow-rose-950/60' 
                : 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100 shadow-2xl shadow-emerald-950/60'
            }`}>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
                {executionResult.blocked ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    <span className="text-rose-400">AGENT MANDATE ABORTED ON-CHAIN!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>AUTONOMOUS EXECUTION APPROVED!</span>
                  </>
                )}
              </div>

              <p className="text-xs leading-relaxed font-medium">
                {executionResult.reason || executionResult.message}
              </p>

              {executionResult.auditRecord && (
                <div className="pt-3 border-t border-white/10 text-[10px] space-y-1">
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
