import React from 'react';
import { Layers, ShieldCheck, ShieldAlert, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function AgentAuditExplorer({ auditLogs }) {
  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Cleanverse CVA Mandate Provenance Ledger</h2>
          <p className="text-sm text-slate-400">Immutable audit log of all autonomous agent mandate executions, spend limit checks, and CVI violations.</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
          Cleanverse CVA Protocol
        </span>
      </div>

      <div className="glass-panel p-6 border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-2">RECORD ID</th>
                <th className="py-3 px-2">STATUS</th>
                <th className="py-3 px-2">TARGET POOL</th>
                <th className="py-3 px-2">ACTION TYPE</th>
                <th className="py-3 px-2">AMOUNT</th>
                <th className="py-3 px-2 text-right">PROVENANCE TX HASH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map(a => (
                <tr key={a.id} className="hover:bg-slate-900/50">
                  <td className="py-3 px-2 font-bold text-slate-400">#{a.recordId}</td>
                  <td className="py-3 px-2">
                    {a.isSuccessful ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        COMPLIANT
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        BLOCKED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 font-bold text-white">{a.poolName}</td>
                  <td className="py-3 px-2 text-purple-300 font-semibold">{a.actionType}</td>
                  <td className="py-3 px-2 font-bold text-emerald-400">${a.amountUSD.toLocaleString()} USD</td>
                  <td className="py-3 px-2 text-right text-sky-400 truncate max-w-[140px] font-mono">{a.provenanceTxHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
