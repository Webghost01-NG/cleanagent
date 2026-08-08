import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KwalaHeroAndMasonry from './components/KwalaHeroAndMasonry';
import AgentControlPanel from './components/AgentControlPanel';
import CompliantPools from './components/CompliantPools';
import AgentAuditExplorer from './components/AgentAuditExplorer';
import WalletModal from './components/WalletModal';
import SummaryModal from './components/SummaryModal';
import { connectEVMWallet, connectPhantomWallet } from './services/web3';
import { Bot } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('control'); // 'control' | 'pools' | 'audit'
  const [currentWallet, setCurrentWallet] = useState('0x2546BcD3c84621e976D8185a91A922aE77ECEc30'); // Default Charlie
  const [selectedNetwork, setSelectedNetwork] = useState('monad');
  
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-purple-500 selection:text-white bg-[#060913]">
      
      {/* Top Floating Kwala-Style Navbar */}
      <Navbar
        currentWallet={currentWallet}
        identities={identities}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedNetwork={selectedNetwork}
        onSelectNetwork={setSelectedNetwork}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full space-y-12">
        
        {/* Kwala Hero & Feature Masonry Banner */}
        <KwalaHeroAndMasonry
          onStartAgent={() => setActiveTab('control')}
          onOpenDemo={() => setActiveTab('control')}
        />

        {/* Tab Views */}
        {loading ? (
          <div className="glass-panel p-12 text-center text-slate-400 font-mono space-y-3">
            <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Connecting to CleanAgent Protocol Server...</p>
          </div>
        ) : (
          <>
            {activeTab === 'control' && (
              <AgentControlPanel
                pools={pools}
                mandate={mandate}
                onRunAgentCycle={handleRunAgentCycle}
                onUpdateMandate={handleUpdateMandate}
                currentWallet={currentWallet}
                identities={identities}
              />
            )}

            {activeTab === 'pools' && (
              <CompliantPools
                pools={pools}
                mandate={mandate}
              />
            )}

            {activeTab === 'audit' && (
              <AgentAuditExplorer
                auditLogs={auditLogs}
              />
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

      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060913]/95 backdrop-blur-md py-8 px-4 text-center text-xs font-mono text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4.5 h-4.5 text-purple-400" />
            <span className="font-sans font-semibold text-slate-200">CleanAgent Protocol &copy; 2026 — Cleanverse Capability #8 Agent Skill Framework</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setIsSummaryModalOpen(true)} className="text-purple-400 hover:underline">One-Page Summary</button>
            <span className="text-emerald-400">CVI Verified Identity</span>
            <span className="text-sky-400">CVA Audit Provenance</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
