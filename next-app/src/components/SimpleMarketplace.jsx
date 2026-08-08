"use client";
import React, { useState } from 'react';
import { Building2, ShieldCheck, Lock, DollarSign, ChevronRight, CheckCircle2, AlertTriangle, Users, Calculator } from 'lucide-react';

export default function SimpleMarketplace({ 
  properties, 
  currentWallet, 
  identities, 
  onBuyShares, 
  onOpenKYC 
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
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Featured Real Estate Properties</h2>
          <p className="text-sm text-slate-400">Buy fractional property shares starting at $50/share with automated CVI compliance.</p>
        </div>

        {!currentIdentity.isVerified && (
          <button
            onClick={onOpenKYC}
            className="btn-danger text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify Your CVI Identity First
          </button>
        )}
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {properties.map((prop) => {
          const userBalance = prop.balances[currentWallet] || 0;
          const isAccreditedOnly = prop.requiresAccreditedOnly;
          const canUserInvest = currentIdentity.isVerified && (!isAccreditedOnly || currentIdentity.isAccredited);

          return (
            <div key={prop.id} className="glass-panel overflow-hidden flex flex-col justify-between group border-slate-800 hover:border-sky-500/40">
              
              <div>
                {/* Property Image & Badges */}
                <div className="relative h-56 overflow-hidden bg-slate-900">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-black/40"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/10">
                      {prop.ticker}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/90 text-slate-950 font-mono text-xs font-extrabold shadow-lg">
                      {prop.yieldAPY}% APY Yield
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {isAccreditedOnly ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/90 text-purple-300 font-mono text-xs border border-purple-500/40 font-bold">
                        <Lock className="w-3.5 h-3.5 text-purple-400" />
                        CVI Accredited Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 font-mono text-xs border border-emerald-500/40 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        CVI Standard Allowed
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">{prop.location}</p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">
                      {prop.description}
                    </p>
                  </div>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">TOTAL VALUATION</span>
                      <span className="text-white font-bold font-mono text-sm">${prop.totalValuationUSD.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">SHARE PRICE</span>
                      <span className="text-emerald-400 font-bold font-mono text-sm">${prop.pricePerShareUSD} / share</span>
                    </div>
                  </div>

                  {/* Holdings Indicator */}
                  {userBalance > 0 && (
                    <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs font-mono flex justify-between items-center text-sky-300">
                      <span>You Own:</span>
                      <span className="font-bold text-white">{userBalance} Shares (${(userBalance * prop.pricePerShareUSD).toLocaleString()})</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Action Bar */}
              <div className="p-6 pt-0 space-y-3">
                <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                  canUserInvest 
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}>
                  <span className="flex items-center gap-1.5 font-bold">
                    {canUserInvest ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        CVI Compliance Passed
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        {currentIdentity.isVerified ? 'Accreditation Required' : 'CVI Verification Required'}
                      </>
                    )}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {canUserInvest ? 'Ready to Invest' : 'Will Revert'}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenInvest(prop)}
                  className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
                >
                  <DollarSign className="w-4 h-4" />
                  Buy Property Shares
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Investment Drawer Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg p-6 space-y-5 border-sky-500/40 shadow-2xl relative animate-in fade-in duration-200">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold">
                  {selectedProperty.ticker}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedProperty.title}</h3>
                <p className="text-xs text-slate-400">Compliant Property Share Purchase</p>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="text-slate-400 hover:text-white text-lg font-mono p-1"
              >
                ✕
              </button>
            </div>

            {/* Persona Info */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">BUYER WALLET:</span>
                <span className="text-sky-400 font-bold">{currentIdentity.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CVI STATUS:</span>
                <span className={currentIdentity.isVerified ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {currentIdentity.isVerified ? (currentIdentity.isAccredited ? 'VERIFIED ACCREDITED' : 'VERIFIED STANDARD') : 'UNVERIFIED (WILL REVERT)'}
                </span>
              </div>
            </div>

            {/* Share Calculator Slider */}
            <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-sky-400" />
                  Select Shares to Buy:
                </label>
                <span className="font-mono text-lg font-bold text-sky-400">{shareCount} Shares</span>
              </div>

              <input 
                type="range" 
                min="1" 
                max="500" 
                value={shareCount} 
                onChange={(e) => setShareCount(parseInt(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">TOTAL INVESTMENT:</span>
                  <span className="text-xl font-bold text-emerald-400">
                    ${(shareCount * selectedProperty.pricePerShareUSD).toLocaleString()} USD
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">EST. ANNUAL YIELD ({selectedProperty.yieldAPY}%):</span>
                  <span className="text-xl font-bold text-sky-400">
                    ${((shareCount * selectedProperty.pricePerShareUSD) * (selectedProperty.yieldAPY / 100)).toFixed(2)} / yr
                  </span>
                </div>
              </div>
            </div>

            {/* Result callout */}
            {purchaseResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
                purchaseResult.success 
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200' 
                  : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
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
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedProperty(null)}
                className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 text-xs"
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
                    Processing Purchase...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Confirm & Buy Shares
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
