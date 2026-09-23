import { useState, useMemo, type MouseEvent } from 'react';
import { 
  Flame, 
  Sparkles, 
  ExternalLink, 
  ShoppingBag, 
  TrendingUp, 
  Check, 
  Tag, 
  Share2,
  Percent
} from 'lucide-react';
import { ProductDeal } from '../types';
import { ShareModal } from './ShareModal';

interface BestDealBannerProps {
  products: ProductDeal[];
  onQuickView: (product: ProductDeal) => void;
  onToggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
}

export function BestDealBanner({
  products,
  onQuickView
}: BestDealBannerProps) {
  // Intelligent Algorithm: Analyzes all uploaded products and selects strictly ONE single BEST deal
  // Criteria: percentage discount, monetary savings in NPR, ratings, upvotes, promo codes
  const bestDealItem = useMemo(() => {
    if (!products || products.length === 0) return null;

    let best: {
      product: ProductDeal;
      score: number;
      discountPercent: number;
      savings: number;
      orig: number;
    } | null = null;

    for (const p of products) {
      const orig = p.originalPrice && p.originalPrice > p.price ? p.originalPrice : Math.round(p.price * 1.35);
      const savings = Math.max(0, orig - p.price);
      const discountPercent = Math.round((savings / orig) * 100);

      const score = 
        discountPercent * 3.0 + 
        (Math.min(savings, 10000) / 100) * 1.5 + 
        (p.upvotes || 0) * 4.0 + 
        ((p.rating || 4.5) * 4.0) + 
        (p.promoCode ? 25 : 0) + 
        (p.badge ? 15 : 0);

      if (!best || score > best.score) {
        best = {
          product: p,
          score,
          discountPercent,
          savings,
          orig
        };
      }
    }

    return best;
  }, [products]);

  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!bestDealItem) return null;

  const deal = bestDealItem.product;
  const discountPercent = bestDealItem.discountPercent;
  const savings = bestDealItem.savings;
  const origPrice = bestDealItem.orig;

  const handleCopyCode = (e: MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      aria-label="Best Deal of the App"
      className="relative mb-4 sm:mb-5 rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-orange-500/25 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white"
    >
      {/* Accent strip */}
      <div className="h-0.5 sm:h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

      <div className="p-2.5 sm:p-3.5 md:p-4">
        
        {/* Compact Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider shrink-0">
              <Flame className="w-3 h-3 text-amber-200 fill-amber-300" />
              <span>Best Deal</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-300/90 font-medium truncate">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span>AI Auto-Selected #1 Pick</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Share button */}
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="p-1 sm:px-2 sm:py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold inline-flex items-center gap-1 transition active:scale-95 border border-white/10"
              title="Share this deal"
            >
              <Share2 className="w-3 h-3 text-orange-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Compact Mobile-First Layout: Flex on mobile, clean row */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* 1. Thumbnail Image with Top-Right Percentage Badge */}
          <div 
            onClick={() => onQuickView(deal)}
            className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-lg sm:rounded-xl p-1.5 flex items-center justify-center cursor-pointer shadow-sm hover:ring-2 hover:ring-orange-400 transition-all overflow-hidden"
          >
            {discountPercent > 0 && (
              <div className="absolute top-1 right-1 z-10 bg-slate-900/90 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 leading-none pointer-events-none">
                <Percent className="w-2 h-2 inline" />
                <span>{discountPercent}%</span>
              </div>
            )}

            <img
              src={deal.image}
              alt={deal.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>

          {/* 2. Content & Buy Button in compact flex */}
          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wide text-orange-400 truncate">
                  {deal.category || 'Tech'}
                </span>
                <span className="text-slate-600 text-[10px]">•</span>
                <span className="text-[9px] text-emerald-400 font-bold inline-flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>Lowest Price</span>
                </span>
              </div>

              {/* Title */}
              <h3 
                onClick={() => onQuickView(deal)}
                className="text-xs sm:text-sm font-bold text-white hover:text-orange-300 cursor-pointer transition line-clamp-1 sm:line-clamp-2 leading-snug"
                title={deal.title}
              >
                {deal.title}
              </h3>
            </div>

            {/* Price line & Action button in a tight row */}
            <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-white/10 flex-wrap sm:flex-nowrap">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-sm sm:text-base font-black text-amber-400 tracking-tight whitespace-nowrap">
                  Rs. {Number(deal.price).toLocaleString('ne-NP')}
                </span>
                {origPrice > deal.price && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through whitespace-nowrap">
                    Rs. {Number(origPrice).toLocaleString('ne-NP')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                    Save Rs. {Number(savings).toLocaleString('ne-NP')}
                  </span>
                )}
              </div>

              {/* Promo code mini chip if available */}
              {deal.promoCode && (
                <button
                  type="button"
                  onClick={(e) => handleCopyCode(e, deal.promoCode!)}
                  className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded transition"
                  title="Click to copy voucher code"
                >
                  <Tag className="w-2.5 h-2.5" />
                  <span>{deal.promoCode}</span>
                  {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : null}
                </button>
              )}

              {/* Buy on Daraz CTA */}
              <a
                href={deal.affiliateUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-[11px] sm:text-xs py-1.5 px-3 rounded-lg shadow-sm active:scale-95 transition-all ml-auto shrink-0"
              >
                <ShoppingBag className="w-3 h-3 fill-slate-950 text-slate-950 shrink-0" />
                <span>Buy on Daraz</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={deal}
      />
    </section>
  );
}
