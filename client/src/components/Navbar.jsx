import React from 'react';
import { Bot, ShieldCheck, Cpu, Layers, Wallet, ChevronDown, Sparkles, BookOpen } from 'lucide-react';

export default function Navbar({ 
  currentWallet, 
  identities, 
  onOpenWalletModal, 
  activeTab, 
  setActiveTab,
  selectedNetwork,
  onSelectNetwork
}) {
  const currentIdentity = identities.find(i => i.wallet === currentWallet) || {
    wallet: currentWallet,
    name: "Connected Wallet",
    role: "Unverified Wallet",
    isVerified: false,
    isAccredited: false
  };

  const shortAddress = currentWallet ? `${currentWallet.slice(0, 6)}...${currentWallet.slice(-4)}` : "Not Connected";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#060913]/90 border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('control')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-emerald-400 p-0.5 shadow-xl shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white font-sans">CleanAgent</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  CAPABILITY #8
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                Compliant DeFi: <span className="text-emerald-400 font-semibold">Agent Skill Framework</span>
              </p>
            </div>
          </div>

          {/* Network Switcher */}
          <div className="hidden lg:flex items-center gap-2">
            <select
              value={selectedNetwork}
              onChange={(e) => onSelectNetwork(e.target.value)}
              className="bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 cursor-pointer shadow-inner font-bold"
            >
              <option value="monad">⚡ Monad Testnet</option>
              <option value="cleanverse">🌐 Cleanverse EVM</option>
              <option value="base">🔵 Base Mainnet</option>
              <option value="arbitrum">💙 Arbitrum One</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 text-xs font-semibold w-full md:w-auto shadow-inner">
          
          <button
            onClick={() => setActiveTab('control')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-1 md:flex-none justify-center ${
              activeTab === 'control'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-300" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('pools')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-1 md:flex-none justify-center ${
              activeTab === 'pools'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Compliant Vaults
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-1 md:flex-none justify-center ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-300" />
            Audit Ledger
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-1 md:flex-none justify-center ${
              activeTab === 'docs'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            Docs & Spec
          </button>

        </nav>

        {/* Connect Wallet Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={onOpenWalletModal}
            className="btn-primary flex items-center gap-2 text-xs py-2 px-3.5 shadow-xl"
          >
            <Wallet className="w-4 h-4" />
            <div className="text-left font-mono">
              <span className="block font-bold text-white leading-tight">{shortAddress}</span>
              <span className="block text-[9px] text-purple-200">
                {currentIdentity.isVerified ? (currentIdentity.isAccredited ? 'CVI Accredited' : 'CVI Standard') : 'Unverified Wallet'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

      </div>
    </header>
  );
}
