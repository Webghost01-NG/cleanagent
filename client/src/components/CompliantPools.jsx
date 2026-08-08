import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, ExternalLink, Zap } from 'lucide-react';

export default function CompliantPools({ pools, mandate }) {
  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-white">Target DeFi Yield Pools</h2>
        <p className="text-sm text-slate-400">Liquidity pools evaluated by CleanAgent. Pools marked with CVI pass compliance verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pools.map((pool) => {
          const meetsYieldReq = pool.apyPercent >= (mandate.minRequiredYieldBps / 100);
          const isCompliant = pool.isCVIVerified && meetsYieldReq;

          return (
            <div key={pool.id} className={`glass-panel p-6 space-y-4 flex flex-col justify-between border ${
              pool.isCVIVerified ? 'border-emerald-500/30' : 'border-rose-500/40 bg-rose-950/10'
            }`}>
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                      {pool.ticker}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{pool.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{pool.network} — {pool.protocol}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono block">
                      {pool.apyPercent}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">ANNUAL YIELD APY</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">TOTAL TVL:</span>
                    <span className="text-white font-bold">${pool.totalTVLUSD.toLocaleString()} USD</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">RISK RATING:</span>
                    <span className={pool.isCVIVerified ? 'text-sky-400 font-bold' : 'text-rose-400 font-bold'}>
                      {pool.riskRating}
                    </span>
                  </div>
                </div>

                {/* CVI Status Callout */}
                <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  pool.isCVIVerified 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}>
                  <span className="flex items-center gap-1.5 font-bold">
                    {pool.isCVIVerified ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Cleanverse CVI Verified Pool
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        Unverified Pool (Agent Rejects)
                      </>
                    )}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {pool.cviCertificateHash}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">POOL ADDRESS:</span>
                <span className="text-slate-200">{pool.poolAddress.slice(0, 10)}...</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
