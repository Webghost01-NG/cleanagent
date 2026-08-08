"use client";
import React, { useState } from 'react';
import { PlusCircle, Building2, ShieldCheck, DollarSign, Image, MapPin, Tag } from 'lucide-react';

export default function TokenizeModal({ isOpen, onClose, onListProperty }) {
  const [title, setTitle] = useState('');
  const [ticker, setTicker] = useState('');
  const [assetCategory, setAssetCategory] = useState('Commercial Real Estate');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [totalValuationUSD, setTotalValuationUSD] = useState('');
  const [pricePerShareUSD, setPricePerShareUSD] = useState('50');
  const [yieldAPY, setYieldAPY] = useState('8.5');
  const [requiresAccreditedOnly, setRequiresAccreditedOnly] = useState(false);
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !ticker || !totalValuationUSD) return;

    setIsSubmitting(true);
    setResultMsg(null);

    const res = await onListProperty({
      title,
      ticker,
      assetCategory,
      location,
      image,
      totalValuationUSD,
      pricePerShareUSD,
      yieldAPY,
      requiresAccreditedOnly,
      description
    });

    setIsSubmitting(false);
    if (res.success) {
      setResultMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
        setTitle('');
        setTicker('');
        setTotalValuationUSD('');
        setResultMsg(null);
      }, 1500);
    } else {
      setResultMsg({ type: 'danger', text: res.error || "Failed to tokenize property" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl p-6 space-y-5 border-emerald-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Tokenize New Real Estate Asset</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Issue new fractional real estate share tokens on-chain with automated Cleanverse CVI identity guardrails.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">PROPERTY TITLE:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Beverly Hills Estate - Unit 10"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">TOKEN TICKER:</label>
              <input
                type="text"
                required
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="e.g. EK-BH10"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">TOTAL VALUATION ($ USD):</label>
              <input
                type="number"
                required
                value={totalValuationUSD}
                onChange={(e) => setTotalValuationUSD(e.target.value)}
                placeholder="e.g. 750000"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">PRICE PER SHARE ($):</label>
              <input
                type="number"
                required
                value={pricePerShareUSD}
                onChange={(e) => setPricePerShareUSD(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">ANNUAL YIELD APY (%):</label>
              <input
                type="number"
                step="0.1"
                required
                value={yieldAPY}
                onChange={(e) => setYieldAPY(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">ASSET CATEGORY:</label>
              <select
                value={assetCategory}
                onChange={(e) => setAssetCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Residential Penthouse">Residential Penthouse</option>
                <option value="Commercial Real Estate">Commercial Real Estate</option>
                <option value="Luxury Resort Property">Luxury Resort Property</option>
                <option value="Tech Infrastructure">Tech Infrastructure</option>
                <option value="Green Energy Debt">Green Energy Debt</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">LOCATION ADDRESS:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. 9601 Wilshire Blvd, Beverly Hills, CA"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">IMAGE URL:</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">CVI Accredited Only Restriction</span>
              <span className="text-[10px] text-slate-400 block">Require investors to hold Cleanverse Accredited Certificate</span>
            </div>
            <input
              type="checkbox"
              checked={requiresAccreditedOnly}
              onChange={(e) => setRequiresAccreditedOnly(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
          </div>

          {resultMsg && (
            <div className={`p-3 rounded-lg ${resultMsg.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50' : 'bg-rose-950/60 text-rose-300 border border-rose-500/50'}`}>
              {resultMsg.text}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 btn-success text-xs py-3 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Tokenizing Asset...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Mint & List Property On-Chain
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
