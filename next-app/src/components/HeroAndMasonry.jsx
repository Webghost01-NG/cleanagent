"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ShieldCheck, Layers, Zap, Sparkles, CheckCircle2, Terminal } from 'lucide-react';

export default function HeroAndMasonry({ onStartAgent, onOpenChat }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const chainsList = [
    'Monad Testnet', 
    'Ethereum Mainnet', 
    'Base Mainnet', 
    'Arbitrum One', 
    'BNB Chain', 
    'Polygon', 
    'HashKey'
  ];

  return (
    <div className="space-y-16 py-4">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden theme-border border theme-card shadow-2xl">
        
        {/* Glow Spheres */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full theme-subcard text-xs font-mono font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            Autonomous DeFi Agent Engine
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight theme-text leading-tight font-sans">
            The Fastest <span className="text-purple-600 dark:text-[#b87cf8]">Autonomous EVM DeFi Engine</span>
          </h1>

          <p className="text-base sm:text-xl theme-text-muted max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Start your Web3 financial workflows with programmable smart mandates, CVI counterparty listeners, transaction execution managers, and CVA provenance tracking.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartAgent}
              title="Connect Wallet & Open Agent Mandate Control Panel"
              className="py-4 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-extrabold flex flex-col items-center gap-1 shadow-2xl shadow-purple-500/30 uppercase tracking-wider font-mono hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                START AGENT PROJECT
              </div>
              <span className="text-[9px] font-normal normal-case opacity-90">Open Mandate Control Panel & Configure Guardrails</span>
            </button>

            <button
              onClick={onOpenChat}
              title="Open Natural Language AI Agent Console"
              className="py-4 px-8 rounded-xl theme-subcard theme-text theme-border border text-sm font-mono font-bold flex flex-col items-center gap-1 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-500 dark:text-[#b87cf8]" />
                LAUNCH AGENT CHAT
              </div>
              <span className="text-[9px] theme-text-muted font-normal normal-case">Chat in Natural Language to Generate Mandates</span>
            </button>
          </div>

          {/* Key Bullet Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono theme-text-muted pt-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              CVI Verified Identity
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              CVA Asset Provenance
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Monad & Multi-Chain
            </span>
          </div>

        </motion.div>
      </div>

      {/* Infinite Horizontal Scrolling Multi-Chain Marquee Loop */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            USE CLEANAGENT TO BUILD ON ANY EVM CHAIN
          </p>
        </div>

        <div className="relative w-full overflow-hidden py-3">
          {/* Edge Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee flex items-center gap-4">
            {[...chainsList, ...chainsList, ...chainsList].map((chain, idx) => (
              <div
                key={idx}
                className="px-5 py-2.5 rounded-full theme-subcard border theme-border font-mono text-xs font-bold theme-text flex items-center gap-2 shrink-0 shadow-sm hover:border-purple-500 transition-all cursor-pointer hover:scale-105"
              >
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>⚡ {chain}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black theme-text font-sans">Every Blockchain Feature Integrated as a Platform</h2>
          <p className="text-sm theme-text-muted">Frontend stays thin. Servers disappear. CleanAgent workflows become your backend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="theme-card p-6 space-y-4 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl theme-subcard flex items-center justify-center text-purple-500 dark:text-[#b87cf8] group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold theme-text group-hover:text-purple-500 transition-colors font-sans">Smart Agent Mandates</h3>
            <p className="text-xs theme-text-muted leading-relaxed font-light font-sans">
              Add programmable smart mandates. No private-key handling, no server setup. We manage execution & spend limits automatically.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="theme-card p-6 space-y-4 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl theme-subcard flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold theme-text group-hover:text-emerald-500 transition-colors font-sans">CVI Counterparty Verifier</h3>
            <p className="text-xs theme-text-muted leading-relaxed font-light font-sans">
              Monitor target liquidity pools, EOAs, or smart contracts on-chain. The moment a pool lacks CVI, execution aborts instantly.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="theme-card p-6 space-y-4 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl theme-subcard flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold theme-text group-hover:text-sky-500 transition-colors font-sans">CVA Provenance Tracking</h3>
            <p className="text-xs theme-text-muted leading-relaxed font-light font-sans">
              Every rebalance creates an immutable, verifiable proof record on Monad Testnet for auditing and compliance transparency.
            </p>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
