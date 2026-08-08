import React from 'react';
import { Wallet, ShieldCheck, ArrowRight } from 'lucide-react';

export default function WalletModal({ 
  isOpen, 
  onClose, 
  onConnectEVM, 
  onConnectPhantom 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="theme-card w-full max-w-md p-6 space-y-5 shadow-2xl relative border theme-border">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b theme-border pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold theme-text">Connect Web3 Wallet</h3>
          </div>
          <button 
            onClick={onClose}
            className="theme-text-muted hover:theme-text text-lg font-mono p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs theme-text-muted leading-relaxed">
          Connect your Web3 browser wallet to inspect on-chain CVI identity credentials, manage yield mandates, and execute autonomous trades.
        </p>

        {/* Real Wallet Buttons */}
        <div className="space-y-3">
          
          {/* MetaMask / Injected EVM */}
          <button
            onClick={async () => {
              await onConnectEVM();
              onClose();
            }}
            className="w-full p-4 rounded-xl theme-subcard hover:border-purple-500 border theme-border flex items-center justify-between text-left transition-all cursor-pointer group"
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
            onClick={async () => {
              await onConnectPhantom();
              onClose();
            }}
            className="w-full p-4 rounded-xl theme-subcard hover:border-purple-500 border theme-border flex items-center justify-between text-left transition-all cursor-pointer group"
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

        </div>

      </div>
    </div>
  );
}
