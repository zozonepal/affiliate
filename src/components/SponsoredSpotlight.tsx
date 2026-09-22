import { useState, useEffect, useMemo, type MouseEvent } from 'react';
import { 
  Flame, 
  ShoppingBag, 
  Eye, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Tag,
  Check,
  Share2
} from 'lucide-react';
import { ProductDeal } from '../types';
import { ShareModal } from './ShareModal';

interface SponsoredSpotlightProps {
  deal?: ProductDeal | null;
  deals?: ProductDeal[];
  onQuickView: (product: ProductDeal) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
}

export function SponsoredSpotlight({
  deal,
  deals = [],
  onQuickView,
}: SponsoredSpotlightProps) {
  // Combine single deal or array into active deals list
  const activeDeals = useMemo(() => {
    if (deals && deals.length > 0) return deals;
    if (deal) return [deal];
    return [];
  }, [deal, deals]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Auto-switch between best deals every 6 seconds without user interference
  useEffect(() => {
    if (activeDeals.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeDeals.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeDeals.length]);

  // Keep index within bounds if deals list updates
  useEffect(() => {
    if (currentIndex >= activeDeals.length && activeDeals.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeDeals.length, currentIndex]);

  // Timer countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 18, seconds: 45 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentDeal = activeDeals[currentIndex] || activeDeals[0];
  if (!currentDeal) return null;

  const originalPriceNum = currentDeal.originalPrice || Math.round(currentDeal.price * 1.45);
  const savings = Math.max(0, originalPriceNum - currentDeal.price);
  const discountPercent = Math.round((savings / originalPriceNum) * 100);

  const handleCopyCode = (e: MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextDeal = () => {
    setCurrentIndex((prev) => (prev + 1) % activeDeals.length);
  };

  const prevDeal = () => {
    setCurrentIndex((prev) => (prev - 1 + activeDeals.length) % activeDeals.length);
  };

  return (
    <div 
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white rounded-2xl p-2.5 sm:p-3.5 mb-3 sm:mb-4 shadow-lg border border-orange-500/20 relative overflow-hidden group transition-all"
      style={{ maxHeight: '180px' }}
    >
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Main compact single-level flex layout (50% shorter in length/height) */}
      <div className="flex items-center gap-2.5 sm:gap-4 relative z-10">
        
        {/* Left: Compact Square Product Thumbnail */}
        <div 
          onClick={() => onQuickView(currentDeal)}
          className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur-md rounded-xl p-1.5 shrink-0 flex items-center justify-center border border-white/10 hover:border-orange-500/40 transition cursor-pointer group/img"
        >
          {/* Discount Badge */}
          <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded shadow-xs z-10">
            {discountPercent}% OFF
          </div>

          <img
            src={currentDeal.image}
            alt={currentDeal.title}
            className="h-full w-full object-contain p-0.5 group-hover/img:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80';
            }}
          />

          {/* Quick view overlay icon */}
          <div className="absolute bottom-1 right-1 p-1 bg-slate-900/80 rounded-md text-white opacity-0 group-hover/img:opacity-100 transition">
            <Eye className="w-3 h-3" />
          </div>
        </div>

        {/* Center: Deal Information & Pricing */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          
          {/* Top Ticker Row */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-[11px]">
            <span className="inline-flex items-center gap-1 bg-orange-600/90 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-[9px]">
              <Flame className="w-2.5 h-2.5 text-amber-200 fill-amber-200 animate-pulse" />
              <span>Top Best Deal</span>
            </span>

            <span className="text-orange-300 font-bold hidden sm:inline">
              {currentDeal.category}
            </span>

            <span className="text-slate-400 hidden md:inline">•</span>

            {/* Countdown inline */}
            <span className="inline-flex items-center gap-1 text-slate-300 font-mono text-[10px] bg-black/20 px-2 py-0.5 rounded-md border border-white/5">
              <Clock className="w-2.5 h-2.5 text-amber-400" />
              <span>{String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </span>

            {/* Multiple deals auto-rotation dots */}
            {activeDeals.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 ml-auto">
                <span className="text-[9px] text-slate-400 mr-1">Deal {currentIndex + 1} of {activeDeals.length}</span>
                {activeDeals.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentIndex ? 'bg-orange-500 w-3.5' : 'bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to deal ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(currentDeal)}
            className="text-xs sm:text-sm md:text-base font-bold text-white hover:text-orange-300 transition cursor-pointer truncate leading-tight"
            title={currentDeal.title}
          >
            {currentDeal.title}
          </h3>

          {/* Price & Savings Row */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-orange-400">Rs.</span>
              <span className="text-sm sm:text-lg md:text-xl font-black text-white tracking-tight">
                {Number(currentDeal.price).toLocaleString('ne-NP')}
              </span>
              {originalPriceNum > currentDeal.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through ml-1">
                  Rs. {Number(originalPriceNum).toLocaleString('ne-NP')}
                </span>
              )}
            </div>

            {savings > 0 && (
              <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                Save Rs. {Number(savings).toLocaleString('ne-NP')}
              </span>
            )}

            {/* Promo Code Chip if available */}
            {currentDeal.promoCode && (
              <button
                onClick={(e) => handleCopyCode(e, currentDeal.promoCode!)}
                className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-orange-950/70 border border-orange-500/30 text-orange-300 px-2 py-0.5 rounded hover:bg-orange-900/80 transition"
                title="Click to copy promo code"
              >
                <Tag className="w-2.5 h-2.5" />
                <span>{currentDeal.promoCode}</span>
                {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <span className="text-[8px] opacity-70">Copy</span>}
              </button>
            )}
          </div>

        </div>

        {/* Right: Compact Affiliate Action CTA & Navigation */}
        <div className="shrink-0 flex flex-col items-end justify-center gap-1.5">
          <div className="flex items-center gap-1.5">
            {/* Share Deal Button */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-2 sm:py-2.5 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 transition active:scale-95 border border-white/10"
              title="Share deal on WhatsApp & Facebook"
              aria-label="Share deal"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-300" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <a
              href={currentDeal.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl shadow-md shadow-orange-500/25 flex items-center gap-1.5 active:scale-95 transition whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white fill-white" />
              <span className="hidden sm:inline">Claim on Daraz</span>
              <span className="sm:hidden">Buy</span>
              <ExternalLink className="w-3 h-3 text-white/80 shrink-0" />
            </a>
          </div>

          {/* Micro Carousel Next/Prev Controls if multiple deals */}
          {activeDeals.length > 1 && (
            <div className="flex items-center gap-1 text-slate-400">
              <button 
                onClick={prevDeal}
                className="p-1 rounded-md hover:bg-white/10 hover:text-white transition"
                aria-label="Previous best deal"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 sm:hidden">
                {currentIndex + 1}/{activeDeals.length}
              </span>
              <button 
                onClick={nextDeal}
                className="p-1 rounded-md hover:bg-white/10 hover:text-white transition"
                aria-label="Next best deal"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={currentDeal}
      />
    </div>
  );
}
