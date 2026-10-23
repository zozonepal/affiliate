import { useState } from 'react';
import { ShieldCheck, Truck, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';

export function TrustDisclosureBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <aside 
        aria-label="Daraz Nepal Affiliate Disclosure & Buyer Protection"
        className="w-full bg-slate-900 text-slate-200 border-b border-slate-800 px-2.5 sm:px-4 py-1.5 text-xs overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Main Trust Claim */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-black px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] shrink-0 uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Daraz Partner</span>
            </span>
            <p className="text-[10px] sm:text-xs text-slate-300 font-medium truncate">
              <span className="font-semibold text-white">100% Genuine:</span> COD & Official Nepal Warranty
            </p>
          </div>

          {/* Compliance & Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 text-[10px] sm:text-[11px]">
            <button
              onClick={() => setShowModal(true)}
              className="text-orange-400 hover:text-orange-300 font-bold underline underline-offset-2 flex items-center gap-0.5 transition whitespace-nowrap"
            >
              <span>Disclosure</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline font-mono text-[10px]">
              Zero extra cost to you
            </span>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-500 hover:text-slate-300 p-0.5 rounded-md transition ml-0.5"
              title="Dismiss banner"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </aside>

      {/* Trust & Transparency Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Daraz Affiliate Partner Disclosure
                </h3>
                <p className="text-xs text-slate-500">
                  DealFinder NP Editorial Standards & Buyer Protection
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>How our platform works:</strong> DealFinder Nepal operates as an independent deal discovery and price tracking catalog. When you click our affiliate links and complete a purchase on Daraz Nepal (via Web or the official Daraz App), we may receive a small referral commission.
              </p>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Price Markup:</strong> You pay the exact same price (or lower with our vouchers). You are never charged extra.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Direct Fulfillment:</strong> Orders are processed, shipped, and warranted directly by Daraz Nepal sellers and Daraz Mall.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Buyer Safeguards:</strong> Eligible for Cash on Delivery (COD) across Nepal, 7-14 day returns, and official brand warranties.</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Product availability, flash vouchers, and discounts are synchronized daily but remain subject to change on the seller's storefront.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition shadow-xs"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
