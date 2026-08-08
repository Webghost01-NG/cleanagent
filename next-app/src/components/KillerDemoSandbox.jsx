"use client";
import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, ArrowRight, RefreshCw, AlertOctagon, CheckCircle2, Lock, FileCode2, Layers, Key } from 'lucide-react';

export default function KillerDemoSandbox({ 
  properties, 
  identities, 
  onExecuteTransfer 
}) {
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || "prop-1");
  const [senderWallet, setSenderWallet] = useState("0x2546BcD3c84621e976D8185a91A922aE77ECEc30"); // Charlie (Accredited)
  const [recipientWallet, setRecipientWallet] = useState("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"); // Bob (Unverified)
  const [sharesToTransfer, setSharesToTransfer] = useState(50);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [transferLog, setTransferLog] = useState(null);
  const [evaluationSteps, setEvaluationSteps] = useState([]);

  const selectedProperty = properties.find(p => p.id === selectedPropId) || properties[0];
  const senderIdentity = identities.find(i => i.wallet === senderWallet) || { name: senderWallet, isVerified: false };
  const recipientIdentity = identities.find(i => i.wallet === recipientWallet) || { name: recipientWallet, isVerified: false };

  const senderBalance = selectedProperty?.balances[senderWallet] || 0;

  const loadScenario = (scenarioType) => {
    setTransferLog(null);
    setEvaluationSteps([]);

    if (scenarioType === 'UNVERIFIED_REJECT') {
      // Charlie (Accredited) -> Bob (Unverified)
      setSelectedPropId("prop-1");
      setSenderWallet("0x2546BcD3c84621e976D8185a91A922aE77ECEc30");
      setRecipientWallet("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc");
      setSharesToTransfer(50);
    } else if (scenarioType === 'NON_ACCREDITED_REJECT') {
      // Charlie -> Alice (Verified Standard) on Accredited-Only Property
      setSelectedPropId("prop-1");
      setSenderWallet("0x2546BcD3c84621e976D8185a91A922aE77ECEc30");
      setRecipientWallet("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      setSharesToTransfer(25);
    } else if (scenarioType === 'VERIFIED_SUCCESS') {
      // Charlie -> Alice on Standard Property (Malibu Villa)
      setSelectedPropId("prop-2");
      setSenderWallet("0x2546BcD3c84621e976D8185a91A922aE77ECEc30");
      setRecipientWallet("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      setSharesToTransfer(100);
    }
  };

  const handleRunTransferTest = async () => {
    setIsExecuting(true);
    setTransferLog(null);
    setEvaluationSteps([
      { step: 1, text: "Reading Cleanverse CVI Registry for Sender...", status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 300));
    setEvaluationSteps(prev => [
      { step: 1, text: `Sender CVI Check: ${senderIdentity.name} (${senderIdentity.isVerified ? 'VERIFIED' : 'UNVERIFIED'})`, status: senderIdentity.isVerified ? "pass" : "fail" },
      { step: 2, text: "Reading Cleanverse CVI Registry for Recipient...", status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 400));
    const recipientPass = recipientIdentity.isVerified;
    setEvaluationSteps(prev => [
      prev[0],
      { step: 2, text: `Recipient CVI Check: ${recipientIdentity.name} (${recipientIdentity.isVerified ? 'VERIFIED' : 'UNVERIFIED'})`, status: recipientPass ? "pass" : "fail" },
      { step: 3, text: `Evaluating Asset Accreditation Requirements (${selectedProperty.ticker})...`, status: "pending" }
    ]);

    await new Promise(r => setTimeout(r, 400));
    
    // Execute backend transfer
    const result = await onExecuteTransfer({
      propertyId: selectedPropId,
      fromWallet: senderWallet,
      toWallet: recipientWallet,
      shares: sharesToTransfer
    });

    setTransferLog(result);
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Callout */}
      <div className="glass-panel p-6 border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-slate-900 to-indigo-950/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                AUTOMATED PROTOCOL GUARDRAILS
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">Cleanverse CVI & CVA Rule Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              Real-Time Compliance Enforcement Tester
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Test transferring fractional property shares between wallets. Watch Cleanverse Verified Identity (CVI) automatically block unverified recipients at the smart contract level, recording the violation to the Cleanverse Verified Assets (CVA) audit ledger.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">COMPLIANCE TEST SCENARIOS:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadScenario('UNVERIFIED_REJECT')}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-mono font-semibold flex items-center gap-1"
              >
                1. Transfer to Unverified (Rejects)
              </button>
              <button
                onClick={() => loadScenario('NON_ACCREDITED_REJECT')}
                className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-mono font-semibold flex items-center gap-1"
              >
                2. Non-Accredited Check (Rejects)
              </button>
              <button
                onClick={() => loadScenario('VERIFIED_SUCCESS')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-semibold flex items-center gap-1"
              >
                3. Compliant Transfer (Passes)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Transfer Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Transfer Setup Card */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileCode2 className="w-5 h-5 text-sky-400" />
            Configure Share Transfer Transaction
          </h3>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">SELECT TOKENIZED RWA ASSET:</label>
            <select
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.ticker}) — {p.requiresAccreditedOnly ? 'Restricted: Accredited Only' : 'Standard CVI Verified'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Sender */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                SENDER (FROM WALLET)
              </span>
              <select
                value={senderWallet}
                onChange={(e) => setSenderWallet(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs font-mono rounded-lg p-2 focus:outline-none focus:border-emerald-500"
              >
                {identities.map(i => (
                  <option key={i.wallet} value={i.wallet}>
                    {i.name} ({i.isVerified ? (i.isAccredited ? 'Verified Accredited' : 'Verified Standard') : 'Unverified'})
                  </option>
                ))}
              </select>

              <div className="text-xs font-mono text-slate-300 pt-1 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">CVI STATUS:</span>
                  <span className={senderIdentity.isVerified ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                    {senderIdentity.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CURRENT BALANCE:</span>
                  <span className="text-sky-400 font-bold">{senderBalance} Shares</span>
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-sky-400 uppercase font-bold block">
                RECIPIENT (TO WALLET)
              </span>
              <select
                value={recipientWallet}
                onChange={(e) => setRecipientWallet(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs font-mono rounded-lg p-2 focus:outline-none focus:border-sky-500"
              >
                {identities.map(i => (
                  <option key={i.wallet} value={i.wallet}>
                    {i.name} ({i.isVerified ? (i.isAccredited ? 'Verified Accredited' : 'Verified Standard') : 'UNVERIFIED WALLET'})
                  </option>
                ))}
              </select>

              <div className="text-xs font-mono text-slate-300 pt-1 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">CVI STATUS:</span>
                  <span className={recipientIdentity.isVerified ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {recipientIdentity.isVerified ? (recipientIdentity.isAccredited ? 'VERIFIED ACCREDITED' : 'VERIFIED STANDARD') : 'UNVERIFIED (WILL REVERT)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CVI CERT:</span>
                  <span className="text-slate-300 truncate max-w-[120px] inline-block">{recipientIdentity.cviCertificateHash || 'NONE'}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex-1">
              <label className="text-xs font-mono text-slate-400 block mb-1">SHARES TO TRANSFER:</label>
              <input
                type="number"
                min="1"
                max={senderBalance || 1000}
                value={sharesToTransfer}
                onChange={(e) => setSharesToTransfer(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-lg font-mono font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">TOTAL VALUE</span>
              <span className="text-xl font-extrabold text-emerald-400">
                ${(sharesToTransfer * selectedProperty.pricePerShareUSD).toLocaleString()} USD
              </span>
            </div>
          </div>

          <button
            onClick={handleRunTransferTest}
            disabled={isExecuting}
            className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-3 shadow-xl"
          >
            {isExecuting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Evaluating Cleanverse CVI Protocol Rules...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-amber-300" />
                Execute On-Chain Transfer & Compliance Check
              </>
            )}
          </button>

        </div>

        {/* Right: Live Trace */}
        <div className="glass-panel p-6 space-y-4 flex flex-col justify-between border-slate-700">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-emerald-400" />
              Real-Time Protocol Evaluation Trace
            </h3>

            <div className="mt-4 space-y-2 font-mono text-xs">
              {evaluationSteps.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  Click <span className="text-sky-400">Execute Transfer</span> to see the on-chain CVI rule engine evaluate compliance steps in real-time.
                </div>
              ) : (
                evaluationSteps.map((s, idx) => (
                  <div key={idx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                    s.status === 'pass' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' :
                    s.status === 'fail' ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 font-bold' :
                    'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {s.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {s.status === 'fail' && <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />}
                    {s.status === 'pending' && <span className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin shrink-0"></span>}
                    <span>{s.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {transferLog && (
            <div className={`p-4 rounded-xl border space-y-3 font-mono animate-in fade-in duration-300 ${
              transferLog.blocked 
                ? 'bg-rose-950/60 border-rose-500/80 text-rose-100 shadow-2xl shadow-rose-950/50' 
                : 'bg-emerald-950/60 border-emerald-500/80 text-emerald-100 shadow-2xl shadow-emerald-950/50'
            }`}>
              <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
                {transferLog.blocked ? (
                  <>
                    <ShieldAlert className="w-6 h-6 text-rose-400 animate-bounce" />
                    <span className="text-rose-400">CVI PROTOCOL REJECTION!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <span>CVA COMPLIANT TRANSFER PASSED!</span>
                  </>
                )}
              </div>

              <p className="text-xs leading-relaxed font-medium">
                {transferLog.reason || transferLog.message}
              </p>

              {transferLog.auditRecord && (
                <div className="pt-2 border-t border-white/10 text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="opacity-70">AUDIT RECORD ID:</span>
                    <span className="font-bold">#{transferLog.auditRecord.recordId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">CVA PROVENANCE HASH:</span>
                    <span className="font-mono text-sky-300 truncate max-w-[140px] inline-block">{transferLog.auditRecord.provenanceTxHash}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
