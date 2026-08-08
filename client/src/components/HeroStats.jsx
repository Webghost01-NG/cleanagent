import React from 'react';
import { Building2, ShieldAlert, ShieldCheck, CheckCircle2, TrendingUp, Lock } from 'lucide-react';

export default function HeroStats({ stats }) {
  if (!stats) return null;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total RWA Value */}
        <div className="glass-panel p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-16 h-16 text-sky-400" />
          </div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">TOTAL RWA VALUATION</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              ${stats.totalValuationUSD?.toLocaleString() || '2,550,000'}
            </h3>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Tokenized Across {stats.totalProperties || 3} Premier Real Estate Assets</p>
        </div>

        {/* CVI Verified Identities */}
        <div className="glass-panel p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-16 h-16 text-emerald-400" />
          </div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">CVI VERIFIED INVESTORS</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {stats.verifiedCVIIdentities || 3} / {stats.totalCVIIdentities || 4}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
              Active KYC
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Cleanverse Verified Identity Protocol Credentials</p>
        </div>

        {/* Compliant Rejections (The Core Metric!) */}
        <div className="glass-panel p-5 relative overflow-hidden group border-rose-500/30 bg-rose-950/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Lock className="w-16 h-16 text-rose-400" />
          </div>
          <p className="text-xs font-mono text-rose-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            BLOCKED UNCOMPLIANT TRANSFERS
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-rose-400 font-mono">
              {stats.blockedAttemptsCount || 1}
            </h3>
            <span className="text-xs font-semibold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
              On-Chain Enforcement
            </span>
          </div>
          <p className="text-xs text-rose-300/80 mt-2">Rejected Unverified & Non-Accredited Wallets</p>
        </div>

        {/* Protocol Enforcement Rate */}
        <div className="glass-panel p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-sky-400" />
          </div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">CVA AUDIT COMPLIANCE RATE</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-mono">
              {stats.complianceEnforcementRate || "100.0%"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">Full Immutable Lineage & Provenance Logged</p>
        </div>

      </div>
    </section>
  );
}
