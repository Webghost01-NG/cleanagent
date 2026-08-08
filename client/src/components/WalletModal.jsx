import React from 'react';
import { Wallet, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WalletModal({ 
  isOpen, 
  onClose, 
  onConnectEVM, 
  onConnectPhantom, 
  onSelectPersona, 
  identities 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md p-6 space-y-5 border-sky-500/40 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white">Connect Web3 Wallet</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Connect your Web3 browser wallet to inspect your Cleanverse Verified Identity (CVI) status and trade RWA shares.
        </p>

        {/* Real Wallet Buttons */}
        <div className="space-y-2.5">
          
          {/* MetaMask / Injected EVM */}
          <button
            onClick={onConnectEVM}
            className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-7 h-7" />
              <div>
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors block">MetaMask</span>
                <span className="text-[10px] text-slate-400 font-mono">Ethereum, Base, Polygon, EVM</span>
              </div>
            </div>
            <span className="text-xs font-mono text-sky-400 font-semibold">Connect</span>
          </button>

          {/* Phantom Wallet */}
          <button
            onClick={onConnectPhantom}
            className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                👻
              </div>
              <div>
                <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors block">Phantom Wallet</span>
                <span className="text-[10px] text-slate-400 font-mono">Solana & Multi-Chain EVM</span>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-400 font-semibold">Connect</span>
          </button>

        </div>

        {/* Demo Personas Quick Select */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
            OR SELECT DEMO TEST PERSONAS:
          </span>
          <div className="space-y-1.5">
            {identities.map((id) => (
              <button
                key={id.wallet}
                onClick={() => {
                  onSelectPersona(id.wallet);
                  onClose();
                }}
                className="w-full p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono text-left"
              >
                <div>
                  <span className="text-white font-bold block">{id.name}</span>
                  <span className="text-[10px] text-slate-400">{id.wallet.slice(0, 10)}...</span>
                </div>
                <span className={id.isVerified ? (id.isAccredited ? 'text-purple-400 font-bold' : 'text-emerald-400 font-bold') : 'text-rose-400 font-bold'}>
                  {id.isVerified ? (id.isAccredited ? 'CVI Accredited' : 'CVI Standard') : 'Unverified'}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
