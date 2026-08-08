import React, { useState } from 'react';
import { Sun, Moon, GitFork, Menu, X, Wallet, ChevronDown } from 'lucide-react';

export default function KwalaNavbar({ 
  activeTab, 
  setActiveTab, 
  currentWallet, 
  onOpenWalletModal,
  isDarkMode,
  onToggleTheme 
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const GITHUB_URL = "https://github.com/Webghost01-NG/cleanagent";

  const shortAddress = currentWallet ? `${currentWallet.slice(0, 6)}...${currentWallet.slice(-4)}` : "Not Connected";

  const navLinks = [
    { id: "chat", label: "Chat" },
    { id: "control", label: "Dashboard" },
    { id: "pools", label: "Vaults" },
    { id: "audit", label: "Audit" },
    { id: "docs", label: "Docs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a283c] bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Left: Kwala-style Brand Wordmark */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          onClick={() => setActiveTab('control')}
        >
          <div className="size-8 rounded-lg bg-[#b87cf8]/20 border border-[#b87cf8]/40 flex items-center justify-center">
            <span className="text-[#b87cf8] font-black text-sm font-mono">C</span>
          </div>
          <span className="font-mono text-sm sm:text-base font-bold tracking-[0.12em] text-foreground">
            CleanAgent AI
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-xs font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === link.id
                  ? 'nav-tab-active'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="ml-1 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-purple-600" />}
          </button>

          {/* GitHub Repo Icon */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors rounded-lg"
            title="GitHub Repository"
          >
            <GitFork className="size-4" />
          </a>

          {/* Web3 Wallet Button */}
          <button
            onClick={onOpenWalletModal}
            className="ml-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-mono text-foreground transition-all hover:border-[#b87cf8]"
          >
            <Wallet className="size-3.5 text-[#b87cf8]" />
            <span>{shortAddress}</span>
            <ChevronDown className="size-3 opacity-60" />
          </button>

          {/* Kwala-style Get Started Pill Button */}
          <button
            onClick={() => setActiveTab('control')}
            className="ml-2 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 font-mono text-[11px] tracking-[0.12em] font-semibold uppercase text-foreground transition-all hover:bg-foreground hover:text-background"
          >
            Get Started
          </button>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={onToggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg"
          >
            {isDarkMode ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-purple-600" />}
          </button>

          <button
            onClick={onOpenWalletModal}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-mono text-foreground"
          >
            {shortAddress}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-foreground hover:bg-muted rounded-lg"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-2 font-mono text-xs">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeTab === link.id ? 'nav-tab-active' : 'text-muted-foreground'
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
