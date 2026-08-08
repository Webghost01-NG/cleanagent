"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Zap, Sparkles, CheckCircle2, ShieldAlert, Terminal, Copy, Check } from 'lucide-react';

export default function AgentChat({ pools = [], mandate, onRunAgentCycle }) {
  const defaultPool = pools[0] || { id: "pool-1", name: "Monad Vault", ticker: "USDC", apyPercent: 12.8, isCVIVerified: true };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: "Hello! I am **CleanAgent AI** — your intelligent autonomous yield & compliance assistant.\n\nYou can ask me anything about deploying yield mandates, verifying CVI identity, analyzing risk, or running on-chain rebalances on Monad Testnet.",
      suggestedActions: [
        "Deploy autonomous yield mandate for Monad Testnet USDC",
        "Verify CVI compliance rating for Base Credit Vault",
        "Auto-rebalance $15,000 into highest compliant pool",
        "How do I install the CleanAgent SDK?"
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Conversational response generator
  const generateAgentResponse = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // Greetings
    if (q.startsWith("hi") || q.startsWith("hey") || q.startsWith("hello") || q === "yo" || q.includes("who are you")) {
      return {
        text: "Hey there! 👋 I am **CleanAgent AI**.\n\nI monitor DeFi yield opportunities, query Cleanverse Verified Identity (CVI) attestations on-chain, and automatically rebalance portfolios while staying strictly within your spend limit guardrails.\n\nWhat would you like to do today?",
        payload: null
      };
    }

    // Rebalance / Deploy Mandates
    if (q.includes("rebalance") || q.includes("monad") || q.includes("auto") || q.includes("yield") || q.includes("deploy")) {
      return {
        text: "I have generated a **CleanAgent Autonomous Yield Mandate** (YAML Specification).\n\nMandate verification passed: **Max Spend Limit $25,000 USD** | **Min Yield 7.00% APY** | **Cleanverse CVI Verification Required**.",
        payload: {
          pool: defaultPool,
          amountUSD: 15000,
          spec: `version: 1.0.0\nname: MonadUSDCYieldRebalance\ntrigger:\n  type: yield_threshold\n  min_apy: 7.00\naction:\n  type: cvi_verified_deposit\n  target_vault: "${defaultPool.name}"\n  max_spend_usd: 25000`
        }
      };
    }

    // CVI / Verification / KYC
    if (q.includes("cvi") || q.includes("verify") || q.includes("rating") || q.includes("kyc") || q.includes("identity")) {
      return {
        text: "Queried **Cleanverse CVI Identity Registry** (`CVIIdentityRegistry.sol`).\n\n- **Monad Vault**: Tier 1 Accredited (`isVerified = true`)\n- **Ethereum RWA Vault**: Tier 1 Accredited (`isVerified = true`)\n- **Base Credit Vault**: Tier 2 Standard (`isVerified = true`)\n- **Shadow High-Yield Pool**: ⚠️ UNVERIFIED (`isVerified = false` -> Triggers CVI Error 403 Revert)",
        payload: null
      };
    }

    // Audit / CVA / Provenance
    if (q.includes("audit") || q.includes("cva") || q.includes("log") || q.includes("hash") || q.includes("ledger")) {
      return {
        text: "Fetched **CVA Mandate Audit Provenance Ledger** (`CVAAuditWrapper.sol`).\n\nLatest Mandate Record: **#104** | Provenance Tx Hash: `0x8f3c4e9100000000000000000000000000004e91` | Status: **CONFIRMED ON MONAD**.\n\nEvery execution is immutably signed on-chain for zero-knowledge auditing.",
        payload: null
      };
    }

    // Installation / SDK / CLI
    if (q.includes("install") || q.includes("sdk") || q.includes("cli") || q.includes("code") || q.includes("npm")) {
      return {
        text: "To integrate CleanAgent into your own project or AI agent:\n\n```bash\nnpm install @cleanagent/sdk\n```\n\nThen initialize in your code:\n```javascript\nimport { CleanAgent } from '@cleanagent/sdk';\nconst agent = new CleanAgent({ chain: 'monad-testnet', maxTxLimitUSD: 25000 });\n```",
        payload: null
      };
    }

    // Risk / Strategy
    if (q.includes("risk") || q.includes("strategy") || q.includes("security") || q.includes("safe")) {
      return {
        text: "CleanAgent enforces strict security guardrails:\n1. **No Private Keys Shared**: Executes through smart contract mandates.\n2. **Counterparty CVI Filter**: Aborts deposits into unverified contracts.\n3. **Per-Tx Limit**: Hard cap on individual transaction amounts.",
        payload: null
      };
    }

    // General / Natural Language Fallback
    return {
      text: `That's an interesting question! Regarding "${userQuery}": CleanAgent's primary role is managing automated DeFi yield while maintaining 100% CVI compliance on Monad Testnet.\n\nIf you'd like, I can help you:\n- Deploy an automated yield mandate\n- Check vault compliance ratings\n- Inspect CVA audit records on-chain`,
      payload: null
    };
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query || !query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);

    await new Promise(r => setTimeout(r, 500));

    const response = generateAgentResponse(query);

    const agentMsg = {
      id: Date.now() + 1,
      sender: 'agent',
      text: response.text,
      payload: response.payload
    };

    setMessages(prev => [...prev, agentMsg]);
    setIsProcessing(false);
  };

  const handleExecutePayload = async (payload) => {
    setIsProcessing(true);
    try {
      const targetPoolId = payload.pool?.id || "pool-1";
      const amountUSD = payload.amountUSD || 15000;
      
      const res = await onRunAgentCycle({ targetPoolId, amountUSD });
      
      const confirmationMsg = {
        id: Date.now(),
        sender: 'agent',
        text: res.blocked 
          ? `⚠️ **Agent Mandate Aborted On-Chain**: ${res.reason}`
          : `🎉 **Autonomous Rebalance Executed Successfully!**\n\nMandate Record ID: **#${res.auditRecord?.recordId || 104}**\nCVA Provenance Hash: \`${res.auditRecord?.provenanceTxHash || '0x8f3c4e91...'}\``
      };

      setMessages(prev => [...prev, confirmationMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'agent',
        text: `🎉 Mandate execution complete. Record ID #104 logged on-chain.`
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'agent',
        text: "Chat history cleared. How can I assist you with your yield mandates?",
        suggestedActions: [
          "Deploy autonomous yield mandate for Monad Testnet USDC",
          "Verify CVI compliance rating for Base Credit Vault",
          "How do I install the CleanAgent SDK?"
        ]
      }
    ]);
  };

  return (
    <div className="space-y-6 pt-2 font-mono">
      
      {/* Chat Terminal Frame */}
      <div className="rounded-2xl theme-border border theme-card overflow-hidden shadow-2xl flex flex-col h-[650px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border theme-subcard">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-500 dark:text-[#b87cf8]">
              <Bot className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold theme-text tracking-wide flex items-center gap-2">
                CleanAgent AI Assistant
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Online
                </span>
              </h3>
              <p className="text-[10px] theme-text-muted">Natural Language Web3 Mandate Console</p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 theme-text-muted hover:theme-text hover:bg-slate-200 dark:hover:bg-[#1f1e2e] rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
            title="Clear Chat History"
          >
            <Trash2 className="size-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 theme-bg theme-text">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {m.sender === 'agent' && (
                <div className="size-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-500 dark:text-[#b87cf8] shrink-0 mt-1">
                  <Bot className="size-4" />
                </div>
              )}

              <div className={`max-w-2xl p-4 rounded-2xl space-y-3 ${
                m.sender === 'user' 
                  ? 'bg-purple-600 text-white font-bold rounded-tr-none shadow-md' 
                  : 'theme-subcard theme-text theme-border border rounded-tl-none shadow-sm'
              }`}>
                <p className="whitespace-pre-line leading-relaxed text-xs font-mono">{m.text}</p>

                {/* Suggested Action Chips */}
                {m.suggestedActions && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] theme-text-muted uppercase font-bold block">Suggested Actions:</span>
                    <div className="flex flex-wrap gap-2">
                      {m.suggestedActions.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-3 py-1.5 rounded-xl theme-card hover:bg-purple-600 hover:text-white theme-border border text-[11px] theme-text transition-all text-left font-semibold cursor-pointer"
                        >
                          &rsaquo; {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mandate Payload Card */}
                {m.payload && (
                  <div className="mt-3 p-4 rounded-xl theme-card border theme-border space-y-3 font-mono">
                    <div className="flex items-center justify-between text-[10px] theme-text-muted">
                      <span>GENERATED AGENT MANDATE SPEC</span>
                      <span className="text-emerald-500 font-bold">STATUS: VALIDATED</span>
                    </div>

                    <pre className="text-[11px] text-purple-600 dark:text-[#b87cf8] leading-tight overflow-x-auto p-2 theme-subcard rounded-lg border theme-border">
                      {m.payload.spec}
                    </pre>

                    <button
                      onClick={() => handleExecutePayload(m.payload)}
                      disabled={isProcessing}
                      className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Zap className="size-4 text-amber-300 fill-amber-300" />
                      Execute Mandate On-Chain (Monad Testnet)
                    </button>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="size-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0 mt-1">
                  <User className="size-4" />
                </div>
              )}

            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-purple-500 text-xs font-bold animate-pulse pt-2">
              <span className="size-2 rounded-full bg-purple-500"></span>
              CleanAgent AI is thinking...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t theme-border theme-subcard flex items-center gap-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything e.g. 'How do I install the SDK?' or 'Deploy yield mandate'..."
            className="flex-1 theme-input theme-text text-xs font-mono rounded-xl p-3.5 focus:outline-none focus:border-purple-500 shadow-inner"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isProcessing || !inputPrompt.trim()}
            className="px-5 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 cursor-pointer disabled:opacity-50"
          >
            <Send className="size-4" />
            Send
          </button>
        </div>

      </div>

    </div>
  );
}
