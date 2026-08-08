import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroAndMasonry from './components/HeroAndMasonry';
import AgentChat from './components/AgentChat';
import AgentControlPanel from './components/AgentControlPanel';
import CompliantPools from './components/CompliantPools';
import AgentAuditExplorer from './components/AgentAuditExplorer';
import DocsView from './components/DocsView';
import WalletModal from './components/WalletModal';
import { connectEVMWallet, connectPhantomWallet } from './services/web3';
import { Bot, GitFork } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('control'); // 'chat' | 'control' | 'pools' | 'audit' | 'docs'
  const [currentWallet, setCurrentWallet] = useState('0x2546BcD3c84621e976D8185a91A922aE77ECEc30');
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

  // Fetch initial protocol state from Express Backend
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
      console.error("Error connecting to CleanAgent Protocol Backend:", err);
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
      alert(res.error || "Failed to connect EVM wallet");
    }
  };

  const handleConnectPhantom = async () => {
    const res = await connectPhantomWallet();
    if (res.success) {
      setCurrentWallet(res.address);
      setIsWalletModalOpen(false);
      await fetchProtocolData();
    } else {
      alert(res.error || "Failed to connect Phantom wallet");
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

  const handleSelectPoolForRebalance = (poolId) => {
    setActiveTab('control');
    setTimeout(() => {
      const elem = document.getElementById('agent-control-panel-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
        
        {/* Tab Views - Immediate rendering upon tab click */}
        {loading ? (
          <div className="agent-card p-12 text-center theme-text-muted font-mono space-y-3">
            <div className="size-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Connecting to CleanAgent Server...</p>
          </div>
        ) : (
          <>
            {activeTab === 'control' && (
              <div className="space-y-12 animate-in fade-in duration-200">
                <HeroAndMasonry
                  onStartAgent={() => setActiveTab('control')}
                  onOpenDemo={() => setActiveTab('chat')}
                />
                <AgentControlPanel
                  pools={pools}
                  mandate={mandate}
                  onRunAgentCycle={handleRunAgentCycle}
                  onUpdateMandate={handleUpdateMandate}
                  currentWallet={currentWallet}
                  identities={identities}
                />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="animate-in fade-in duration-200">
                <AgentChat
                  pools={pools}
                  mandate={mandate}
                  onRunAgentCycle={handleRunAgentCycle}
                />
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
        onSelectPersona={setCurrentWallet}
        identities={identities}
      />

      {/* Footer */}
      <footer className="w-full bg-background border-t theme-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-mono text-xs font-bold theme-text tracking-tight flex items-center gap-2">
              <Bot className="size-4 text-purple-500" />
              CleanAgent AI
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
