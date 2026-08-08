import React, { useState } from 'react';
import { Send, Bot, ShieldCheck, CheckCircle2, AlertOctagon, Terminal, ArrowRight, Zap, Sparkles, RefreshCw } from 'lucide-react';

export default function KwalaAgentChat({ pools, mandate, onRunAgentCycle }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: "Hello! I am **CleanAgent AI** — your autonomous Web3 yield & compliance engine powered by Cleanverse Capability #8 (Agent Skill Framework).\n\nAsk me to deploy yield mandates, verify counterparty CVI identity, or execute automated rebalances across Monad Testnet and Base.",
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

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);

    await new Promise(r => setTimeout(r, 600));

    let agentResponseText = "";
    let actionPayload = null;

    if (query.toLowerCase().includes("rebalance") || query.toLowerCase().includes("monad") || query.toLowerCase().includes("auto")) {
      agentResponseText = "Generated **CleanAgent Yield Mandate** (Kwalang YAML Specification).\n\nMandate validation passed: **Max Spend Limit $25,000 USD** | **Min Yield 7.00% APY** | **Cleanverse CVI Verification Required**.";
      actionPayload = {
        pool: pools[0], // Monad Vault
        amountUSD: 15000,
        yaml: `version: 1.0.0\nname: MonadUSDCYieldRebalance\ntrigger:\n  type: yield_threshold\n  min_apy: 7.00\naction:\n  type: cvi_verified_deposit\n  vault: "0x7a83...4e91"\n  max_spend: 25000`
      };
    } else if (query.toLowerCase().includes("cvi") || query.toLowerCase().includes("verify")) {
      agentResponseText = "Checked **Cleanverse CVI Identity Registry** (`CVIIdentityRegistry.sol`).\n\nTarget Pool **Monad Vault** is Tier 1 Accredited (`cviRegistry.isVerified = true`).";
    } else {
      agentResponseText = `Understood. Processing your request: "${query}" against Cleanverse Capability #8 Agent Skill Rules.`;
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

  return (
    <div className="space-y-6 pt-2 font-mono">
      
      {/* Terminal Window Header */}
      <div className="rounded-2xl border border-[#2a283c] bg-[#181724] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a283c] bg-[#14131d]">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-yellow-400/80" />
            <span className="size-2.5 rounded-full bg-green-400/80" />
            <span className="ml-2 font-mono text-[11px] tracking-widest text-[#9a98b0] uppercase font-bold flex items-center gap-1.5">
              <Bot className="size-3.5 text-[#b87cf8]" />
              CleanAgent AI &middot; Natural Language Agent Console
            </span>
          </div>

          <span className="text-[10px] text-[#b87cf8] bg-[#b87cf8]/10 border border-[#b87cf8]/30 px-2.5 py-0.5 rounded-full font-bold">
            Capability #8 Ready
          </span>
        </div>

        {/* Message Log */}
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto text-xs">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {m.sender === 'agent' && (
                <div className="size-8 rounded-lg bg-[#b87cf8]/20 border border-[#b87cf8]/30 flex items-center justify-center text-[#b87cf8] shrink-0">
                  <Bot className="size-4" />
                </div>
              )}

              <div className={`max-w-2xl p-4 rounded-2xl space-y-3 ${
                m.sender === 'user' 
                  ? 'bg-[#b87cf8] text-[#0f0e17] font-bold rounded-tr-none' 
                  : 'bg-[#1f1e2e] border border-[#2a283c] text-[#f4f3fb] rounded-tl-none'
              }`}>
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                {/* Suggested Action Chips */}
                {m.suggestedActions && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] text-[#9a98b0] uppercase font-bold block">Suggested Prompts:</span>
                    <div className="flex flex-wrap gap-2">
                      {m.suggestedActions.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-3 py-1.5 rounded-xl bg-[#181724] hover:bg-[#b87cf8] hover:text-[#0f0e17] border border-[#2a283c] text-[11px] text-[#f4f3fb] transition-all text-left font-semibold"
                        >
                          &rsaquo; {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* YAML Payload Preview Card */}
                {m.payload && (
                  <div className="mt-3 p-4 rounded-xl bg-[#0f0e17] border border-[#2a283c] space-y-3 font-mono">
                    <div className="flex items-center justify-between text-[10px] text-[#9a98b0]">
                      <span>GENERATED KWALANG YAML WORKFLOW</span>
                      <span className="text-[#34d399] font-bold">STATUS: VALIDATED</span>
                    </div>

                    <pre className="text-[11px] text-[#b87cf8] leading-tight overflow-x-auto">
                      {m.payload.yaml}
                    </pre>

                    <button
                      onClick={async () => {
                        const res = await onRunAgentCycle({ targetPoolId: m.payload.pool.id, amountUSD: m.payload.amountUSD });
                        alert(`🎉 Agent Cycle Executed!\n\nMandate Record #${res.auditRecord?.recordId || 104}\nCVA Hash: ${res.auditRecord?.provenanceTxHash || '0x8f3c...'}`);
                      }}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#b87cf8] hover:bg-[#a855f7] text-[#0f0e17] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Zap className="size-4" />
                      Execute Mandate On-Chain (Monad Testnet)
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-[#b87cf8] text-xs font-bold animate-pulse">
              <span className="size-2 rounded-full bg-[#b87cf8]"></span>
              CleanAgent AI is generating workflow & querying CVI identity...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#2a283c] bg-[#14131d] flex items-center gap-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a natural language mandate e.g. 'Rebalance $15,000 into highest compliant pool'..."
            className="flex-1 bg-[#0f0e17] border border-[#2a283c] text-[#f4f3fb] text-xs font-mono rounded-xl p-3.5 focus:outline-none focus:border-[#b87cf8]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isProcessing}
            className="px-5 py-3.5 rounded-xl bg-[#b87cf8] hover:bg-[#a855f7] text-[#0f0e17] font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#b87cf8]/20 cursor-pointer"
          >
            <Send className="size-4" />
            Send
          </button>
        </div>

      </div>

    </div>
  );
}
