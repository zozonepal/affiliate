import { useState, useMemo } from 'react';
import { 
  Flame, 
  ExternalLink, 
  Share2
} from 'lucide-react';
import { ProductDeal } from '../types';
import { ShareModal } from './ShareModal';

interface BestDealBannerProps {
  products: ProductDeal[];
  onQuickView: (product: ProductDeal) => void;
  onToggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
}

/** Helper function to automatically shorten category names */
function getShortCategory(cat: string = ''): string {
  if (!cat) return 'Tech';
  const clean = cat.trim();
  const lower = clean.toLowerCase();
  if (lower.includes('phone') || lower.includes('mobile')) return 'Phones';
  if (lower.includes('earbud') || lower.includes('headphone') || lower.includes('audio') || lower.includes('speaker')) return 'Audio';
  if (lower.includes('laptop') || lower.includes('computer') || lower.includes('pc')) return 'PC';
  if (lower.includes('watch') || lower.includes('wearable')) return 'Watches';
  if (lower.includes('game') || lower.includes('console')) return 'Gaming';
  if (lower.includes('electronic') || lower.includes('gadget') || lower.includes('tech')) return 'Tech';
  if (lower.includes('home') || lower.includes('kitchen') || lower.includes('appliance')) return 'Home';
  if (lower.includes('fashion') || lower.includes('clothing')) return 'Fashion';
  
  const firstWord = clean.split(/[\s,&/]+/)[0];
  return firstWord.length > 10 ? firstWord.slice(0, 10) : firstWord;
}

export function BestDealBanner({
  products,
  onQuickView
}: BestDealBannerProps) {
  // Intelligent Algorithm: Analyzes all uploaded products and selects strictly ONE single BEST deal
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

  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!bestDealItem) return null;

  const deal = bestDealItem.product;
  const discountPercent = bestDealItem.discountPercent;
  const origPrice = bestDealItem.orig;
  const shortCategory = getShortCategory(deal.category);

  return (
    <section 
      aria-label="Featured Deal Spotlight"
      className="relative mb-4 sm:mb-5 rounded-2xl border-2 border-orange-400/80 bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-orange-50/80 shadow-md shadow-orange-500/10 transition-all p-3 sm:p-3.5 overflow-hidden group"
    >
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2 pt-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider shrink-0 whitespace-nowrap">
            <Flame className="w-3 h-3 text-amber-200 fill-amber-200" />
            <span>Best Deal Spotlight</span>
          </span>
          <span className="text-[11px] text-orange-950/80 font-bold truncate hidden sm:inline">
            #1 Highest Savings Choice
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="px-2.5 py-0.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-orange-200/80 text-[10px] font-bold inline-flex items-center gap-1 transition active:scale-95 shrink-0 shadow-2xs"
          title="Share deal"
        >
          <Share2 className="w-3 h-3 text-orange-600" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        
        {/* Thumbnail Image */}
        <div 
          onClick={() => onQuickView(deal)}
          className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white border border-orange-200/80 rounded-xl p-1 flex items-center justify-center cursor-pointer overflow-hidden shadow-2xs group-hover:scale-105 transition-transform"
        >
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

        {/* Details & Price Line */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          
          {/* Single-Line Category & Title */}
          <div className="flex items-center gap-1.5 min-w-0 text-xs font-bold text-slate-900">
            <span className="text-orange-700 text-[10px] font-extrabold uppercase shrink-0 tracking-wide">
              {shortCategory}
            </span>
            <span className="text-orange-300 shrink-0">•</span>
            <h3 
              onClick={() => onQuickView(deal)}
              className="truncate font-extrabold text-xs sm:text-sm text-slate-950 group-hover:text-orange-600 cursor-pointer transition whitespace-nowrap"
              title={deal.title}
            >
              {deal.title}
            </h3>
          </div>

          {/* Single-Line Price & Buy CTA Row */}
          <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-orange-200/60">
            <div className="flex items-baseline gap-1.5 min-w-0 truncate">
              <span className="text-sm sm:text-base font-black text-slate-950 tracking-tight tabular-nums whitespace-nowrap">
                Rs. {Number(deal.price).toLocaleString('ne-NP')}
              </span>
              {origPrice > deal.price && (
                <span className="text-[11px] text-slate-400 line-through tabular-nums whitespace-nowrap">
                  Rs. {Number(origPrice).toLocaleString('ne-NP')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-extrabold text-white bg-orange-600 px-1.5 py-0.2 rounded-md shadow-2xs shrink-0 whitespace-nowrap">
                  -{discountPercent}%
                </span>
              )}
            </div>

            <a
              href={deal.affiliateUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shrink-0 whitespace-nowrap shadow-xs"
            >
              <span>Buy on Daraz</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

        </div>

      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={deal}
      />
    </section>
  );
}
