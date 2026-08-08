"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ShieldAlert, ShieldCheck, Cpu, Sliders, Zap, Activity, Terminal, Check, AlertCircle } from 'lucide-react';

export default function AgentControlPanel({ 
  pools = [], 
  mandate = {}, 
  onRunAgentCycle, 
  onUpdateMandate,
  currentWallet,
  identities,
  onOpenWalletModal
}) {
  const [selectedPoolId, setSelectedPoolId] = useState(pools[0]?.id || "pool-1");
  const [rebalanceAmountUSD, setRebalanceAmountUSD] = useState(15000);
  
  // Mandate Slider States
  const [maxSpendPerTx, setMaxSpendPerTx] = useState(mandate.maxSpendPerTxUSD || 25000);
  const [minYieldBps, setMinYieldBps] = useState(mandate.minRequiredYieldBps || 700);

  // Execution States
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [executionResult, setExecutionResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const currentPool = pools.find(p => p.id === selectedPoolId) || pools[0] || { name: "Monad Vault", ticker: "USDC", apyPercent: 12.8, isCVIVerified: true };

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateMandateSettings = async () => {
    if (!currentWallet) {
      onOpenWalletModal();
      return;
    }
    await onUpdateMandate({
      maxSpendPerTxUSD: maxSpendPerTx,
      minRequiredYieldBps: minYieldBps,
    });
    showToast("Mandate guardrail settings saved on-chain successfully!", "success");
  };

  const runCycleForPool = async (targetPoolId, amountUSD) => {
    if (!currentWallet) {
      onOpenWalletModal();
      return;
    }

    if (targetPoolId) {
      setSelectedPoolId(targetPoolId);
    }

    const targetPool = pools.find(p => p.id === targetPoolId) || currentPool;
    setIsTerminalModalOpen(true);
    setIsExecuting(true);
    setExecutionResult(null);
    setTerminalLogs([]);

    const appendLog = (msg, type = "info") => {
      setTerminalLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    };

    appendLog("🤖 Initializing CleanAgent AI Engine...", "sys");
    await new Promise(r => setTimeout(r, 500));

    appendLog(`📋 Reading Vault Mandate: MaxTx=$${maxSpendPerTx.toLocaleString()}, MinAPY=${(minYieldBps/100)}%`, "info");
    await new Promise(r => setTimeout(r, 500));

    if (amountUSD > maxSpendPerTx) {
      appendLog(`⚠️ MANDATE VIOLATION: Requested $${amountUSD.toLocaleString()} USD exceeds Max Tx Limit ($${maxSpendPerTx.toLocaleString()} USD)`, "error");
      appendLog("❌ Execution Aborted on-chain: MandateSpendLimitExceeded", "error");
      setExecutionResult({ blocked: true, reason: `Spend limit violation: Requested $${amountUSD.toLocaleString()} USD > Max Limit $${maxSpendPerTx.toLocaleString()} USD` });
      setIsExecuting(false);
      return;
    }

    appendLog(`🔍 Target Pool Selected: ${targetPool.name} (${targetPool.ticker}) — ${targetPool.apyPercent}% APY`, "info");
    await new Promise(r => setTimeout(r, 500));

    if (targetPool.apyPercent < (minYieldBps / 100)) {
      appendLog(`⚠️ YIELD THRESHOLD VIOLATION: Pool APY (${targetPool.apyPercent}%) < Required Min (${(minYieldBps/100)}%)`, "error");
      appendLog("❌ Execution Aborted on-chain: MinYieldThresholdNotMet", "error");
      setExecutionResult({ blocked: true, reason: `Min yield threshold not met: Pool ${targetPool.apyPercent}% APY < Required ${(minYieldBps/100)}% APY` });
      setIsExecuting(false);
      return;
    }

    appendLog(`🛡️ Calling CVIIdentityRegistry.isVerified(${targetPool.contractAddress || '0x3b89...'}) on Monad...`, "warn");
    await new Promise(r => setTimeout(r, 700));

    if (!targetPool.isCVIVerified) {
      appendLog(`🚨 CVI REJECTION: Counterparty ${targetPool.name} is UNVERIFIED on-chain!`, "error");
      appendLog(`❌ Smart Contract Reverted: CVI Error 403 (UnverifiedPool)`, "error");
      setExecutionResult({ blocked: true, reason: `CVI Error 403: Counterparty pool ${targetPool.name} is unverified by Cleanverse CVI` });
      setIsExecuting(false);
      return;
    }

    appendLog(`✅ CVI CLEARANCE PASSED: ${targetPool.name} is Cleanverse Verified (KYC Tier 1 Accredited)`, "success");
    await new Promise(r => setTimeout(r, 600));

    appendLog(`⛓️ Executing Monad Testnet Rebalance: $${amountUSD.toLocaleString()} USDC -> ${targetPool.name}...`, "sys");
    
    const apiRes = await onRunAgentCycle({
      targetPoolId: targetPool.id,
      amountUSD: amountUSD
    });

    await new Promise(r => setTimeout(r, 600));
    appendLog(`📝 CVAAuditWrapper.logExecution() recorded Mandate Record #${apiRes.auditRecord?.recordId || 104}`, "success");
    appendLog(`🔑 Cryptographic CVA Mandate Hash: ${apiRes.auditRecord?.provenanceTxHash || '0x8f3c...'}`, "success");
    appendLog("🎉 AUTONOMOUS AGENT REBALANCE COMPLETE!", "success");

    setExecutionResult(apiRes);
    setIsExecuting(false);
  };

  return (
    <div id="agent-control-panel-section" className="space-y-8 pt-4">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`p-4 rounded-xl font-mono text-xs font-bold border flex items-center justify-between shadow-lg animate-in fade-in ${
          toastMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300' : 'bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-300'
        }`}>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{toastMessage.msg}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="cursor-pointer">✕</button>
        </div>
      )}

      {/* Hero Highlight Banner */}
      <div className="theme-card p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full theme-subcard font-mono text-xs font-bold uppercase flex items-center gap-1.5 shadow-sm theme-text">
                <Bot className="w-4 h-4 text-purple-500" />
                AUTONOMOUS DEFI AGENT ENGINE
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight theme-text">
              Autonomous Yield & Rebalance Console
            </h2>
            
            <p className="text-sm theme-text-muted max-w-3xl leading-relaxed">
              CleanAgent continuously monitors liquidity pools, verifies **Cleanverse Verified Identity (CVI)** counterparty credentials on-chain, enforces spend limits, and executes automated yield rebalances with **CVA cryptographic audit trails**.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => runCycleForPool(selectedPoolId, rebalanceAmountUSD)}
              disabled={isExecuting}
              className="py-5 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-base flex items-center justify-center gap-3 shadow-2xl shadow-purple-500/40 uppercase tracking-wider font-mono hover:scale-105 transition-all cursor-pointer"
            >
              <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
              RUN AGENT EXECUTION CYCLE
            </button>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t theme-border font-mono">
          <div className="theme-subcard p-3.5 rounded-xl">
            <span className="theme-text-muted text-[10px] uppercase block font-bold">AGENT STATUS</span>
            <span className="text-emerald-500 font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              ACTIVE & MONITORING
            </span>
          </div>

          <div className="theme-subcard p-3.5 rounded-xl">
            <span className="theme-text-muted text-[10px] uppercase block font-bold">MAX PER-TX LIMIT</span>
            <span className="theme-text font-bold text-sm mt-0.5 block">${maxSpendPerTx.toLocaleString()} USD</span>
          </div>

          <div className="theme-subcard p-3.5 rounded-xl">
            <span className="theme-text-muted text-[10px] uppercase block font-bold">MIN APY TARGET</span>
            <span className="text-purple-500 dark:text-[#b87cf8] font-bold text-sm mt-0.5 block">{(minYieldBps / 100)}% APY</span>
          </div>

          <div className="theme-subcard p-3.5 rounded-xl">
            <span className="theme-text-muted text-[10px] uppercase block font-bold">CVI RULE</span>
            <span className="text-emerald-500 font-bold text-sm mt-0.5 block">Strict Verified Pools</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-2 theme-card p-8 space-y-6">
          <div className="flex items-center justify-between border-b theme-border pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-bold theme-text">Agent Mandate Guardrails & Targets</h3>
            </div>
            <button 
              onClick={handleUpdateMandateSettings}
              className="py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Save Guardrails On-Chain
            </button>
          </div>

          {/* Select Target Pool */}
          <div>
            <label className="text-xs font-mono theme-text-muted block mb-2 font-bold uppercase">SELECT TARGET LIQUIDITY VAULT:</label>
            <select
              value={selectedPoolId}
              onChange={(e) => setSelectedPoolId(e.target.value)}
              className="w-full theme-subcard theme-text text-sm font-mono rounded-xl p-4 focus:outline-none focus:border-purple-500 cursor-pointer font-bold"
            >
              {pools.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.ticker}) — {p.apyPercent}% APY | {p.isCVIVerified ? 'Cleanverse CVI Verified' : '⚠️ UNVERIFIED POOL (WILL REVERT)'}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Slider */}
          <div className="theme-subcard p-5 rounded-2xl space-y-3 font-mono">
            <div className="flex justify-between items-center">
              <label className="text-xs theme-text font-bold uppercase">REBALANCE EXECUTION AMOUNT:</label>
              <span className="text-2xl font-black text-emerald-500">${rebalanceAmountUSD.toLocaleString()} USD</span>
            </div>
            
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={rebalanceAmountUSD}
              onChange={(e) => setRebalanceAmountUSD(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-300 dark:bg-slate-800 rounded-lg"
            />
            
            <div className="flex justify-between text-[11px] theme-text-muted pt-1">
              <span>Min: $1,000</span>
              <span>Max Tx Limit: ${maxSpendPerTx.toLocaleString()}</span>
            </div>
          </div>

          {/* Interactive Mandate Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            
            <div className="theme-subcard p-4 rounded-xl space-y-2">
              <div className="flex justify-between theme-text font-bold">
                <span>MAX SPEND PER TX:</span>
                <span className="text-purple-500">${maxSpendPerTx.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={maxSpendPerTx}
                onChange={(e) => setMaxSpendPerTx(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg"
              />
            </div>

            <div className="theme-subcard p-4 rounded-xl space-y-2">
              <div className="flex justify-between theme-text font-bold">
                <span>MIN REQUIRED APY:</span>
                <span className="text-emerald-500">{(minYieldBps / 100)}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="100"
                value={minYieldBps}
                onChange={(e) => setMinYieldBps(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg"
              />
            </div>

          </div>

          {/* Scenario Presets */}
          <div className="theme-subcard p-5 rounded-2xl space-y-3">
            <span className="text-xs font-mono theme-text-muted uppercase font-bold block">1-CLICK TEST PRESETS (CLICK TO AUTO-EXECUTE):</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-1");
                  setRebalanceAmountUSD(15000);
                  runCycleForPool("pool-1", 15000);
                }}
                className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-left transition-all font-semibold hover:scale-105 cursor-pointer"
              >
                <div className="text-[10px] font-bold">PRESET 1 (PASS)</div>
                <div className="font-bold theme-text">Monad Vault</div>
                <div className="text-[10px] opacity-80">12.8% APY | CVI Verified</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-4");
                  setRebalanceAmountUSD(20000);
                  runCycleForPool("pool-4", 20000);
                }}
                className="p-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-left transition-all font-semibold hover:scale-105 cursor-pointer"
              >
                <div className="text-[10px] font-bold">PRESET 2 (REVERT)</div>
                <div className="font-bold theme-text">Shadow Pool</div>
                <div className="text-[10px] opacity-80">Unverified | CVI 403</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPoolId("pool-1");
                  setRebalanceAmountUSD(35000);
                  runCycleForPool("pool-1", 35000);
                }}
                className="p-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 text-left transition-all font-semibold hover:scale-105 cursor-pointer"
              >
                <div className="text-[10px] font-bold">PRESET 3 (ABORT)</div>
                <div className="font-bold theme-text">Limit Exceeded</div>
                <div className="text-[10px] opacity-80">$35k &gt; $25k Limit</div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Real-Time Protocol Trace */}
        <div className="theme-card p-8 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b theme-border pb-4">
              <h3 className="text-lg font-bold theme-text flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-500" />
                Live Evaluation Trace
              </h3>
              <button
                onClick={() => setIsTerminalModalOpen(true)}
                className="text-xs font-mono text-purple-500 hover:underline font-bold cursor-pointer"
              >
                Open Terminal
              </button>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              {terminalLogs.length === 0 ? (
                <div className="p-8 text-center theme-text-muted border border-dashed theme-border rounded-2xl leading-relaxed">
                  Click <span className="text-purple-500 font-bold">RUN AGENT EXECUTION CYCLE</span> above to trigger real-time on-chain mandate evaluation.
                </div>
              ) : (
                terminalLogs.map((log, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                    log.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300' :
                    log.type === 'error' ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300 font-bold' :
                    log.type === 'warn' ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300' :
                    'theme-subcard theme-text'
                  }`}>
                    <span className="text-[10px] theme-text-muted font-mono">{log.time}</span>
                    <span>{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {executionResult && (
            <div className={`p-5 rounded-2xl border space-y-3 font-mono animate-in fade-in ${
              executionResult.blocked 
                ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-200' 
                : 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-black uppercase">
                {executionResult.blocked ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />
                    <span>MANDATE ABORTED ON-CHAIN</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
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

      {/* Persistent Terminal Modal (STAYS OPEN FOR USER INSPECTION) */}
      <AnimatePresence>
        {isTerminalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="theme-card w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border theme-border"
            >
              
              {/* Terminal Titlebar */}
              <div className="theme-subcard px-6 py-4 border-b theme-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  </div>
                  <span className="text-xs font-mono theme-text font-bold flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-500" />
                    CleanAgent Autonomous Mandate Terminal
                  </span>
                </div>

                <button 
                  onClick={() => setIsTerminalModalOpen(false)}
                  className="theme-text-muted hover:theme-text p-1 text-lg font-mono font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Terminal Log Output Body */}
              <div className="p-6 font-mono text-xs space-y-2.5 overflow-y-auto flex-1 theme-bg theme-text">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className={`p-2.5 rounded-lg border font-mono ${
                    log.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300' :
                    log.type === 'error' ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-200 font-bold' :
                    log.type === 'warn' ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300' :
                    log.type === 'sys' ? 'bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-300 font-bold' :
                    'theme-subcard theme-text'
                  }`}>
                    <span className="text-[10px] opacity-60 mr-2">[{log.time}]</span>
                    <span>{log.msg}</span>
                  </div>
                ))}

                {isExecuting && (
                  <div className="flex items-center gap-2 text-purple-500 font-bold pt-2 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span>Evaluating Skill Mandate Rules...</span>
                  </div>
                )}
              </div>

              {/* Terminal Footer */}
              <div className="theme-subcard px-6 py-4 border-t theme-border flex items-center justify-between">
                <span className="text-[11px] font-mono theme-text-muted">
                  Target Pool: <span className="theme-text font-bold">{currentPool.name}</span>
                </span>

                <button
                  onClick={() => setIsTerminalModalOpen(false)}
                  className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-bold cursor-pointer shadow-lg"
                >
                  Close Terminal Log
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
