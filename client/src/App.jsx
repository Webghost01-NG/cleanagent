import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OnboardingBanner from './components/OnboardingBanner';
import SimpleMarketplace from './components/SimpleMarketplace';
import MyPortfolioAndTransfers from './components/MyPortfolioAndTransfers';
import WalletModal from './components/WalletModal';
import TokenizeModal from './components/TokenizeModal';
import SummaryModal from './components/SummaryModal';
import KYCModal from './components/KYCModal';
import { connectEVMWallet, connectPhantomWallet } from './services/web3';
import { ShieldCheck } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'portfolio'
  const [currentWallet, setCurrentWallet] = useState('0x2546BcD3c84621e976D8185a91A922aE77ECEc30'); // Default Charlie
  const [selectedNetwork, setSelectedNetwork] = useState('cleanverse');
  
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTokenizeModalOpen, setIsTokenizeModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);

  const [properties, setProperties] = useState([]);
  const [identities, setIdentities] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial protocol state from Express Backend
  const fetchProtocolData = async () => {
    try {
      setLoading(true);
      const [resProps, resIdentities, resAudit] = await Promise.all([
        fetch(`${API_BASE}/properties`).then(r => r.json()),
        fetch(`${API_BASE}/cvi/identities`).then(r => r.json()),
        fetch(`${API_BASE}/cva/audit-trail`).then(r => r.json())
      ]);

      setProperties(resProps);
      setIdentities(resIdentities);
      setAuditLogs(resAudit);
    } catch (err) {
      console.error("Error connecting to Cleanverse Protocol Backend:", err);
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

  // Tokenize Property Handler
  const handleListProperty = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/properties`, {
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

  // Buy Shares Handler
  const handleBuyShares = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/transfer`, {
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

  // Transfer Handler
  const handleExecuteTransfer = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/transfer`, {
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

  // Issue CVI Verification Handler
  const handleVerifyIdentity = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/cvi/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      await fetchProtocolData();
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentWallet={currentWallet}
        identities={identities}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenTokenizeModal={() => setIsTokenizeModalOpen(true)}
        onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedNetwork={selectedNetwork}
        onSelectNetwork={setSelectedNetwork}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full">
        
        {/* Beginner Stepper Onboarding Banner */}
        <OnboardingBanner
          currentWallet={currentWallet}
          identities={identities}
          onOpenWallet={() => setIsWalletModalOpen(true)}
          onOpenKYC={() => setIsKYCModalOpen(true)}
          onSelectTab={setActiveTab}
        />

        {/* Tab Views */}
        {loading ? (
          <div className="glass-panel p-12 text-center text-slate-400 font-mono space-y-3">
            <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Connecting to EstateKey Protocol Server...</p>
          </div>
        ) : (
          <>
            {activeTab === 'marketplace' && (
              <SimpleMarketplace
                properties={properties}
                currentWallet={currentWallet}
                identities={identities}
                onBuyShares={handleBuyShares}
                onOpenKYC={() => setIsKYCModalOpen(true)}
              />
            )}

            {activeTab === 'portfolio' && (
              <MyPortfolioAndTransfers
                properties={properties}
                identities={identities}
                currentWallet={currentWallet}
                onExecuteTransfer={handleExecuteTransfer}
                auditLogs={auditLogs}
                onOpenKYC={() => setIsKYCModalOpen(true)}
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

      <TokenizeModal
        isOpen={isTokenizeModalOpen}
        onClose={() => setIsTokenizeModalOpen(false)}
        onListProperty={handleListProperty}
      />

      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
      />

      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        currentWallet={currentWallet}
        identities={identities}
        onVerifyIdentity={handleVerifyIdentity}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md py-6 px-4 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>EstateKey &copy; 2026 — Compliant Real Estate RWA Protocol</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setIsSummaryModalOpen(true)} className="text-sky-400 hover:underline">One-Page Summary</button>
            <button onClick={() => setIsKYCModalOpen(true)} className="text-emerald-400 hover:underline">Get CVI Verified</button>
            <span className="text-purple-400">Cleanverse Protocol</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
