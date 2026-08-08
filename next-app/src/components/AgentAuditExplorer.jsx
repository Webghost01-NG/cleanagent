"use client";
import React, { useState } from 'react';
import { Layers, ShieldCheck, CheckCircle2, ExternalLink, Hash, Clock, FileCode } from 'lucide-react';

export default function AgentAuditExplorer({ auditLogs = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const term = searchTerm.toLowerCase();
    return (
      log.txHash?.toLowerCase().includes(term) ||
      log.poolName?.toLowerCase().includes(term) ||
      log.recordId?.toString().includes(term)
    );
  });

  return (
    <div className="space-y-8 pt-2 font-mono">
      
      {/* Header Banner */}
      <div className="theme-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-bold uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-500" />
              CVA PROVENANCE PROOF LEDGER
            </span>
          </div>
          <h2 className="text-3xl font-black theme-text font-sans">Mandate Execution Audit Trail</h2>
          <p className="text-sm theme-text-muted">
            Every autonomous agent transaction, CVI clearance check, and spend mandate evaluation is immutably signed by `CVAAuditWrapper.sol`.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Tx Hash, Pool, Record #..."
            className="w-full theme-input theme-text text-xs p-3.5 rounded-xl focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Audit Trail Table Card */}
      <div className="theme-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b theme-border theme-subcard flex items-center justify-between">
          <h3 className="text-sm font-bold theme-text uppercase tracking-wider flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-500" />
            ON-CHAIN MANDATE AUDIT RECORDS ({filteredLogs.length})
          </h3>
          <span className="text-[10px] theme-text-muted">Monad Testnet Block Explorer Sync Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="theme-subcard theme-text-muted text-[10px] uppercase border-b theme-border font-bold">
              <tr>
                <th className="p-4">Record ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Target Vault</th>
                <th className="p-4">Rebalance Amount</th>
                <th className="p-4">CVI Identity Tier</th>
                <th className="p-4">CVA Provenance Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border theme-text">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center theme-text-muted">
                    No matching audit records found. Run an Agent Execution Cycle on the Dashboard to generate records.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-200 dark:hover:bg-[#1f1e2e] transition-colors">
                    <td className="p-4 font-bold text-purple-600 dark:text-purple-400">
                      #{log.recordId}
                    </td>

                    <td className="p-4 theme-text-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>

                    <td className="p-4 font-bold theme-text">
                      {log.poolName}
                    </td>

                    <td className="p-4 font-bold text-emerald-500">
                      ${log.amountUSD?.toLocaleString()} USD
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        {log.cviTier}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-purple-600 dark:text-[#b87cf8]">
                      <a
                        href={`https://testnet.monadexplorer.com/tx/${log.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        {log.txHash?.slice(0, 14)}...{log.txHash?.slice(-6)}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
