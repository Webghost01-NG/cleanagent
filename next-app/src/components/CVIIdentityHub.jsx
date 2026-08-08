"use client";
import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Award, Lock, CheckCircle2, AlertOctagon, Globe, RefreshCw, Key, ShieldAlert } from 'lucide-react';

export default function CVIIdentityHub({ 
  currentWallet, 
  identities, 
  onVerifyIdentity, 
  onRevokeIdentity 
}) {
  const [selectedWalletToEdit, setSelectedWalletToEdit] = useState(currentWallet);
  const [nameInput, setNameInput] = useState("");
  const [isAccreditedInput, setIsAccreditedInput] = useState(true);
  const [kycTierInput, setKycTierInput] = useState(3);
  const [countryCodeInput, setCountryCodeInput] = useState("US");
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  const currentIdentity = identities.find(i => i.wallet === selectedWalletToEdit) || {
    wallet: selectedWalletToEdit,
    name: "Unknown / Custom Wallet",
    role: "Unverified Wallet",
    isVerified: false,
    isAccredited: false,
    kycTier: 0,
    countryCode: "UNKNOWN",
    cviCertificateHash: "NONE"
  };

  const handleApplyVerification = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    const res = await onVerifyIdentity({
      wallet: selectedWalletToEdit,
      name: nameInput || currentIdentity.name,
      isAccredited: isAccreditedInput,
      kycTier: kycTierInput,
      countryCode: countryCodeInput
    });

    setIsUpdating(false);
    setUpdateMessage({ type: 'success', text: res.message });
  };

  const handleRevoke = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);

    const res = await onRevokeIdentity(selectedWalletToEdit);

    setIsUpdating(false);
    setUpdateMessage({ type: 'danger', text: res.message });
  };

  return (
    <div className="space-y-6">
      
      {/* CVI Banner Header */}
      <div className="glass-panel p-6 border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-sky-950/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                CVI PROTOCOL INTEGRATION
              </span>
              <span className="text-xs font-mono text-slate-400">Cleanverse Verified Identity</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              On-Chain Identity & Compliance Credentials
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Cleanverse CVI binds real-world KYC identity verifications, country jurisdiction flags, and Accredited Investor certificates directly to wallet addresses on-chain.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Left - Holographic CVI Badge Card | Right - KYC Simulator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Holographic CVI Digital ID Card */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Active CVI Digital Identity Credential
          </h3>

          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            currentIdentity.isVerified 
              ? 'cvi-badge-card border-emerald-500/50 shadow-2xl shadow-emerald-950/50' 
              : 'glass-panel border-rose-500/40 bg-rose-950/10'
          }`}>
            
            {/* Header of Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={currentIdentity.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} 
                  alt={currentIdentity.name} 
                  className="w-12 h-12 rounded-full border-2 border-emerald-400/80 object-cover shadow-md"
                />
                <div>
                  <h4 className="text-lg font-extrabold text-white">{currentIdentity.name}</h4>
                  <p className="text-xs text-slate-300 font-mono">{currentIdentity.role}</p>
                </div>
              </div>

              <div>
                {currentIdentity.isVerified ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> CVI VERIFIED
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" /> UNVERIFIED
                  </span>
                )}
              </div>
            </div>

            {/* Badge Metadata Fields */}
            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-sky-400" /> WALLET ADDRESS:
                </span>
                <span className="text-sky-300 font-bold truncate max-w-[200px]">{currentIdentity.wallet}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">CVI CERTIFICATE HASH:</span>
                  <span className="text-emerald-400 font-bold truncate block">{currentIdentity.cviCertificateHash || 'NONE'}</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">ACCREDITATION STATUS:</span>
                  <span className={currentIdentity.isAccredited ? 'text-purple-300 font-bold' : 'text-slate-300'}>
                    {currentIdentity.isAccredited ? 'ACCREDITED INVESTOR' : 'RETAIL STANDARD'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">KYC VERIFICATION TIER:</span>
                  <span className="text-white font-bold">Tier {currentIdentity.kycTier || 0} ({currentIdentity.kycTier >= 3 ? 'Institutional' : currentIdentity.kycTier >= 2 ? 'Standard' : 'Basic'})</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">JURISDICTION COUNTRY:</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3 text-sky-400" /> ISO: {currentIdentity.countryCode || 'US'}
                  </span>
                </div>
              </div>

              {currentIdentity.verifiedAt && (
                <div className="text-[10px] text-slate-400 text-right">
                  TIMESTAMP: {new Date(currentIdentity.verifiedAt).toLocaleString()}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right: Interactive CVI Verification & KYC Simulator */}
        <div className="glass-panel p-6 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserCheck className="w-5 h-5 text-sky-400" />
            CVI KYC Verification Portal Simulator
          </h3>

          <form onSubmit={handleApplyVerification} className="space-y-4">
            
            {/* Wallet Selection */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">SELECT WALLET TO ISSUE/UPDATE CVI:</label>
              <select
                value={selectedWalletToEdit}
                onChange={(e) => {
                  const w = e.target.value;
                  setSelectedWalletToEdit(w);
                  const found = identities.find(i => i.wallet === w);
                  if (found) {
                    setNameInput(found.name);
                    setIsAccreditedInput(found.isAccredited);
                    setKycTierInput(found.kycTier || 2);
                    setCountryCodeInput(found.countryCode || "US");
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {identities.map(i => (
                  <option key={i.wallet} value={i.wallet}>
                    {i.name} ({i.wallet})
                  </option>
                ))}
              </select>
            </div>

            {/* Investor Name */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">LEGAL NAME / ENTITY:</label>
              <input
                type="text"
                value={nameInput}
                placeholder={currentIdentity.name}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono rounded-lg p-2.5 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Accreditation Toggle */}
            <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Accredited Investor Certificate</span>
                <span className="text-[10px] text-slate-400 block">Required for restricted high-yield RWA assets</span>
              </div>
              <input
                type="checkbox"
                checked={isAccreditedInput}
                onChange={(e) => setIsAccreditedInput(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* KYC Tier & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">KYC TIER LEVEL:</label>
                <select
                  value={kycTierInput}
                  onChange={(e) => setKycTierInput(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono rounded-lg p-2 focus:outline-none focus:border-sky-500"
                >
                  <option value={1}>Tier 1 (Basic KYC)</option>
                  <option value={2}>Tier 2 (Standard KYC)</option>
                  <option value={3}>Tier 3 (Institutional)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">COUNTRY JURISDICTION:</label>
                <select
                  value={countryCodeInput}
                  onChange={(e) => setCountryCodeInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono rounded-lg p-2 focus:outline-none focus:border-sky-500"
                >
                  <option value="US">United States (US)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="SG">Singapore (SG)</option>
                  <option value="AE">UAE / Dubai (AE)</option>
                </select>
              </div>
            </div>

            {updateMessage && (
              <div className={`p-3 rounded-lg text-xs font-mono ${
                updateMessage.type === 'success' ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
              }`}>
                {updateMessage.text}
              </div>
            )}

            {/* Submit & Revoke Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-2/3 btn-success text-xs py-3 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Issue CVI Certificate
              </button>

              <button
                type="button"
                onClick={handleRevoke}
                disabled={isUpdating}
                className="w-1/3 btn-danger text-xs py-3 flex items-center justify-center gap-1"
              >
                <ShieldAlert className="w-4 h-4" />
                Revoke CVI
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
