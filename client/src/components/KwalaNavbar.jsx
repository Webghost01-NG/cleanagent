import React, { useState } from 'react';
import { ArrowUpRight, GitFork, Menu, X, ShieldCheck, Wallet, ChevronDown } from 'lucide-react';

export default function KwalaNavbar({ 
  activeTab, 
  setActiveTab, 
  currentWallet, 
  onOpenWalletModal,
  identities 
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const GITHUB_URL = "https://github.com/Webghost01-NG/cleanagent";

  const shortAddress = currentWallet ? `${currentWallet.slice(0, 6)}...${currentWallet.slice(-4)}` : "Not Connected";

  const navLinks = [
    { id: "chat", label: "Agent Chat" },
    { id: "control", label: "Dashboard" },
    { id: "pools", label: "Compliant Vaults" },
    { id: "audit", label: "Audit Ledger" },
    { id: "docs", label: "Docs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a283c] bg-[#0f0e17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Left: Kwala-style Brand Wordmark */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          onClick={() => setActiveTab('control')}
        >
          <div className="size-8 rounded-lg bg-[#b87cf8]/20 border border-[#b87cf8]/40 flex items-center justify-center">
            <span className="text-[#b87cf8] font-black text-sm font-mono">C</span>
          </div>
          <span className="font-mono text-sm sm:text-base font-bold tracking-[0.12em] text-[#f4f3fb]">
            CleanAgent AI
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-xs font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeTab === link.id
                  ? 'text-[#f4f3fb] bg-[#1f1e2e] font-bold border border-[#2a283c]'
                  : 'text-[#9a98b0] hover:text-[#f4f3fb] hover:bg-[#1f1e2e]/50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <a
            href="https://cleanverse.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 text-xs text-[#9a98b0] hover:text-[#f4f3fb] transition-colors rounded-md hover:bg-[#1f1e2e]/50"
          >
            Cleanverse
            <ArrowUpRight className="size-3 opacity-60" />
          </a>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 flex items-center gap-1.5 px-2.5 py-2 text-[#9a98b0] hover:text-[#f4f3fb] transition-colors rounded-md hover:bg-[#1f1e2e]/50"
            title="GitHub Repository"
          >
            <GitFork className="size-4" />
          </a>

          {/* Web3 Wallet Button */}
          <button
            onClick={onOpenWalletModal}
            className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2a283c] bg-[#181724] hover:bg-[#1f1e2e] text-xs font-mono text-[#f4f3fb] transition-all"
          >
            <Wallet className="size-3.5 text-[#b87cf8]" />
            <span>{shortAddress}</span>
            <ChevronDown className="size-3 opacity-60" />
          </button>

          {/* Kwala-style Get Started Pill Button */}
          <button
            onClick={() => setActiveTab('control')}
            className="ml-2 inline-flex items-center rounded-full border border-[#2a283c] bg-[#181724] px-4 py-1.5 font-mono text-[11px] tracking-[0.12em] font-semibold uppercase text-[#f4f3fb] transition-all hover:bg-[#f4f3fb] hover:text-[#0f0e17]"
          >
            Get Started
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenWalletModal}
            className="px-2.5 py-1.5 rounded-lg border border-[#2a283c] bg-[#181724] text-xs font-mono text-[#f4f3fb]"
          >
            {shortAddress}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#f4f3fb] hover:bg-[#1f1e2e] rounded-lg"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[#2a283c] bg-[#0f0e17] px-4 py-4 space-y-2 font-mono text-xs">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeTab === link.id ? 'bg-[#1f1e2e] text-[#f4f3fb] font-bold' : 'text-[#9a98b0]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
