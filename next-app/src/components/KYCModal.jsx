"use client";
import React, { useState } from 'react';
import { ShieldCheck, UserCheck, CheckCircle2 } from 'lucide-react';

export default function KYCModal({ isOpen, onClose, currentWallet, identities, onVerifyIdentity }) {
  const [name, setName] = useState('');
  const [isAccredited, setIsAccredited] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!isOpen) return null;

  const currentIdentity = identities.find(i => i.wallet === currentWallet) || { name: "" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg(null);

    const res = await onVerifyIdentity({
      wallet: currentWallet,
      name: name || currentIdentity.name || "Verified Investor",
      isAccredited: isAccredited
    });

    setIsSubmitting(false);
    if (res.success) {
      setMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
        setMsg(null);
      }, 1500);
    } else {
      setMsg({ type: 'danger', text: res.message || "Failed to issue CVI Certificate" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md p-6 space-y-5 border-emerald-500/40 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Cleanverse CVI Identity Verification</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Get your connected wallet address verified on-chain to trade & hold Cleanverse Verified Assets (CVA).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">CONNECTED WALLET ADDRESS:</span>
            <span className="text-sky-400 font-bold truncate block">{currentWallet}</span>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">YOUR LEGAL NAME / ENTITY:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Charlie Sterling"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Accredited Investor Verification</span>
              <span className="text-[10px] text-slate-400 block">Check if you qualify as an accredited investor</span>
            </div>
            <input
              type="checkbox"
              checked={isAccredited}
              onChange={(e) => setIsAccredited(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
          </div>

          {msg && (
            <div className={`p-3 rounded-lg ${msg.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50' : 'bg-rose-950/60 text-rose-300 border border-rose-500/50'}`}>
              {msg.text}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 btn-success text-xs py-3 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Issuing CVI Certificate...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Issue On-Chain CVI Certificate
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
