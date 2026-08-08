"use client";
import React, { useState } from 'react';
import { Sun, Moon, GitFork, Menu, X, Wallet, ChevronDown, Zap, ShieldCheck } from 'lucide-react';

export default function Navbar({ 
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
    <header className="sticky top-0 z-50 w-full theme-border border-b theme-card backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Left: Futuristic Brand Logo & Wordmark */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('control')}
        >
          {/* Custom Futuristic Vector Hexagon Emblem */}
          <div className="relative size-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 p-0.5 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
            <div className="size-full bg-[#0f0e17] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              {/* Radial Ambient Glow */}
              <div className="absolute inset-0 bg-purple-500/20 blur-sm"></div>
              
              {/* Custom SVG CleanAgent Brand Logo */}
              <svg className="size-5 text-purple-400 dark:text-[#b87cf8] relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="url(#logoGlow)" fillOpacity="0.15" stroke="url(#logoGrad)" />
                <path d="M13 10V3L5 14h6v7l8-11h-6z" fill="currentColor" stroke="none" />
                <defs>
                  <linearGradient id="logoGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#b87cf8" />
                    <stop offset="1" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="logoGlow" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9333ea" />
                    <stop offset="1" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-sm sm:text-base font-black tracking-wider theme-text flex items-center gap-1.5 font-sans">
              CLEAN<span className="text-purple-600 dark:text-[#b87cf8]">AGENT</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono font-bold uppercase tracking-normal">AI</span>
            </span>
            <span className="text-[9px] font-mono theme-text-muted tracking-tight hidden sm:block">Autonomous Monad Engine</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-xs font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === link.id
                  ? 'nav-tab-active font-bold'
                  : 'theme-text-muted hover:theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e]'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="ml-1 p-2 theme-text-muted hover:theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e] rounded-lg transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-purple-600" />}
          </button>

          {/* GitHub Repo Icon */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 theme-text-muted hover:theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e] transition-colors rounded-lg"
            title="GitHub Repository"
          >
            <GitFork className="size-4" />
          </a>

          {/* Web3 Wallet Button */}
          <button
            onClick={onOpenWalletModal}
            className="ml-1 flex items-center gap-2 px-3 py-1.5 rounded-lg theme-subcard text-xs font-mono theme-text transition-all hover:border-purple-500 cursor-pointer font-bold"
          >
            <Wallet className="size-3.5 text-purple-500 dark:text-[#b87cf8]" />
            <span>{shortAddress}</span>
            <ChevronDown className="size-3 opacity-60" />
          </button>

          {/* Get Started Pill Button */}
          <button
            onClick={() => setActiveTab('control')}
            className="ml-2 inline-flex items-center rounded-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 font-mono text-[11px] tracking-wider font-bold uppercase shadow-lg shadow-purple-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            Get Started
          </button>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={onToggleTheme}
            className="p-2 theme-text-muted hover:theme-text rounded-lg"
          >
            {isDarkMode ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-purple-600" />}
          </button>

          <button
            onClick={onOpenWalletModal}
            className="px-2.5 py-1.5 rounded-lg theme-subcard text-xs font-mono theme-text font-bold"
          >
            {shortAddress}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e] rounded-lg"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden theme-border border-b theme-card px-4 py-4 space-y-2 font-mono text-xs">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-bold ${
                activeTab === link.id ? 'nav-tab-active' : 'theme-text-muted'
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
