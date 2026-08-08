import React, { useState } from 'react';
import { FileText, Copy, Check, ExternalLink } from 'lucide-react';

export default function SummaryModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const summaryText = `# 🏰 EstateKey — One-Page Protocol & Submission Summary

Project Name: EstateKey  
Submission Email: isaac@cleanverse.com  
Deployed Chain(s): Cleanverse EVM Testnet, Base Sepolia, Ethereum Mainnet  

1. 🎯 Problem Statement
Real-World Assets (real estate, commercial property, debt instruments) are historically illiquid and difficult to trade in fractional pieces. While Web3 tokenization promises 24/7 liquidity, it creates a massive regulatory barrier: securities laws require that only verified and accredited investors hold fractional equity in real-world assets. Traditional ERC-20 or NFT tokens have no concept of recipient identity, allowing any unverified wallet to hold restricted shares.

2. 💡 Solution Overview — EstateKey
EstateKey solves real estate RWA compliance at the protocol level using Cleanverse infrastructure:
- Fractional Share Tokenization: Property equity is split into on-chain shares ($500,000 house -> 10,000 shares @ $50/share).
- Protocol-Enforced Identity Compliance: Before any transfer occurs, the smart contract queries Cleanverse Verified Identity (CVI) credentials on-chain.
- Automated On-Chain Guardrails: If an unverified or non-accredited wallet attempts to receive shares, the smart contract automatically reverts the transaction with a CVI Error 403.
- Immutable Asset Provenance: Every mint, transfer, and blocked compliance attempt is logged to the Cleanverse Verified Assets (CVA) audit ledger with a cryptographic hash.

3. ⚙️ CVI & CVA Integration Points
- CVI Identity Registry (CVIIdentityRegistry.sol): Stores on-chain KYC tiers, accredited investor status, country jurisdiction codes, and cryptographic CVI certificate hashes.
- CVI Guardrail Hook (EstateKeyPropertyToken.sol): Implements _validateCompliance(from, to, amount) transfer hook. Reverts instantly if recipient fails compliance.
- CVA Audit Ledger (CVAAuditWrapper.sol): Cryptographically logs CVATransferLogged for compliant transfers and CVAComplianceBlocked for rejected attempts with provenance hashes.
- Live Telemetry & API (server/index.js): Express API backend providing real-time compliance evaluation endpoints and live audit trail indexing.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl p-6 space-y-4 border-sky-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white">One-Page Protocol & Submission Summary</h3>
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
