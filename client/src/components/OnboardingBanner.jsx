import React from 'react';
import { Wallet, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';

export default function OnboardingBanner({ currentWallet, identities, onOpenWallet, onOpenKYC, onSelectTab }) {
  const identity = identities.find(i => i.wallet === currentWallet) || {
    isVerified: false,
    name: "Unverified Wallet"
  };

  const shortAddr = currentWallet ? `${currentWallet.slice(0, 6)}...${currentWallet.slice(-4)}` : "Not Connected";

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Step 1: Connect Wallet */}
        <div 
          onClick={onOpenWallet}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity w-full md:w-auto"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 font-bold font-mono">
            1
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">STEP 1: WALLET</span>
            <span className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
              <Wallet className="w-4 h-4 text-sky-400" />
              {shortAddr}
            </span>
          </div>
        </div>

        <ArrowRight className="hidden md:block w-4 h-4 text-slate-600" />

        {/* Step 2: CVI Identity Status */}
        <div 
          onClick={onOpenKYC}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity w-full md:w-auto"
        >
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 font-bold font-mono ${
            identity.isVerified 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
          }`}>
            2
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">STEP 2: CVI VERIFICATION</span>
            <span className={`text-sm font-bold flex items-center gap-1.5 ${
              identity.isVerified ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <ShieldCheck className="w-4 h-4" />
              {identity.isVerified ? (identity.isAccredited ? 'CVI Accredited' : 'CVI Standard') : 'Click to Verify (Required)'}
            </span>
          </div>
        </div>

        <ArrowRight className="hidden md:block w-4 h-4 text-slate-600" />

        {/* Step 3: Trade & Transfer */}
        <div 
          onClick={() => onSelectTab && onSelectTab('portfolio')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity w-full md:w-auto"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 font-bold font-mono">
            3
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">STEP 3: PORTFOLIO & TRANSFERS</span>
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              View Portfolio & Transfers
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
