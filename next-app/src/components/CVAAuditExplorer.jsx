"use client";
import React, { useState } from 'react';
import { Layers, ShieldCheck, ShieldAlert, CheckCircle2, Lock, ExternalLink, Filter, Search, FileCode2 } from 'lucide-react';

export default function CVAAuditExplorer({ auditLogs }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredLogs = auditLogs.filter(record => {
    const matchesFilter = 
      filterType === 'ALL' ? true :
      filterType === 'SUCCESS' ? record.isSuccessful :
      filterType === 'BLOCKED' ? !record.isSuccessful : true;

    const matchesSearch = 
      record.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.toName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provenanceTxHash.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header callout */}
      <div className="glass-panel p-6 border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                CVA PROTOCOL PROVENANCE LEDGER
              </span>
              <span className="text-xs font-mono text-slate-400">Cleanverse Verified Assets</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              Immutable Asset Audit & Compliance Trail
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Every token mint, share transfer, and blocked compliance attempt is cryptographically hash-logged with CVI identity signatures, creating an unalterable audit trail for regulators and investors.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              filterType === 'ALL' ? 'bg-purple-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setFilterType('SUCCESS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              filterType === 'SUCCESS' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Compliant ({auditLogs.filter(a => a.isSuccessful).length})
          </button>
          <button
            onClick={() => setFilterType('BLOCKED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              filterType === 'BLOCKED' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Blocked Violations ({auditLogs.filter(a => !a.isSuccessful).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by wallet, hash, or property..."
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs font-mono rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-purple-500"
          />
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="glass-panel overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="p-4">STATUS</th>
                <th className="p-4">RECORD ID</th>
                <th className="p-4">PROPERTY ASSET</th>
                <th className="p-4">FROM SENDER</th>
                <th className="p-4">TO RECIPIENT</th>
                <th className="p-4">SHARES</th>
                <th className="p-4">CVA PROVENANCE HASH</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 font-mono">
                    No matching CVA audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Status Badge */}
                    <td className="p-4 whitespace-nowrap">
                      {record.isSuccessful ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> COMPLIANT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <ShieldAlert className="w-3 h-3 text-rose-400" /> BLOCKED
                        </span>
                      )}
                    </td>

                    {/* Record ID */}
                    <td className="p-4 whitespace-nowrap font-bold text-white">
                      #{record.recordId}
                    </td>

                    {/* Property */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-bold text-sky-400">{record.propertyTicker}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">{record.propertyTitle}</span>
                    </td>

                    {/* Sender */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-white">{record.fromName}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{record.from}</span>
                    </td>

                    {/* Recipient */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-white">{record.toName}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">{record.to}</span>
                    </td>

                    {/* Shares */}
                    <td className="p-4 whitespace-nowrap font-bold text-white">
                      {record.shareAmount} Shares
                    </td>

                    {/* Hash */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-purple-300 text-[11px] truncate max-w-[120px] inline-block font-mono">
                        {record.provenanceTxHash}
                      </span>
                    </td>

                    {/* Inspect Button */}
                    <td className="p-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="px-2.5 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold"
                      >
                        Inspect Payload
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl p-6 space-y-4 border-purple-500/30 shadow-2xl relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">CVA Audit Record Payload #{selectedRecord.recordId}</h3>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
              <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
