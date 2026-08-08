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
    <div className="space-y-8 pt-4 font-sans">
      
      {/* Header Banner */}
      <div className="theme-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              CVI COUNTERPARTY MONITORING
            </span>
          </div>
          <h2 className="text-3xl font-black theme-text font-sans">Target DeFi Yield Vaults & Compliance Ratings</h2>
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

      {/* Responsive Widescreen 4-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 font-mono">
        {filteredPools.map((pool) => (
          <div
            key={pool.id}
            className={`theme-card p-6 rounded-2xl border transition-all hover:scale-[1.02] flex flex-col justify-between space-y-6 shadow-xl ${
              pool.isCVIVerified
                ? 'hover:border-emerald-500/50'
                : 'hover:border-rose-500/50 opacity-90'
            }`}
          >
            <div className="space-y-4">
              
              {/* Badge & Chain Header */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                  pool.isCVIVerified
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {pool.isCVIVerified ? (
                    <>
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      CVI VERIFIED
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3 h-3 text-rose-500" />
                      UNVERIFIED
                    </>
                  )}
                </span>

                <span className="text-[10px] theme-text-muted font-bold">
                  {pool.chain}
                </span>
              </div>

              {/* Pool Title & APY */}
              <div>
                <h3 className="text-xl font-black theme-text font-sans">{pool.name}</h3>
                <p className="text-xs theme-text-muted">{pool.protocol}</p>
              </div>

              {/* Metrics Box */}
              <div className="p-4 rounded-xl theme-subcard space-y-2 border theme-border">
                <div className="flex justify-between items-center">
                  <span className="text-xs theme-text-muted flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                    Current APY:
                  </span>
                  <span className="text-xl font-extrabold text-emerald-500">
                    {pool.apyPercent}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="theme-text-muted">Total Liquidity (TVL):</span>
                  <span className="theme-text font-bold">${(pool.tvlUSD / 1000000).toFixed(1)}M USD</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="theme-text-muted">Compliance Tier:</span>
                  <span className="theme-text font-bold">{pool.complianceTier}</span>
                </div>
              </div>

              {/* Contract Address Snippet */}
              <div className="text-[10px] theme-text-muted flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                <span>Contract Address:</span>
                <span className="font-mono text-purple-600 dark:text-[#b87cf8] font-bold">
                  {pool.contractAddress?.slice(0, 6)}...{pool.contractAddress?.slice(-4)}
                </span>
              </div>

            </div>

            {/* Rebalance CTA Button */}
            <button
              onClick={() => onSelectPoolForRebalance(pool.id)}
              className={`w-full py-3.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                pool.isCVIVerified
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02]'
                  : 'bg-rose-600/20 text-rose-500 border border-rose-500/30 hover:bg-rose-600 hover:text-white'
              }`}
            >
              <span>{pool.isCVIVerified ? 'Select For Rebalance' : 'Attempt Rebalance (Will Revert)'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
