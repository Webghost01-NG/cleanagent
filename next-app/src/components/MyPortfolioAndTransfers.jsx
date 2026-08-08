"use client";
import React, { useState } from 'react';
import { Wallet, Send, ShieldAlert, ShieldCheck, CheckCircle2, Lock, FileCode2, Layers, AlertOctagon } from 'lucide-react';

export default function MyPortfolioAndTransfers({ 
  properties, 
  identities, 
  currentWallet, 
  onExecuteTransfer,
  auditLogs,
  onOpenKYC
}) {
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || "prop-1");
  const [recipientWallet, setRecipientWallet] = useState("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"); // Bob (Unverified)
  const [sharesToTransfer, setSharesToTransfer] = useState(50);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [transferResult, setTransferResult] = useState(null);

  const currentIdentity = identities.find(i => i.wallet === currentWallet) || { name: "Current Wallet", isVerified: false };
  const recipientIdentity = identities.find(i => i.wallet === recipientWallet) || { name: recipientWallet, isVerified: false };

  const selectedProperty = properties.find(p => p.id === selectedPropId) || properties[0];
  const senderBalance = selectedProperty?.balances[currentWallet] || 0;

  // Compute User Holdings across all properties
  let userTotalValuation = 0;
  let userHoldings = [];

  properties.forEach(p => {
    const shares = p.balances[currentWallet] || 0;
    if (shares > 0) {
      const val = shares * p.pricePerShareUSD;
      userTotalValuation += val;
      userHoldings.push({
        property: p,
        shares,
        valUSD: val
      });
    }
  });

  const handleSendTransfer = async (e) => {
    e.preventDefault();
    setIsExecuting(true);
    setTransferResult(null);

    const result = await onExecuteTransfer({
      propertyId: selectedPropId,
      fromWallet: currentWallet,
      toWallet: recipientWallet,
      shares: sharesToTransfer
    });

    setTransferResult(result);
    setIsExecuting(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Portfolio Holdings Summary */}
      <div className="glass-panel p-6 border-sky-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">YOUR WALLET HOLDINGS</span>
            <h2 className="text-2xl font-extrabold text-white">{currentIdentity.name}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{currentWallet}</p>
          </div>

          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-right font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">TOTAL PORTFOLIO VALUE</span>
            <span className="text-2xl font-extrabold text-emerald-400">${userTotalValuation.toLocaleString()} USD</span>
          </div>
        </div>

        {/* Owned Assets Grid */}
        <div className="mt-4">
          {userHoldings.length === 0 ? (
            <div className="p-6 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              You do not own any property shares yet. Go to <span className="text-sky-400 font-bold">Marketplace</span> to purchase your first shares!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userHoldings.map(h => (
                <div key={h.property.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono space-y-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold">{h.property.ticker}</span>
                  <h4 className="text-sm font-bold text-white mt-1 truncate">{h.property.title}</h4>
                  <div className="flex justify-between items-center text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <span>{h.shares} Shares</span>
                    <span className="font-bold text-emerald-400">${h.valUSD.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Share Transfer Form */}
      <div className="glass-panel p-6 space-y-5 border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-sky-400" />
            <h3 className="text-xl font-bold text-white">Transfer Shares to Another Wallet</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Send property shares to a friend or buyer. Cleanverse CVI automatically validates recipient identity compliance on-chain.
          </p>
        </div>

        <form onSubmit={handleSendTransfer} className="space-y-4 font-mono text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Select Property */}
            <div>
              <label className="text-slate-400 block mb-1">SELECT PROPERTY TO TRANSFER:</label>
              <select
                value={selectedPropId}
                onChange={(e) => setSelectedPropId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-sky-500"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.ticker}) — Balance: {p.balances[currentWallet] || 0} Shares
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Input */}
            <div>
              <label className="text-slate-400 block mb-1">RECIPIENT WALLET ADDRESS:</label>
              <select
                value={recipientWallet}
                onChange={(e) => setRecipientWallet(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-sky-500"
              >
                {identities.map(i => (
                  <option key={i.wallet} value={i.wallet}>
                    {i.name} ({i.isVerified ? (i.isAccredited ? 'Verified Accredited' : 'Verified Standard') : 'UNVERIFIED WALLET'})
                  </option>
                ))}
              </select>
            </div>

            {/* Shares Count */}
            <div>
              <label className="text-slate-400 block mb-1">SHARES AMOUNT:</label>
              <input
                type="number"
                min="1"
                max={senderBalance || 100}
                value={sharesToTransfer}
                onChange={(e) => setSharesToTransfer(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-xl p-3 focus:outline-none focus:border-sky-500"
              />
            </div>

          </div>

          {/* Result Feedback Banner */}
          {transferResult && (
            <div className={`p-4 rounded-xl border space-y-2 font-mono text-xs ${
              transferResult.blocked 
                ? 'bg-rose-950/70 border-rose-500/80 text-rose-100' 
                : 'bg-emerald-950/70 border-emerald-500/80 text-emerald-100'
            }`}>
              <div className="flex items-center gap-2 text-sm font-extrabold">
                {transferResult.blocked ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <span>TRANSFER BLOCKED BY CLEANVERSE CVI PROTOCOL!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>TRANSFER SUCCESSFUL & CVA PROVENANCE LOGGED!</span>
                  </>
                )}
              </div>
              <p>{transferResult.reason || transferResult.message}</p>
              
              {transferResult.blocked && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenKYC}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 shadow-md"
                  >
                    Send CVI Verification Link to Recipient
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isExecuting}
            className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2"
          >
            {isExecuting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Checking Cleanverse Compliance...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Property Shares
              </>
            )}
          </button>

        </form>
      </div>

      {/* Auditable CVA Ownership Trail */}
      <div className="glass-panel p-6 space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Auditable CVA Ownership Trail</h3>
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold">Cleanverse Verified Assets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-2">STATUS</th>
                <th className="py-3 px-2">PROPERTY</th>
                <th className="py-3 px-2">FROM</th>
                <th className="py-3 px-2">TO</th>
                <th className="py-3 px-2">SHARES</th>
                <th className="py-3 px-2 text-right">PROVENANCE HASH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map(a => (
                <tr key={a.id} className="hover:bg-slate-900/50">
                  <td className="py-3 px-2">
                    {a.isSuccessful ? (
                      <span className="text-emerald-400 font-bold">✓ COMPLIANT</span>
                    ) : (
                      <span className="text-rose-400 font-bold">❌ BLOCKED</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-sky-400 font-bold">{a.propertyTicker}</td>
                  <td className="py-3 px-2">{a.fromName}</td>
                  <td className="py-3 px-2">{a.toName}</td>
                  <td className="py-3 px-2 font-bold text-white">{a.shareAmount}</td>
                  <td className="py-3 px-2 text-right text-purple-300 truncate max-w-[120px]">{a.provenanceTxHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
