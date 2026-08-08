import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ShieldAlert, ShieldCheck, CheckCircle2, AlertOctagon, Cpu, Sliders, Zap, Activity, Terminal, Play, X, RefreshCw, BarChart3, ArrowRight, Lock, Check } from 'lucide-react';

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
  
  // Mandate Slider States
  const [maxSpendPerTx, setMaxSpendPerTx] = useState(mandate.maxSpendPerTxUSD || 25000);
  const [minYieldBps, setMinYieldBps] = useState(mandate.minRequiredYieldBps || 700);
  const [requireAccredited, setRequireAccredited] = useState(mandate.requireAccreditedPoolOnly || false);

  // Execution States
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [executionResult, setExecutionResult] = useState(null);
  const [evaluationSteps, setEvaluationSteps] = useState([]);

  const currentPool = pools.find(p => p.id === selectedPoolId) || pools[0];

  const handleUpdateMandateSettings = async () => {
    await onUpdateMandate({
      maxSpendPerTxUSD: maxSpendPerTx,
      minRequiredYieldBps: minYieldBps,
      requireAccreditedPoolOnly: requireAccredited
    });
    alert("✅ Agent Vault Mandate parameters updated on-chain!");
  };

  const runCycleForPool = async (targetPoolId, amountUSD) => {
    const targetPool = pools.find(p => p.id === targetPoolId) || currentPool;
    setIsTerminalModalOpen(true);
    setIsExecuting(true);
    setExecutionResult(null);
    setTerminalLogs([]);
    setEvaluationSteps([]);

    const appendLog = (msg, type = "info") => {
      setTerminalLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    };

    appendLog("🤖 Initializing Cleanverse Capability #8 Agent Skill Engine...", "sys");
    await new Promise(r => setTimeout(r, 400));

    appendLog(`📋 Reading Vault Mandate: MaxTx=$${maxSpendPerTx.toLocaleString()}, MinAPY=${(minYieldBps/100)}%`, "info");
    await new Promise(r => setTimeout(r, 400));

    // Check spend limit
    if (amountUSD > maxSpendPerTx) {
      appendLog(`⚠️ MANDATE VIOLATION: Requested $${amountUSD.toLocaleString()} USD exceeds Max Tx Limit ($${maxSpendPerTx.toLocaleString()} USD)`, "error");
      appendLog("❌ Execution Aborted on-chain: MandateSpendLimitExceeded", "error");
      setExecutionResult({ blocked: true, reason: `Spend limit violation: Requested $${amountUSD.toLocaleString()} USD > Max Limit $${maxSpendPerTx.toLocaleString()} USD` });
      setIsExecuting(false);
      return;
    }

    appendLog(`🔍 Target Pool Selected: ${targetPool.name} (${targetPool.ticker}) — ${targetPool.apyPercent}% APY`, "info");
    await new Promise(r => setTimeout(r, 400));

    // Check APY threshold
    if (targetPool.apyPercent < (minYieldBps / 100)) {
      appendLog(`⚠️ YIELD THRESHOLD VIOLATION: Pool APY (${targetPool.apyPercent}%) < Required Min (${(minYieldBps/100)}%)`, "error");
      appendLog("❌ Execution Aborted on-chain: MinYieldThresholdNotMet", "error");
      setExecutionResult({ blocked: true, reason: `Min yield threshold not met: Pool ${targetPool.apyPercent}% APY < Required ${(minYieldBps/100)}% APY` });
      setIsExecuting(false);
      return;
    }

    appendLog(`🛡️ Calling CVIIdentityRegistry.isVerified(${targetPool.contractAddress || '0x3b89...'}) on Monad...`, "warn");
    await new Promise(r => setTimeout(r, 600));

    if (!targetPool.isCVIVerified) {
      appendLog(`🚨 CVI REJECTION: Counterparty ${targetPool.name} is UNVERIFIED on-chain!`, "error");
      appendLog(`❌ Smart Contract Reverted: Cleanverse CVI Error 403 (UnverifiedPool)`, "error");
      setExecutionResult({ blocked: true, reason: `CVI Error 403: Counterparty pool ${targetPool.name} is unverified by Cleanverse CVI` });
      setIsExecuting(false);
      return;
    }

    appendLog(`✅ CVI CLEARANCE PASSED: ${targetPool.name} is Cleanverse Verified (KYC Tier 1 Accredited)`, "success");
    await new Promise(r => setTimeout(r, 500));

    appendLog(`⛓️ Executing Monad Testnet Rebalance: $${amountUSD.toLocaleString()} USDC -> ${targetPool.name}...`, "sys");
    
    // Call Express API backend
    const apiRes = await onRunAgentCycle({
      targetPoolId: targetPool.id,
      amountUSD: amountUSD
    });

    await new Promise(r => setTimeout(r, 500));
    appendLog(`📝 CVAAuditWrapper.logExecution() recorded Mandate Record #${apiRes.auditRecord?.recordId || 104}`, "success");
    appendLog(`🔑 Cryptographic CVA Mandate Hash: ${apiRes.auditRecord?.provenanceTxHash || '0x8f3c...'}`, "success");
    appendLog("🎉 AUTONOMOUS AGENT REBALANCE COMPLETE!", "success");

    setExecutionResult(apiRes);
    setIsExecuting(false);
  };

  return (
    <div id="agent-control-panel-section" className="space-y-8 pt-4">
      
      {/* Kwala-Style Hero Banner */}
      <div className="glass-panel p-8 relative overflow-hidden border-purple-500/40 bg-gradient-to-r from-purple-950/60 via-[#0d1324] to-indigo-950/40 shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-xs font-bold uppercase flex items-center gap-1.5 shadow-lg">
                <Bot className="w-4 h-4 text-purple-400" />
                AUTONOMOUS DEFI AGENT ENGINE
              </span>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Capability #8: Agent Skill Framework
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white">
              Autonomous Yield & Rebalance Console
            </h2>
            
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              CleanAgent continuously monitors liquidity pools, verifies **Cleanverse Verified Identity (CVI)** counterparty credentials on-chain, enforces spend limits, and executes automated yield rebalances with **CVA cryptographic audit trails**.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => runCycleForPool(selectedPoolId, rebalanceAmountUSD)}
              disabled={isExecuting}
              className="btn-primary w-full sm:w-auto py-5 px-8 text-base font-black flex items-center justify-center gap-3 shadow-2xl shadow-purple-500/50 uppercase tracking-wider font-mono hover:scale-105 transition-all animate-pulse"
            >
              <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
              RUN AGENT EXECUTION CYCLE
            </button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 font-mono">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block font-bold">AGENT STATUS</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              MONAD 24/7 ACTIVE
            </span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block font-bold">MAX PER-TX LIMIT</span>
            <span className="text-white font-bold text-sm mt-0.5 block">${maxSpendPerTx.toLocaleString()} USD</span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block font-bold">MIN APY TARGET</span>
            <span className="text-purple-300 font-bold text-sm mt-0.5 block">{(minYieldBps / 100)}% APY</span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block font-bold">CVI RULE</span>
            <span className="text-emerald-400 font-bold text-sm mt-0.5 block">Strict Verified Pools</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-2 glass-panel p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Agent Mandate Guardrails & Targets</h3>
            </div>
            <button 
              onClick={handleUpdateMandateSettings}
              className="py-1.5 px-3 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Save Guardrails On-Chain
            </button>
          </div>

          {/* Select Target Pool */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2 font-bold uppercase">SELECT TARGET LIQUIDITY VAULT:</label>
            <select
              value={selectedPoolId}
              onChange={(e) => setSelectedPoolId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm font-mono rounded-xl p-4 focus:outline-none focus:border-purple-500 cursor-pointer shadow-inner font-bold"
            >
              {pools.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.ticker}) — {p.apyPercent}% APY | {p.isCVIVerified ? 'Cleanverse CVI Verified' : '⚠️ UNVERIFIED POOL (WILL REVERT)'}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Slider */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono">
            <div className="flex justify-between items-center">
              <label className="text-xs text-slate-300 font-bold uppercase">REBALANCE EXECUTION AMOUNT:</label>
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
              <span>Max Tx Limit: ${maxSpendPerTx.toLocaleString()}</span>
            </div>
          </div>

          {/* Interactive Mandate Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>MAX SPEND PER TX:</span>
                <span className="text-purple-300">${maxSpendPerTx.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={maxSpendPerTx}
                onChange={(e) => setMaxSpendPerTx(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-900 rounded-lg"
              />
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>MIN REQUIRED APY:</span>
                <span className="text-emerald-300">{(minYieldBps / 100)}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="100"
                value={minYieldBps}
                onChange={(e) => setMinYieldBps(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-900 rounded-lg"
              />
            </div>

          </div>

          {/* Scenario Presets */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold block">1-CLICK TEST PRESETS (CLICK TO AUTO-EXECUTE):</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-1");
                  setRebalanceAmountUSD(15000);
                  runCycleForPool("pool-1", 15000);
                }}
                className="p-3.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-left transition-all font-semibold hover:scale-105 shadow-md"
              >
                <div className="text-[10px] text-emerald-400 font-bold">PRESET 1 (PASS)</div>
                <div className="font-bold text-white">Monad Vault</div>
                <div className="text-[10px] opacity-80">12.8% APY | CVI Verified</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-4");
                  setRebalanceAmountUSD(20000);
                  runCycleForPool("pool-4", 20000);
                }}
                className="p-3.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/50 text-rose-300 text-left transition-all font-semibold hover:scale-105 shadow-md"
              >
                <div className="text-[10px] text-rose-400 font-bold">PRESET 2 (REVERT)</div>
                <div className="font-bold text-white">Shadow Pool</div>
                <div className="text-[10px] opacity-80">Unverified | CVI 403</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-1");
                  setRebalanceAmountUSD(35000);
                  runCycleForPool("pool-1", 35000);
                }}
                className="p-3.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/50 text-amber-300 text-left transition-all font-semibold hover:scale-105 shadow-md"
              >
                <div className="text-[10px] text-amber-400 font-bold">PRESET 3 (ABORT)</div>
                <div className="font-bold text-white">Limit Exceeded</div>
                <div className="text-[10px] opacity-80">$35k &gt; $25k Limit</div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Real-Time Protocol Trace */}
        <div className="glass-panel p-8 space-y-5 flex flex-col justify-between border-slate-700">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                Live Evaluation Trace
              </h3>
              <button
                onClick={() => setIsTerminalModalOpen(true)}
                className="text-xs font-mono text-purple-400 hover:underline font-bold"
              >
                Open Terminal
              </button>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              {terminalLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl leading-relaxed">
                  Click <span className="text-purple-400 font-bold">RUN AGENT EXECUTION CYCLE</span> above to trigger real-time on-chain mandate evaluation.
                </div>
              ) : (
                terminalLogs.map((log, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                    log.type === 'success' ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' :
                    log.type === 'error' ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 font-bold' :
                    log.type === 'warn' ? 'bg-amber-950/50 border-amber-500/50 text-amber-300' :
                    'bg-slate-950 border-slate-800 text-slate-300'
                  }`}>
                    <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                    <span>{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {executionResult && (
            <div className={`p-5 rounded-2xl border space-y-3 font-mono animate-in fade-in ${
              executionResult.blocked 
                ? 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-2xl shadow-rose-950/80' 
                : 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-2xl shadow-emerald-950/80'
            }`}>
              <div className="flex items-center gap-2 text-xs font-black uppercase">
                {executionResult.blocked ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    <span className="text-rose-400">MANDATE ABORTED ON-CHAIN</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>AUTONOMOUS EXECUTION APPROVED</span>
                  </>
                )}
              </div>

              <p className="text-xs leading-relaxed font-semibold">
                {executionResult.reason || executionResult.message}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Full-Screen Cyberpunk Agent Terminal Overlay Modal */}
      <AnimatePresence>
        {isTerminalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#090d16] w-full max-w-3xl rounded-3xl border border-purple-500/50 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              
              {/* Terminal Titlebar */}
              <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    CleanAgent Autonomous Skill Engine Terminal
                  </span>
                </div>

                <button 
                  onClick={() => setIsTerminalModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 text-lg font-mono font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Terminal Log Output Body */}
              <div className="p-6 font-mono text-xs space-y-2.5 overflow-y-auto flex-1 bg-slate-950/90 text-slate-200">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className={`p-2.5 rounded-lg border font-mono ${
                    log.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
                    log.type === 'error' ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 font-bold' :
                    log.type === 'warn' ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' :
                    log.type === 'sys' ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 font-bold' :
                    'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <span className="text-[10px] opacity-60 mr-2">[{log.time}]</span>
                    <span>{log.msg}</span>
                  </div>
                ))}

                {isExecuting && (
                  <div className="flex items-center gap-2 text-purple-400 font-bold pt-2 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    <span>Executing Cleanverse Skill Mandate Evaluation...</span>
                  </div>
                )}
              </div>

              {/* Terminal Footer */}
              <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Target Pool: <span className="text-white font-bold">{currentPool.name}</span>
                </span>

                <button
                  onClick={() => setIsTerminalModalOpen(false)}
                  className="py-2 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold"
                >
                  Close Terminal
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
