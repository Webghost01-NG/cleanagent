"use client";
import React, { useState } from 'react';
import { Wallet, ShieldCheck, ArrowRight, AlertTriangle, PlayCircle } from 'lucide-react';

export default function WalletModal({ 
  isOpen, 
  onClose, 
  onConnectEVM, 
  onConnectPhantom,
  onConnectDemoWallet
}) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEVM = async () => {
    setErrorMsg(null);
    setLoading(true);
    const res = await onConnectEVM();
    setLoading(false);
    if (res && !res.success) {
      setErrorMsg(res.error || "MetaMask extension not found in your browser.");
    }
  };

  const handlePhantom = async () => {
    setErrorMsg(null);
    setLoading(true);
    const res = await onConnectPhantom();
    setLoading(false);
    if (res && !res.success) {
      setErrorMsg(res.error || "Phantom Wallet extension not found in your browser.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="theme-card w-full max-w-md p-6 space-y-5 shadow-2xl relative border theme-border font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b theme-border pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold theme-text">Connect Web3 Wallet</h3>
          </div>
          <button 
            onClick={() => {
              setErrorMsg(null);
              onClose();
            }}
            className="theme-text-muted hover:theme-text text-lg font-mono p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs theme-text-muted leading-relaxed">
          Connect your Web3 browser wallet (MetaMask or Phantom) to configure yield mandates, verify CVI ratings, and sign Monad transactions.
        </p>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 font-mono animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{errorMsg}</p>
              <p className="text-[10px] opacity-90">Install MetaMask from <a href="https://metamask.io" target="_blank" rel="noreferrer" className="underline font-bold">metamask.io</a> or use Demo Mode below.</p>
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
                <span className="text-sm font-bold theme-text group-hover:text-purple-500 transition-colors block">MetaMask / Browser EVM</span>
                <span className="text-[10px] theme-text-muted font-mono">Ethereum, Monad, Base, Arbitrum</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
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
                <span className="text-sm font-bold theme-text group-hover:text-purple-400 transition-colors block">Phantom Wallet</span>
                <span className="text-[10px] theme-text-muted font-mono">Solana & Multi-Chain EVM</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Demo Mode Button (Explicit Choice Only) */}
          <div className="pt-2 border-t theme-border">
            <button
              onClick={() => {
                setErrorMsg(null);
                onConnectDemoWallet();
              }}
              className="w-full p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-[#b87cf8] border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Continue with Simulated Demo Wallet (Testing Only)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
