"use client";
import React, { useState } from 'react';
import { Wallet, ArrowRight, AlertTriangle } from 'lucide-react';

export default function WalletModal({ 
  isOpen, 
  onClose, 
  onConnectEVM, 
  onConnectPhantom
}) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEVM = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setErrorMsg(null);
    setLoading(true);
    const res = await onConnectEVM();
    setLoading(false);
    if (res && !res.success) {
      setErrorMsg(res.error || "MetaMask extension not found in your browser.");
    }
  };

  const handlePhantom = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setErrorMsg(null);
    setLoading(true);
    const res = await onConnectPhantom();
    setLoading(false);
    if (res && !res.success) {
      setErrorMsg(res.error || "Phantom Wallet extension not found in your browser.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="theme-card w-full max-w-md p-6 space-y-5 shadow-2xl relative border theme-border font-sans rounded-3xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b theme-border pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold theme-text font-sans">Connect Web3 Wallet</h3>
          </div>
          <button 
            onClick={(e) => {
              if (e) { e.stopPropagation(); e.preventDefault(); }
              setErrorMsg(null);
              onClose();
            }}
            className="theme-text-muted hover:theme-text text-lg font-mono p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs theme-text-muted leading-relaxed font-sans">
          Connect your Web3 browser wallet (MetaMask or Phantom) to configure yield mandates, verify CVI ratings, and sign Monad transactions.
        </p>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 font-mono animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{errorMsg}</p>
              <p className="text-[10px] opacity-90">Please install a Web3 wallet extension from <a href="https://metamask.io" target="_blank" rel="noreferrer" className="underline font-bold">metamask.io</a> or <a href="https://phantom.app" target="_blank" rel="noreferrer" className="underline font-bold">phantom.app</a> to interact with CleanAgent Protocol.</p>
            </div>
          </div>
        )}

        {/* Real Wallet Buttons */}
        <div className="space-y-3 font-mono">
          
          {/* MetaMask / Injected EVM */}
          <button
            disabled={loading}
            onClick={handleEVM}
            className="w-full p-4 rounded-xl theme-subcard hover:border-purple-500 border theme-border flex items-center justify-between text-left transition-all cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-7 h-7" />
              <div>
                <span className="text-sm font-bold theme-text group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors block">MetaMask / Browser EVM</span>
                <span className="text-[10px] theme-text-muted font-mono">Ethereum, Monad, Base, Arbitrum</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Phantom Wallet */}
          <button
            disabled={loading}
            onClick={handlePhantom}
            className="w-full p-4 rounded-xl theme-subcard hover:border-purple-500 border theme-border flex items-center justify-between text-left transition-all cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                👻
              </div>
              <div>
                <span className="text-sm font-bold theme-text group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors block">Phantom Wallet</span>
                <span className="text-[10px] theme-text-muted font-mono">Solana & Multi-Chain EVM</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>
    </div>
  );
}
