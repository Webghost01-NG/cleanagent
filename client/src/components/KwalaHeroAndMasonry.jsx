import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ShieldCheck, Cpu, Layers, ArrowRight, Zap, Sparkles, CheckCircle2, Terminal } from 'lucide-react';

export default function KwalaHeroAndMasonry({ onStartAgent, onOpenDemo }) {
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

  const handleHeroAction = () => {
    onStartAgent();
    const elem = document.getElementById('agent-control-panel-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 py-4">
      
      {/* Kwala-Style Deep Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden border border-purple-500/30 bg-[#100029] shadow-2xl">
        
        {/* Glow Spheres */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/25 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            Cleanverse Capability #8: Agent Skill Framework
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight font-sans">
            The Fastest <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400">Autonomous EVM DeFi Engine</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Start your Web3 financial workflows with programmable smart mandates, CVI counterparty listeners, transaction execution managers, and CVA provenance tracking.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleHeroAction}
              className="btn-primary py-4 px-8 text-sm font-extrabold flex items-center gap-2.5 shadow-2xl shadow-purple-500/40 uppercase tracking-wider font-mono hover:scale-105 transition-transform"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              START AGENT PROJECT
            </button>

            <button
              onClick={handleHeroAction}
              className="py-4 px-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-mono font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              INSPECT LIVE AGENT TRACE
            </button>
          </div>

          {/* Trust Pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400 pt-6">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> CVI Verified Identity</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> CVA Asset Provenance</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Monad & Multi-Chain</span>
          </div>

        </motion.div>
      </div>

      {/* Kwala-Style Masonry Capability Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">Every Blockchain Feature Integrated as a Platform</h2>
          <p className="text-sm text-slate-400">Frontend stays thin. Servers disappear. CleanAgent workflows become your backend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <motion.div 
            variants={itemVariants} 
            onClick={handleHeroAction}
            className="glass-panel p-6 space-y-4 hover:border-purple-500/50 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">Smart Agent Mandates</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Add programmable smart mandates. No private-key handling, no server setup. We manage execution & spend limits automatically.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={itemVariants} 
            onClick={handleHeroAction}
            className="glass-panel p-6 space-y-4 hover:border-emerald-500/50 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">CVI Counterparty Verifier</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Monitor target liquidity pools, EOAs, or smart contracts on-chain. The moment a pool lacks CVI, execution aborts instantly.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={itemVariants} 
            onClick={handleHeroAction}
            className="glass-panel p-6 space-y-4 hover:border-sky-500/50 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">CVA Provenance Manager</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Execute, retry, and finalize autonomous rebalance transactions with strong CVA cryptographic audit guarantees.
            </p>
          </motion.div>

        </div>
      </motion.div>

      {/* Kwala-Style Orbiting Multi-Chain Banner */}
      <div className="glass-panel p-8 text-center space-y-4 border-slate-800">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold block">
          USE CLEANAGENT TO BUILD ON ANY EVM CHAIN
        </span>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {['Monad Testnet', 'Ethereum Mainnet', 'Base Mainnet', 'Arbitrum One', 'BNB Chain', 'Polygon', 'HashKey'].map((chain, idx) => (
            <span key={idx} className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-200 font-semibold shadow-md hover:border-purple-500/40 transition-colors">
              ⚡ {chain}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
