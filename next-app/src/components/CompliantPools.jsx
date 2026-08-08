"use client";
import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Zap, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function CompliantPools({ pools, mandate, onSelectPoolForRebalance }) {
  const [filter, setFilter] = useState('all');

  const filteredPools = pools.filter(p => {
    if (filter === 'cvi') return p.isCVIVerified;
    if (filter === 'unverified') return !p.isCVIVerified;
    return true;
  });

  return (
    <div className="space-y-8 pt-4">
      
      {/* Header Banner */}
      <div className="theme-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              CVI COUNTERPARTY MONITORING
            </span>
          </div>
          <h2 className="text-3xl font-black theme-text">Target DeFi Yield Vaults & Compliance Ratings</h2>
          <p className="text-sm theme-text-muted">
            CleanAgent automatically queries **Cleanverse Verified Identity (CVI)** attestation contracts before rebalancing into any liquidity pool.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 theme-subcard p-1.5 rounded-xl border theme-border text-xs font-mono font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filter === 'all' ? 'bg-purple-600 text-white shadow-md' : 'theme-text-muted hover:theme-text'}`}
          >
            All Pools ({pools.length})
          </button>
          <button
            onClick={() => setFilter('cvi')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filter === 'cvi' ? 'bg-emerald-600 text-white shadow-md' : 'theme-text-muted hover:theme-text'}`}
          >
            CVI Verified ({pools.filter(p=>p.isCVIVerified).length})
          </button>
          <button
            onClick={() => setFilter('unverified')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${filter === 'unverified' ? 'bg-rose-600 text-white shadow-md' : 'theme-text-muted hover:theme-text'}`}
          >
            Unverified ({pools.filter(p=>!p.isCVIVerified).length})
          </button>
        </div>
      </div>

      {/* Yield Pool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool) => (
          <div 
            key={pool.id}
            className={`theme-card p-6 space-y-5 flex flex-col justify-between transition-all hover:scale-[1.02] ${
              pool.isCVIVerified ? 'hover:border-emerald-500' : 'hover:border-rose-500 border-rose-500/30'
            }`}
          >
            <div className="space-y-4">
              
              {/* Pool Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">{pool.chain}</span>
                    <span className="text-xs font-mono theme-text-muted">•</span>
                    <span className="text-xs font-mono theme-text-muted">{pool.protocol}</span>
                  </div>
                  <h3 className="text-xl font-bold theme-text mt-0.5">{pool.name}</h3>
                </div>

                {pool.isCVIVerified ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    CVI VERIFIED
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    UNVERIFIED
                  </span>
                )}
              </div>

              {/* APY & TVL Highlight */}
              <div className="theme-subcard p-4 rounded-xl flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] theme-text-muted uppercase block">ESTIMATED YIELD</span>
                  <span className="text-2xl font-black text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    {pool.apyPercent}% <span className="text-xs theme-text-muted font-normal">APY</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] theme-text-muted uppercase block">POOL TVL</span>
                  <span className="text-base font-bold theme-text">${(pool.tvlUSD / 1000000).toFixed(1)}M</span>
                </div>
              </div>

              {/* Risk & Rules details */}
              <div className="space-y-2 text-xs font-mono theme-text">
                <div className="flex justify-between py-1 border-b theme-border">
                  <span className="theme-text-muted">Risk Assessment:</span>
                  <span className={`font-bold ${pool.riskRating === 'Low Risk' ? 'text-emerald-500' : pool.riskRating === 'Medium Risk' ? 'text-amber-500' : 'text-rose-500'}`}>
                    {pool.riskRating}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b theme-border">
                  <span className="theme-text-muted">Compliance Requirement:</span>
                  <span className="font-bold theme-text">{pool.complianceTier}</span>
                </div>
              </div>

            </div>

            {/* Action CTA */}
            <button
              onClick={() => {
                if (onSelectPoolForRebalance) onSelectPoolForRebalance(pool.id);
              }}
              className={`w-full py-3 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                pool.isCVIVerified 
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
              }`}
            >
              <Zap className="w-4 h-4" />
              {pool.isCVIVerified ? 'Test Compliant Rebalance' : 'Test CVI 403 Revert'}
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
