"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroAndMasonry from '@/components/HeroAndMasonry';
import AgentChat from '@/components/AgentChat';
import AgentControlPanel from '@/components/AgentControlPanel';
import CompliantPools from '@/components/CompliantPools';
import AgentAuditExplorer from '@/components/AgentAuditExplorer';
import DocsView from '@/components/DocsView';
import WalletModal from '@/components/WalletModal';
import { connectEVMWallet, connectPhantomWallet } from '@/services/web3';
import { Bot, GitFork, Wallet, Lock } from 'lucide-react';

const API_BASE = '/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('control'); // 'chat' | 'control' | 'pools' | 'audit' | 'docs'
  const [currentWallet, setCurrentWallet] = useState(null); // Disconnected by default
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [pools, setPools] = useState([]);
  const [mandate, setMandate] = useState({
    maxSpendPerTxUSD: 25000,
    maxDailySpendUSD: 100000,
    currentDailySpendUSD: 10000,
    minRequiredYieldBps: 700,
    requireAccreditedPoolOnly: false,
    isAgentActive: true
  });
  const [identities, setIdentities] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync Dark mode class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch initial protocol state from Next.js API Routes
  const fetchProtocolData = async () => {
    try {
      setLoading(true);
      const [resStats, resPools, resMandate, resIdentities, resAudit] = await Promise.all([
        fetch(`${API_BASE}/stats`).then(r => r.json()),
        fetch(`${API_BASE}/pools`).then(r => r.json()),
        fetch(`${API_BASE}/agent/mandate`).then(r => r.json()),
        fetch(`${API_BASE}/cvi/identities`).then(r => r.json()),
        fetch(`${API_BASE}/cva/audit-trail`).then(r => r.json())
      ]);

      setStats(resStats);
      setPools(resPools);
      setMandate(resMandate);
      setIdentities(resIdentities);
      setAuditLogs(resAudit);
    } catch (err) {
      console.error("Error connecting to CleanAgent API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtocolData();
  }, []);

  // Web3 Connection Handlers
  const handleConnectEVM = async () => {
    const res = await connectEVMWallet();
    if (res.success) {
      setCurrentWallet(res.address);
      setIsWalletModalOpen(false);
      await fetchProtocolData();
    } else {
      setCurrentWallet('0x2546BcD3c84621e976D8185a91A922aE77ECEc30');
      setIsWalletModalOpen(false);
      await fetchProtocolData();
    }
  };

  const handleConnectPhantom = async () => {
    const res = await connectPhantomWallet();
    if (res.success) {
      setCurrentWallet(res.address);
      setIsWalletModalOpen(false);
      await fetchProtocolData();
    } else {
      setCurrentWallet('0x7a834e9100000000000000000000000000004e91');
      setIsWalletModalOpen(false);
      await fetchProtocolData();
    }
  };

  // Run Autonomous Agent Cycle Handler
  const handleRunAgentCycle = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/agent/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      await fetchProtocolData();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update Agent Mandate Handler
  const handleUpdateMandate = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/agent/mandate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      await fetchProtocolData();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleStartAgentFromHero = () => {
    if (!currentWallet) {
      setIsWalletModalOpen(true);
    } else {
      setActiveTab('control');
      setTimeout(() => {
        const elem = document.getElementById('agent-control-panel-section');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSelectPoolForRebalance = (poolId) => {
    if (!currentWallet) {
      setIsWalletModalOpen(true);
    } else {
      setActiveTab('control');
      setTimeout(() => {
        const elem = document.getElementById('agent-control-panel-section');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-purple-500 selection:text-white bg-background agent-dot-grid text-foreground">
      
      {/* Top Floating Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentWallet={currentWallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        identities={identities}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-8">
        
        {/* Tab Views */}
        {loading ? (
          <div className="agent-card p-12 text-center theme-text-muted font-mono space-y-3">
            <div className="size-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Initializing Next.js CleanAgent Engine...</p>
          </div>
        ) : (
          <>
            {activeTab === 'control' && (
              <div className="space-y-12 animate-in fade-in duration-200">
                <HeroAndMasonry
                  onStartAgent={handleStartAgentFromHero}
                  onOpenDemo={() => setActiveTab('chat')}
                />

                {!currentWallet ? (
                  <div className="theme-card p-12 text-center space-y-5 border border-purple-500/40 shadow-2xl">
                    <div className="size-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-500">
                      <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold theme-text">Connect Wallet to Access CleanAgent Protocol</h3>
                      <p className="text-sm theme-text-muted max-w-md mx-auto">
                        Connect your Web3 wallet (MetaMask or Phantom) to configure mandate guardrails and run autonomous execution cycles.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsWalletModalOpen(true)}
                      className="py-4 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold text-sm inline-flex items-center gap-2 shadow-xl cursor-pointer"
                    >
                      <Wallet className="w-4 h-4" />
                      Connect Web3 Wallet Now
                    </button>
                  </div>
                ) : (
                  <AgentControlPanel
                    pools={pools}
                    mandate={mandate}
                    onRunAgentCycle={handleRunAgentCycle}
                    onUpdateMandate={handleUpdateMandate}
                    currentWallet={currentWallet}
                    identities={identities}
                    onOpenWalletModal={() => setIsWalletModalOpen(true)}
                  />
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="animate-in fade-in duration-200">
                {!currentWallet ? (
                  <div className="theme-card p-12 text-center space-y-5 border border-purple-500/40 shadow-2xl">
                    <div className="size-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-500">
                      <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold theme-text">Connect Wallet to Access Agent Console</h3>
                      <p className="text-sm theme-text-muted max-w-md mx-auto">
                        Web3 authentication is required to generate AI mandates and execute on-chain transactions.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsWalletModalOpen(true)}
                      className="py-4 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-mono font-bold text-sm inline-flex items-center gap-2 shadow-xl cursor-pointer"
                    >
                      <Wallet className="w-4 h-4" />
                      Connect Web3 Wallet Now
                    </button>
                  </div>
                ) : (
                  <AgentChat
                    pools={pools}
                    mandate={mandate}
                    onRunAgentCycle={handleRunAgentCycle}
                  />
                )}
              </div>
            )}

            {activeTab === 'pools' && (
              <div className="animate-in fade-in duration-200">
                <CompliantPools
                  pools={pools}
                  mandate={mandate}
                  onSelectPoolForRebalance={handleSelectPoolForRebalance}
                />
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="animate-in fade-in duration-200">
                <AgentAuditExplorer
                  auditLogs={auditLogs}
                />
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="animate-in fade-in duration-200">
                <DocsView />
              </div>
            )}
          </>
        )}

      </main>

      {/* Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectEVM={handleConnectEVM}
        onConnectPhantom={handleConnectPhantom}
      />

      {/* Footer */}
      <footer className="w-full bg-background border-t theme-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-mono text-xs font-bold theme-text tracking-tight flex items-center gap-2">
              <Bot className="size-4 text-purple-500" />
              CleanAgent AI (Next.js Edition)
            </span>
            <span className="font-mono text-[10px] theme-text-muted">
              AI-powered autonomous yield & CVI compliance engine
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs theme-text-muted">
            <button onClick={() => setActiveTab('chat')} className="hover:theme-text transition-colors cursor-pointer">Chat</button>
            <button onClick={() => setActiveTab('control')} className="hover:theme-text transition-colors cursor-pointer">Dashboard</button>
            <button onClick={() => setActiveTab('pools')} className="hover:theme-text transition-colors cursor-pointer">Vaults</button>
            <button onClick={() => setActiveTab('docs')} className="hover:theme-text transition-colors cursor-pointer">Docs</button>
            <a
              href="https://github.com/Webghost01-NG/cleanagent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:theme-text transition-colors"
            >
              GitHub <GitFork className="size-3" />
            </a>
          </nav>
        </div>
      </footer>

    </div>
  );
}
