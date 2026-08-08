import React from 'react';
import { Wallet, ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function WalletModal({ 
  isOpen, 
  onClose, 
  onConnectEVM, 
  onConnectPhantom, 
  onSelectPersona, 
  identities 
}) {
  if (!isOpen) return null;

  const handleEVMClick = async () => {
    try {
      await onConnectEVM();
    } catch (err) {
      // Fallback to primary test persona if browser extension not detected
      onSelectPersona('0x2546BcD3c84621e976D8185a91A922aE77ECEc30');
      onClose();
    }
  };

  const handlePhantomClick = async () => {
    try {
      await onConnectPhantom();
    } catch (err) {
      onSelectPersona('0x7a834e9100000000000000000000000000004e91');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="kwala-card w-full max-w-md p-6 space-y-5 bg-card text-card-foreground border-border shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#b87cf8]" />
            <h3 className="text-lg font-bold text-foreground">Connect Web3 Wallet</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg font-mono p-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Connect your Web3 browser wallet or select a demo persona to inspect your **Cleanverse Verified Identity (CVI)** attestation status.
        </p>

        {/* Real Wallet Buttons */}
        <div className="space-y-2.5">
          
          {/* MetaMask / Injected EVM */}
          <button
            onClick={handleEVMClick}
            className="w-full p-3.5 rounded-xl bg-secondary hover:bg-muted border border-border flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-7 h-7" />
              <div>
                <span className="text-sm font-bold text-foreground group-hover:text-[#b87cf8] transition-colors block">MetaMask / EVM</span>
                <span className="text-[10px] text-muted-foreground font-mono">Ethereum, Base, Monad, Polygon</span>
              </div>
            </div>
            <span className="text-xs font-mono text-[#b87cf8] font-bold">Connect &rsaquo;</span>
          </button>

          {/* Phantom Wallet */}
          <button
            onClick={handlePhantomClick}
            className="w-full p-3.5 rounded-xl bg-secondary hover:bg-muted border border-border flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                👻
              </div>
              <div>
                <span className="text-sm font-bold text-foreground group-hover:text-purple-400 transition-colors block">Phantom Wallet</span>
                <span className="text-[10px] text-muted-foreground font-mono">Solana & Multi-Chain EVM</span>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">Connect &rsaquo;</span>
          </button>

        </div>

        {/* Demo Personas Quick Select */}
        <div className="pt-3 border-t border-border space-y-2">
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold block">
            DEMO TEST PERSONAS (1-CLICK CONNECT):
          </span>
          <div className="space-y-1.5">
            {identities.map((id) => (
              <button
                key={id.wallet}
                onClick={() => {
                  onSelectPersona(id.wallet);
                  onClose();
                }}
                className="w-full p-2.5 rounded-lg bg-secondary/80 hover:bg-muted border border-border flex items-center justify-between text-xs font-mono text-left cursor-pointer transition-colors"
              >
                <div>
                  <span className="text-foreground font-bold block">{id.name}</span>
                  <span className="text-[10px] text-muted-foreground">{id.wallet.slice(0, 10)}...</span>
                </div>
                <span className={id.isVerified ? (id.isAccredited ? 'text-[#b87cf8] font-bold' : 'text-emerald-500 font-bold') : 'text-rose-500 font-bold'}>
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
