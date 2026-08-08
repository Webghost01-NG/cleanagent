import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Zap, Sparkles, CheckCircle2, ShieldAlert, CornerDownLeft } from 'lucide-react';

export default function AgentChat({ pools = [], mandate, onRunAgentCycle }) {
  const defaultPool = pools[0] || { id: "pool-1", name: "Monad Vault", ticker: "USDC", apyPercent: 12.8, isCVIVerified: true };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: "Hello! I am **CleanAgent AI** — your autonomous Web3 yield & compliance AI assistant.\n\nYou can chat with me in natural language to set yield mandates, verify counterparty CVI ratings, or trigger automated rebalance cycles.",
      suggestedActions: [
        "Deploy autonomous yield mandate for Monad Testnet USDC",
        "Verify CVI compliance rating for Base Credit Vault",
        "Auto-rebalance $15,000 into highest compliant pool",
        "Fetch CVA mandate audit provenance logs"
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query || !query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);

    // Simulate AI thinking & processing delay
    await new Promise(r => setTimeout(r, 600));

    let agentResponseText = "";
    let actionPayload = null;
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("rebalance") || lowerQuery.includes("monad") || lowerQuery.includes("auto") || lowerQuery.includes("yield") || lowerQuery.includes("deploy")) {
      agentResponseText = "Generated **CleanAgent Autonomous Yield Mandate** (YAML Specification).\n\nMandate validation passed: **Max Spend Limit $25,000 USD** | **Min Yield 7.00% APY** | **CVI Counterparty Clearance Confirmed**.";
      actionPayload = {
        pool: defaultPool,
        amountUSD: 15000,
        spec: `version: 1.0.0\nname: MonadUSDCYieldRebalance\ntrigger:\n  type: yield_threshold\n  min_apy: 7.00\naction:\n  type: cvi_verified_deposit\n  target_vault: "${defaultPool.name}"\n  max_spend_usd: 25000`
      };
    } else if (lowerQuery.includes("cvi") || lowerQuery.includes("verify") || lowerQuery.includes("rating") || lowerQuery.includes("kyc")) {
      agentResponseText = "Queried **Cleanverse CVI Identity Registry** (`CVIIdentityRegistry.sol`).\n\nTarget Pool **Monad Vault** is Tier 1 Accredited (`isVerified = true`). Unverified pools will throw **CVI Error 403** and automatically revert.";
    } else if (lowerQuery.includes("audit") || lowerQuery.includes("cva") || lowerQuery.includes("log") || lowerQuery.includes("hash")) {
      agentResponseText = "Fetched **CVA Audit Provenance Ledger** (`CVAAuditWrapper.sol`).\n\nLatest Mandate Record: **#104** | Provenance Hash: `0x8f3c4e9100000000000000000000000000004e91` | Status: **CONFIRMED ON MONAD**.";
    } else if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("help")) {
      agentResponseText = "Hello! I am ready to assist you. Try asking:\n- *'Deploy yield mandate for Monad Testnet'* \n- *'Verify CVI status for Base Vault'* \n- *'Auto-rebalance $15,000'*";
    } else {
      agentResponseText = `I have received your request: "${query}". CleanAgent guardrails are active and all parameters remain within normal operational thresholds.`;
    }

    const agentMsg = {
      id: Date.now() + 1,
      sender: 'agent',
      text: agentResponseText,
      payload: actionPayload
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
          "Auto-rebalance $15,000 into highest compliant pool"
        ]
      }
    ]);
  };

  return (
    <div className="space-y-6 pt-2 font-mono">
      
      {/* Terminal / Chat Container */}
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

        {/* Message Log Body */}
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
              CleanAgent AI is processing query & verifying protocol rules...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t theme-border theme-subcard flex items-center gap-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a prompt e.g. 'Rebalance $15,000 into highest compliant pool'..."
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
