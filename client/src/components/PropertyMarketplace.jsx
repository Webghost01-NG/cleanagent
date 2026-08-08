import React, { useState } from 'react';
import { Building2, ShieldCheck, Lock, DollarSign, Award, ChevronRight, CheckCircle2, AlertTriangle, Users, Calculator } from 'lucide-react';

export default function PropertyMarketplace({ 
  properties, 
  currentWallet, 
  identities, 
  onBuyShares, 
  onOpenDemo 
}) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [shareCount, setShareCount] = useState(10);
  const [isBuying, setIsBuying] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);

  const currentIdentity = identities.find(i => i.wallet === currentWallet) || {
    wallet: currentWallet,
    name: "Custom Wallet",
    isVerified: false,
    isAccredited: false
  };

  const handleOpenInvest = (prop) => {
    setSelectedProperty(prop);
    setShareCount(10);
    setPurchaseResult(null);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProperty) return;
    setIsBuying(true);
    setPurchaseResult(null);

    // Call protocol transfer from Issuer/Treasury to current user wallet
    const treasuryWallet = "0x8626f69A737B37652B8ba53072256005d4922A16";
    const res = await onBuyShares({
      propertyId: selectedProperty.id,
      fromWallet: treasuryWallet,
      toWallet: currentWallet,
      shares: shareCount
    });

    setIsBuying(false);
    setPurchaseResult(res);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900 border border-sky-500/20 rounded-2xl p-6">
        <div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold uppercase">
            Compliant Tokenized RWA Marketplace
          </span>
          <h2 className="text-2xl font-bold text-white mt-2">Fractional Real Estate Shares</h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Every share transfer is protocol-checked on-chain using Cleanverse Verified Identity (CVI) and tracked with Cleanverse Verified Assets (CVA) provenance.
          </p>
        </div>

        <button
          onClick={onOpenDemo}
          className="btn-danger flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Lock className="w-4 h-4" />
          Test Unverified Wallet Rejection
        </button>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => {
          const userBalance = prop.balances[currentWallet] || 0;
          const isAccreditedOnly = prop.requiresAccreditedOnly;
          
          // Pre-flight compliance evaluation for current wallet
          const canUserInvest = currentIdentity.isVerified && (!isAccreditedOnly || currentIdentity.isAccredited);

          return (
            <div key={prop.id} className="glass-panel overflow-hidden flex flex-col group">
              {/* Property Image & Badges */}
              <div className="relative h-52 overflow-hidden bg-slate-900">
                <img 
                  src={prop.image} 
                  alt={prop.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-black/40"></div>
                
                {/* Ticker & Share price badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/10">
                    {prop.ticker}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-md text-white font-mono text-xs font-bold shadow-lg">
                    {prop.yieldAPY}% APY Yield
                  </span>
                </div>

                {/* CVI Accreditation Requirement Badge */}
                <div className="absolute top-3 right-3">
                  {isAccreditedOnly ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/80 backdrop-blur-md text-purple-300 font-mono text-[11px] border border-purple-500/30">
                      <Lock className="w-3 h-3 text-purple-400" />
                      CVI Accredited Only
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-emerald-300 font-mono text-[11px] border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      CVI Verified Standard
                    </span>
                  )}
                </div>

                {/* User Current Holdings Pill */}
                {userBalance > 0 && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-sky-500 text-white font-mono text-xs font-semibold shadow-lg shadow-sky-500/30">
                      You Own: {userBalance} Shares (${(userBalance * prop.pricePerShareUSD).toLocaleString()})
                    </span>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-mono">{prop.location}</p>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {prop.description}
                  </p>
                </div>

                {/* Metrics Box */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">TOTAL VALUATION</span>
                    <span className="text-white font-bold font-mono">${prop.totalValuationUSD.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">PRICE PER SHARE</span>
                    <span className="text-emerald-400 font-bold font-mono">${prop.pricePerShareUSD} / share</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">AVAILABLE SHARES</span>
                    <span className="text-slate-200 font-medium font-mono">{prop.availableShares.toLocaleString()} / {prop.totalShares.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">SHAREHOLDERS</span>
                    <span className="text-slate-200 font-medium font-mono flex items-center gap-1">
                      <Users className="w-3 h-3 text-sky-400" /> {prop.shareholdersCount}
                    </span>
                  </div>
                </div>

                {/* CVI Pre-Flight Status Bar */}
                <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                  canUserInvest 
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}>
                  <span className="flex items-center gap-1.5 font-medium">
                    {canUserInvest ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        CVI Compliance Verified
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        {currentIdentity.isVerified ? 'Accreditation Required' : 'CVI Verification Required'}
                      </>
                    )}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {canUserInvest ? 'Transfer Permitted' : 'Will Revert'}
                  </span>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handleOpenInvest(prop)}
                  className="w-full btn-primary flex items-center justify-center gap-2 text-sm mt-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Acquire Fractional Shares
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investment Drawer Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg p-6 space-y-5 border-sky-500/30 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold">
                  {selectedProperty.ticker}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedProperty.title}</h3>
                <p className="text-xs text-slate-400">On-Chain CVI Compliant Share Purchase</p>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="text-slate-400 hover:text-white text-xl font-mono p-1"
              >
                ✕
              </button>
            </div>

            {/* Current Connected Persona Info */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">PURCHASING WALLET:</span>
                <span className="text-sky-400 font-semibold">{currentIdentity.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CVI STATUS:</span>
                <span className={currentIdentity.isVerified ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {currentIdentity.isVerified ? (currentIdentity.isAccredited ? 'VERIFIED ACCREDITED' : 'VERIFIED STANDARD') : 'UNVERIFIED (WILL REVERT)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CVI CERTIFICATE:</span>
                <span className="text-slate-300">{currentIdentity.cviCertificateHash || 'NONE'}</span>
              </div>
            </div>

            {/* Share Calculator Slider */}
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-sky-400" />
                  Select Shares to Purchase:
                </label>
                <span className="font-mono text-lg font-bold text-sky-400">{shareCount} Shares</span>
              </div>

              <input 
                type="range" 
                min="1" 
                max="500" 
                value={shareCount} 
                onChange={(e) => setShareCount(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400 block">TOTAL INVESTMENT:</span>
                  <span className="text-xl font-bold text-emerald-400">
                    ${(shareCount * selectedProperty.pricePerShareUSD).toLocaleString()} USD
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">EST. ANNUAL YIELD:</span>
                  <span className="text-xl font-bold text-sky-400">
                    ${((shareCount * selectedProperty.pricePerShareUSD) * (selectedProperty.yieldAPY / 100)).toFixed(2)} / yr
                  </span>
                </div>
              </div>
            </div>

            {/* Purchase Result Output */}
            {purchaseResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                purchaseResult.success 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {purchaseResult.success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Shares Issued & CVA Provenance Recorded!
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      Transaction Blocked by Cleanverse Protocol!
                    </>
                  )}
                </div>
                <p className="leading-relaxed">
                  {purchaseResult.message || purchaseResult.reason}
                </p>
                {purchaseResult.auditRecord && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50 text-[10px] space-y-1 opacity-90">
                    <div>CVA PROVENANCE HASH: {purchaseResult.auditRecord.provenanceTxHash}</div>
                    <div>TIMESTAMP: {new Date(purchaseResult.auditRecord.timestamp).toLocaleTimeString()}</div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedProperty(null)}
                className="w-1/3 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 text-xs"
              >
                Close
              </button>
              
              <button
                onClick={handleConfirmPurchase}
                disabled={isBuying}
                className="w-2/3 btn-primary flex items-center justify-center gap-2 text-sm"
              >
                {isBuying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Evaluating CVI Rules...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Confirm & Mint Shares
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
