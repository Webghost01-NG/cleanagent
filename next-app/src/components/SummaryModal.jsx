"use client";
import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';

export default function SummaryModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const summaryText = `# 🤖 CleanAgent Protocol — One-Page Protocol & Submission Summary

Project Name: CleanAgent Protocol  
Hackathon Track: Track 02 — Compliant DeFi  
Submission Email: isaac@cleanverse.com  
Cleanverse Primitive: Cleanverse Capability #8 (Agent Skill Framework)  
Deployed Chain(s): Monad Protocol Testnet, Cleanverse EVM Testnet, Base Mainnet, Arbitrum One  

1. 🎯 Problem Statement
DeFi yield farming and automated liquidity management are complex, manual, and exposed to severe compliance risks. Existing AI yield bots run blindly without checking regulatory compliance, risking funds in unverified or sanctioned liquidity pools. Standard Web3 protocols cannot enforce programmable mandates or counterparty identity verification before an autonomous agent executes a trade or deposit on-chain.

2. 💡 Solution Overview — CleanAgent Protocol
CleanAgent Protocol is an Autonomous Compliant DeFi & Yield Management Engine built directly on Cleanverse Capability #8 (Agent Skill Framework):
- Programmable Agent Mandates: Users define spend limits (max $25,000/tx), target APY yield thresholds (min 7.00% APY), and counterparty compliance rules for their AI agent.
- CVI Counterparty Validation: Before executing any automated deposit or rebalance, the Agent queries Cleanverse Verified Identity (CVI) credentials on-chain.
- Automated On-Chain Guardrails: If a target pool is unverified or non-compliant, the Agent automatically aborts execution on-chain with a CVI Error 403.
- Immutable Mandate Audit Provenance: Every autonomous trade, spend control limit, and mandate cycle is logged to Cleanverse Verified Assets (CVA) with a cryptographic mandate hash.

3. ⚙️ CVI & CVA Integration Points
- Capability #8 (Agent Skill Framework): CleanAgentVault.sol enforces programmable mandate parameters, daily spend caps, and autonomous execution logic.
- Cleanverse Verified Identity (CVI): CVIIdentityRegistry.sol on-chain attestation registry queries cviRegistry.isVerified(pool) before executing any agent rebalance.
- Cleanverse Verified Assets (CVA): CVAAuditWrapper.sol logs CVAExecutionLogged for all compliant rebalances and blocked CVI violations with cryptographic provenance hashes.
- REST Telemetry API: server/index.js (/api/agent/run) serves live yield pool telemetry and agent execution triggers.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl p-6 space-y-4 border-purple-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">One-Page Submission Summary</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300">
          This summary is formatted for your hackathon submission email to <span className="text-emerald-400 font-mono font-bold">isaac@cleanverse.com</span>.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
          {summaryText}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-slate-400">
            Saved at: <span className="text-slate-200">ONE_PAGE_SUMMARY.md</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Summary!' : 'Copy Summary Text'}
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
