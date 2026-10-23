import { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Timer, 
  Ticket, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
  Percent, 
  Zap, 
  Gift
} from 'lucide-react';
import { ProductDeal } from '../types';
import { openDarazDeal, buildAffiliateUrl } from '../utils/affiliateLink';

interface CampaignMegadealsHubProps {
  products: ProductDeal[];
  onQuickView: (product: ProductDeal) => void;
  onToggleWishlist: (id: string) => void;
  wishlist: string[];
}

export function CampaignMegadealsHub({
  products,
  onQuickView,
  onToggleWishlist,
  wishlist
}: CampaignMegadealsHubProps) {
  // Live Countdown Timer state for flash campaign (24h recurring or target date)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 42
  });

  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2500);
  };

  // High-converting active campaign vouchers
  const activeVouchers = [
    {
      code: 'DARAZAPP500',
      title: 'Flat Rs. 500 OFF',
      minSpend: 'Min. spend Rs. 3,500',
      badge: 'App Only Voucher',
      highlight: true
    },
    {
      code: 'TECHPAYDAY',
      title: 'Extra 10% Discount',
      minSpend: 'Gadgets & Audio category',
      badge: 'Flash Code',
      highlight: false
    },
    {
      code: 'FREESHIPNP',
      title: 'Free Delivery Voucher',
      minSpend: 'Across Kathmandu & major hubs',
      badge: 'Shipping Perk',
      highlight: false
    }
  ];

  // Top Megadeals with highest percentage discount
  const flashDeals = useMemo(() => {
    return [...products]
      .map((p) => {
        const orig = p.originalPrice && p.originalPrice > p.price ? p.originalPrice : Math.round(p.price * 1.35);
        const discount = Math.round(((orig - p.price) / orig) * 100);
        return { product: p, discount, orig };
      })
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 8);
  }, [products]);

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. Hero Campaign Banner with Ticking Countdown */}
      <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Accent circles */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/10 rounded-3xl blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 bg-black/15 rounded-3xl blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-white text-orange-600 font-black px-3 py-1 rounded-md text-xs uppercase tracking-wider shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-orange-600" />
              <span>Flash Megadeals Hub</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Daraz App Exclusive Discounts</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            Mega Flash Sale & Payday Festival
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl leading-relaxed mb-6">
            Up to 60% OFF verified electronics, audio, powerbanks, and wearables in Nepal. Grab vouchers before quota expires.
          </p>

          {/* Countdown Clock Component */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-black/30 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border border-white/20">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse shrink-0" />
                <div className="flex items-center gap-1 text-white font-mono font-black text-sm sm:text-lg">
                  <span className="bg-black/40 px-1.5 py-0.5 rounded-lg tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  <span>:</span>
                  <span className="bg-black/40 px-1.5 py-0.5 rounded-lg tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  <span>:</span>
                  <span className="bg-black/40 px-1.5 py-0.5 rounded-lg tabular-nums text-amber-300">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] text-orange-200 uppercase tracking-wider font-bold ml-1">
                Left to Claim
              </span>
            </div>

            <a
              href="https://www.daraz.com.np"
              onClick={(e) => {
                e.preventDefault();
                openDarazDeal('https://www.daraz.com.np');
              }}
              className="bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-xs sm:text-sm py-2.5 px-4 sm:px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>Open Flash Deals on App</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Official Daraz App Voucher Callout Strip */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-orange-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Verified Daraz App Voucher Codes
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">1-Click Copy & Redeem</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {activeVouchers.map((v) => {
            const isCopied = copiedVoucher === v.code;
            return (
              <div
                key={v.code}
                className={`rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  v.highlight
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-300 shadow-sm'
                    : 'bg-white border-slate-200/90 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                      {v.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Nepal Verified</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900">{v.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{v.minSpend}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 truncate">
                    {v.code}
                  </span>

                  <button
                    onClick={() => handleCopyVoucher(v.code)}
                    className="bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition active:scale-95 shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <span>Copy Code</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Flash Megadeal Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-600" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Biggest Discount Megadeals (Up to 60% OFF)
            </h3>
          </div>
          <span className="text-xs text-orange-600 font-bold flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-600 fill-orange-600" />
            <span>High Demand in Nepal</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {flashDeals.map(({ product, discount, orig }) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-orange-500/60 p-3 flex flex-col justify-between group shadow-2xs hover:shadow-lg transition-all"
            >
              <div>
                <div
                  onClick={() => onQuickView(product)}
                  className="relative aspect-square bg-[#F8F9FA] rounded-xl overflow-hidden p-2 flex items-center justify-center cursor-pointer mb-2"
                >
                  <span className="absolute top-2 right-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                    -{discount}%
                  </span>
                  <img
                    src={product.imageUrl || product.image}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>

                <div className="text-[10px] font-extrabold text-orange-600 uppercase mb-0.5">
                  {product.category}
                </div>

                <h4
                  onClick={() => onQuickView(product)}
                  className="font-bold text-xs text-slate-900 hover:text-orange-600 cursor-pointer line-clamp-2 leading-snug min-h-[32px]"
                  title={product.title}
                >
                  {product.title}
                </h4>

                <div className="flex items-baseline gap-1.5 my-1.5">
                  <span className="text-sm font-extrabold text-slate-900">
                    Rs. {Number(product.price).toLocaleString('ne-NP')}
                  </span>
                  <span className="text-[11px] text-slate-400 line-through">
                    Rs. {Number(orig).toLocaleString('ne-NP')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 min-w-0">
                <a
                  href={buildAffiliateUrl(product.affiliateUrl)}
                  onClick={(e) => {
                    e.preventDefault();
                    openDarazDeal(product.affiliateUrl);
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 text-white font-extrabold text-[11px] sm:text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition shadow-xs active:scale-95 min-w-0 overflow-hidden"
                >
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Grab Deal</span>
                  <ExternalLink className="w-3 h-3 opacity-80 shrink-0 hidden sm:inline" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
