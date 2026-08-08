import React from 'react';
import { Bot, ShieldCheck, Cpu, Layers, Wallet, PlusCircle, FileText, ChevronDown } from 'lucide-react';

export default function Navbar({ 
  currentWallet, 
  identities, 
  onOpenWalletModal, 
  onOpenSummaryModal,
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/90 border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('control')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-400 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-purple-500/25">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-mono">CleanAgent</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                  AUTONOMOUS DEFI
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                Cleanverse Capability #8: <span className="text-emerald-400 font-semibold">Agent Skill Framework</span>
              </p>
            </div>
          </div>

          {/* Network Switcher */}
          <div className="hidden lg:flex items-center gap-2">
            <select
              value={selectedNetwork}
              onChange={(e) => onSelectNetwork(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="monad">⚡ Monad Protocol Testnet</option>
              <option value="cleanverse">🌐 Cleanverse EVM Testnet</option>
              <option value="base">🔵 Base Mainnet</option>
              <option value="arbitrum">💙 Arbitrum One</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold w-full md:w-auto">
          
          <button
            onClick={() => setActiveTab('control')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 flex-1 md:flex-none justify-center ${
              activeTab === 'control'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-300" />
            Agent Control Panel
          </button>

          <button
            onClick={() => setActiveTab('pools')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 flex-1 md:flex-none justify-center ${
              activeTab === 'pools'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Compliant Yield Pools
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 flex-1 md:flex-none justify-center ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-300" />
            CVA Mandate Explorer
          </button>

        </nav>

        {/* Action Buttons: Summary + Wallet */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          
          <button
            onClick={onOpenSummaryModal}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1 transition-all"
            title="One-Page Submission Summary"
          >
            <FileText className="w-4 h-4 text-purple-400" />
          </button>

          <button
            onClick={onOpenWalletModal}
            className="btn-primary flex items-center gap-2 text-xs py-2 px-4 shadow-lg"
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
