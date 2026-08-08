"use client";
import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Cpu, Layers, Terminal, FileCode, Copy, Check, ExternalLink, Zap, HelpCircle } from 'lucide-react';

export default function DocsView() {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleCurl = `curl -X POST http://localhost:5001/api/agent/run \\
  -H "Content-Type: application/json" \\
  -d '{"targetPoolId": "pool-1", "amountUSD": 15000}'`;

  const sampleSolidity = `// CleanAgentVault.sol - Compliant DeFi Execution Engine
function executeRebalanceMandate(address targetPool, uint256 amountUSD) external nonReentrant {
    require(amountUSD <= mandate.maxSpendPerTxUSD, "Mandate: Spend limit exceeded");
    require(cviRegistry.isVerified(targetPool), "CVI Error 403: Unverified pool counterparty");
    
    // Execute deposit & log CVA audit
    IERC20(usdc).transfer(targetPool, amountUSD);
    cvaWrapper.logAgentExecution(msg.sender, targetPool, amountUSD);
}`;

  return (
    <div className="space-y-8 pt-2">
      
      {/* Docs Header Banner */}
      <div className="theme-card p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full theme-subcard font-mono text-xs font-bold uppercase flex items-center gap-1.5 theme-text">
                <BookOpen className="w-4 h-4 text-purple-500" />
                DEVELOPER SPECIFICATION & USER GUIDE
              </span>
            </div>
            <h2 className="text-3xl font-black theme-text font-sans">CleanAgent Protocol Documentation</h2>
            <p className="text-sm theme-text-muted max-w-2xl">
              Everything you need to know about CleanAgent Protocol — how it works, how to run mandates, and how CVA audit logging operates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Webghost01-NG/cleanagent"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-5 rounded-xl theme-subcard theme-text theme-border border text-xs font-mono font-bold flex items-center gap-2 transition-all hover:border-purple-500"
            >
              <ExternalLink className="w-4 h-4 text-purple-500" />
              GitHub Repository
            </a>
          </div>
        </div>
      </div>

      {/* Docs Navigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="theme-card p-4 space-y-2 font-mono text-xs h-fit">
          <span className="text-[10px] theme-text-muted uppercase tracking-widest font-bold px-3 py-1 block">TABLE OF CONTENTS</span>

          <button
            onClick={() => setActiveSection('overview')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold cursor-pointer ${
              activeSection === 'overview' ? 'nav-tab-active' : 'theme-text-muted hover:theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            1. What is CleanAgent?
          </button>

          <button
            onClick={() => setActiveSection('guide')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold cursor-pointer ${
              activeSection === 'guide' ? 'nav-tab-active' : 'theme-text-muted hover:theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            2. Step-by-Step User Guide
          </button>

          <button
            onClick={() => setActiveSection('audit-explanation')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold cursor-pointer ${
              activeSection === 'audit-explanation' ? 'nav-tab-active' : 'theme-text-muted hover:theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e]'
            }`}
          >
            <Layers className="w-4 h-4" />
            3. What is the Audit Ledger For?
          </button>

          <button
            onClick={() => setActiveSection('contracts')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold cursor-pointer ${
              activeSection === 'contracts' ? 'nav-tab-active' : 'theme-text-muted hover:theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e]'
            }`}
          >
            <FileCode className="w-4 h-4" />
            4. Smart Contracts & API
          </button>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 theme-card p-8 space-y-8">
          
          {/* Section 1: What is CleanAgent? */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b theme-border pb-4">
                <h3 className="text-2xl font-bold theme-text">1. What is CleanAgent Protocol?</h3>
                <p className="text-xs font-mono text-purple-500 mt-1">Autonomous Compliant DeFi & Yield Platform</p>
              </div>

              <div className="space-y-4 text-sm theme-text leading-relaxed font-sans">
                <p>
                  **CleanAgent Protocol** is an autonomous yield management system designed to eliminate regulatory & compliance risks in DeFi trading. Standard yield bots operate blindly, putting user funds into unverified, high-risk, or non-compliant liquidity pools.
                </p>
                <p>
                  CleanAgent solves this by combining **programmable execution mandates** with **Cleanverse Verified Identity (CVI)** and **Cleanverse Verified Assets (CVA)** on-chain guardrails.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="theme-subcard p-4 rounded-xl">
                  <span className="text-purple-500 font-bold block mb-1">Programmable Mandates</span>
                  <span className="theme-text-muted">Enforce per-transaction spend limits & APY targets</span>
                </div>
                <div className="theme-subcard p-4 rounded-xl">
                  <span className="text-emerald-500 font-bold block mb-1">CVI Identity Verification</span>
                  <span className="theme-text-muted">Checks counterparty KYC/AML status before trade</span>
                </div>
                <div className="theme-subcard p-4 rounded-xl">
                  <span className="text-sky-500 font-bold block mb-1">CVA Audit Provenance</span>
                  <span className="theme-text-muted">Immutable cryptographic record of every trade</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: User Guide */}
          {activeSection === 'guide' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b theme-border pb-4">
                <h3 className="text-2xl font-bold theme-text">2. How to Use CleanAgent (Step-by-Step)</h3>
                <p className="text-xs font-mono text-emerald-500 mt-1">Simple 4-Step Protocol Workflow</p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 theme-subcard rounded-xl space-y-1">
                  <span className="text-purple-500 font-bold block">Step 1: Connect Web3 Wallet</span>
                  <p className="theme-text-muted font-sans text-xs">Click "Connect" in the top right to link your MetaMask or Phantom wallet. dApp access is gated to authenticated wallets.</p>
                </div>

                <div className="p-4 theme-subcard rounded-xl space-y-1">
                  <span className="text-purple-500 font-bold block">Step 2: Configure Mandate Guardrails</span>
                  <p className="theme-text-muted font-sans text-xs">Set your **Max Spend Per Tx** limit ($5k - $100k) and **Min APY Target** (1% - 25%). Click "Save Guardrails On-Chain".</p>
                </div>

                <div className="p-4 theme-subcard rounded-xl space-y-1">
                  <span className="text-purple-500 font-bold block">Step 3: Run Execution Cycle</span>
                  <p className="theme-text-muted font-sans text-xs">Click **RUN AGENT EXECUTION CYCLE**. The persistent terminal modal opens, displaying live streaming checks on spend limits, yield thresholds, and CVI clearance.</p>
                </div>

                <div className="p-4 theme-subcard rounded-xl space-y-1">
                  <span className="text-purple-500 font-bold block">Step 4: Inspect Audit Provenance</span>
                  <p className="theme-text-muted font-sans text-xs">Navigate to **Audit Ledger** to view the cryptographic mandate hash and on-chain record for your transaction.</p>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Audit Ledger Explanation */}
          {activeSection === 'audit-explanation' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b theme-border pb-4">
                <h3 className="text-2xl font-bold theme-text">3. What is the Audit Ledger For?</h3>
                <p className="text-xs font-mono text-sky-500 mt-1">Cleanverse Verified Assets (CVA) Provenance Engine</p>
              </div>

              <div className="space-y-4 text-sm theme-text leading-relaxed font-sans">
                <p>
                  The **Audit Ledger** is an immutable, on-chain compliance journal powered by `CVAAuditWrapper.sol`.
                </p>
                <p>
                  Every time CleanAgent executes a yield deposit or blocks a non-compliant pool, a **CVA Audit Record** is generated containing:
                </p>

                <ul className="list-disc pl-6 space-y-2 font-mono text-xs theme-text">
                  <li><strong>Record ID & Block Number</strong>: Chronological transaction sequence on Monad Testnet.</li>
                  <li><strong>Cryptographic Provenance Hash</strong> (`0x8f3c...`): SHA-256 digital signature of the mandate execution.</li>
                  <li><strong>Mandate Rules Evaluated</strong>: Spend limit pass/fail status and APY floor check.</li>
                  <li><strong>CVI Counterparty Attestation</strong>: Verified KYC tier of the destination pool.</li>
                </ul>

                <p className="pt-2">
                  **Why it matters**: Institutional investors, DAOs, and auditors can independently verify that every automated trade strictly adhered to compliance guardrails without trusting off-chain servers.
                </p>
              </div>
            </div>
          )}

          {/* Section 4: Smart Contracts & API */}
          {activeSection === 'contracts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b theme-border pb-4">
                <h3 className="text-2xl font-bold theme-text">4. Smart Contracts & REST API Reference</h3>
                <p className="text-xs font-mono text-amber-500 mt-1">Developer Integration Specifications</p>
              </div>

              <div className="space-y-4">
                <div className="theme-subcard p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-purple-500 font-bold">CleanAgentVault.sol</span>
                    <span className="theme-text-muted">Contract Address: 0x7a83...4e91</span>
                  </div>
                  <p className="text-xs theme-text-muted">Core mandate execution engine enforcing spend limits and calling CVI counterparty checks.</p>
                </div>

                <div className="theme-subcard p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-emerald-500 font-bold">CVIIdentityRegistry.sol</span>
                    <span className="theme-text-muted">Contract Address: 0x3b89...11c2</span>
                  </div>
                  <p className="text-xs theme-text-muted">On-chain attestation registry storing pool verification status (`isVerified`).</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono theme-text-muted font-bold">Solidity Core Method:</span>
                  <button
                    onClick={() => handleCopyCode(sampleSolidity)}
                    className="text-xs font-mono text-purple-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <pre className="theme-subcard p-4 rounded-xl text-xs font-mono text-purple-500 dark:text-[#b87cf8] overflow-x-auto">
                  {sampleSolidity}
                </pre>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
