import { useState, type MouseEvent } from 'react';
import { ExternalLink, Heart, Star, ShieldCheck, Flame, Smartphone } from 'lucide-react';
import { ProductDeal } from '../types';
import { openDarazDeal, getHighIntentCtaText, buildAffiliateUrl } from '../utils/affiliateLink';

interface ProductCardProps {
  key?: string;
  product: ProductDeal;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  onUpvote?: (id: string) => void;
  onQuickView?: (product: ProductDeal) => void;
}

export function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onQuickView
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const savingsAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const ctaInfo = getHighIntentCtaText(product);
  const ratingValue = product.rating || 4.5;
  const isHighRated = ratingValue >= 4.0;
  const isHotDeal = Boolean((discountPercent && discountPercent >= 25) || product.badge?.toLowerCase().includes('hot') || (product.upvotes && product.upvotes > 5));

  const handleCtaClick = (e: MouseEvent) => {
    e.preventDefault();
    openDarazDeal(product.affiliateUrl || 'https://www.daraz.com.np');
  };

  return (
    <article className="bg-[#0B132B] rounded-2xl border border-white/10 hover:border-orange-400/80 hover:shadow-[0_8px_30px_rgba(251,146,60,0.2)] transition-all duration-300 p-2 sm:p-3.5 flex flex-col justify-between group relative overflow-hidden text-[#dae2fd]">
      
      {/* 1. MEDIA CONTAINER */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="relative w-full aspect-square bg-[#131b2e] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer mb-2 sm:mb-2.5 group-hover:bg-[#171f33] border border-white/5 transition-colors"
      >
        {/* Floating Controls Bar: Wishlist */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-20 flex items-center gap-1">
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg backdrop-blur-md flex items-center justify-center transition-all active:scale-90 border cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-xs border-transparent'
                  : 'bg-slate-900/85 text-slate-400 hover:text-rose-400 hover:bg-slate-900 border-white/10 shadow-xs'
              }`}
              title={isWishlisted ? 'Saved in wishlist' : 'Add to wishlist'}
              aria-label="Wishlist"
            >
              <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          )}
        </div>

        {/* Dynamic Badges: Hot Deal / Discount / Verified */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 flex flex-col items-end gap-1 pointer-events-none">
          {discountPercent ? (
            <span className="bg-gradient-to-r from-orange-600 to-rose-600 text-white text-[9px] sm:text-[10px] font-['Outfit'] font-black px-1.5 py-0.5 rounded shadow-xs tracking-tight flex items-center gap-0.5 border border-rose-500/20">
              {isHotDeal && <Flame className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-white text-white" />}
              <span>-{discountPercent}%</span>
            </span>
          ) : product.badge ? (
            <span className="bg-orange-600 text-white text-[9px] sm:text-[10px] font-['Outfit'] font-bold px-1.5 py-0.5 rounded shadow-xs">
              {product.badge}
            </span>
          ) : null}

          {isHotDeal && (
            <span className="bg-slate-900/90 backdrop-blur-xs text-amber-300 text-[8px] sm:text-[9px] font-['Outfit'] font-black px-1.5 py-0.5 rounded border border-amber-400/20 shadow-2xs tracking-tight uppercase">
              Hot
            </span>
          )}
        </div>

        {/* Product Photo */}
        <img
          src={imgError || (!product.image && !product.imageUrl) ? 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80' : (product.imageUrl || product.image)}
          alt={product.name || product.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 2. CONTENT STACK */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata Row: Category & Verified Rating Badge */}
          <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] font-semibold text-slate-400 mb-0.5 min-w-0">
            <span className="text-orange-400 font-['Outfit'] font-bold uppercase tracking-wider truncate max-w-[80px] sm:max-w-none text-[9px] sm:text-[10px]">
              {product.category || 'Tech'}
            </span>

            {isHighRated && (
              <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/20 text-[8px] sm:text-[9px] shrink-0 font-['Outfit']">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{ratingValue.toFixed(1)}</span>
                <span className="text-amber-400 hidden sm:inline">• Top</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView && onQuickView(product)}
            className="font-['Outfit'] font-bold text-white text-[11px] sm:text-xs md:text-sm line-clamp-2 group-hover:text-orange-400 transition leading-snug cursor-pointer min-h-[28px] sm:min-h-[32px] break-words"
            title={product.name || product.title}
          >
            {product.name || product.title}
          </h3>

          {/* Pricing & Savings Callout */}
          <div className="my-1 min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm md:text-base font-['Outfit'] font-black text-orange-400 tracking-tight tabular-nums">
                Rs. {Number(product.price).toLocaleString('ne-NP')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 line-through tabular-nums">
                  Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
                </span>
              )}
            </div>

            {savingsAmount > 0 && (
              <div className="text-[9px] sm:text-[10px] font-bold text-emerald-400 mt-0.5 flex items-center gap-1 min-w-0 truncate font-['Outfit']">
                <span className="truncate">Save Rs. {Number(savingsAmount).toLocaleString('ne-NP')}</span>
              </div>
            )}
          </div>

          {/* Trust Ticker: COD & Nepal Delivery */}
          <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-slate-400 font-medium my-1 pb-1 border-b border-white/8 min-w-0 overflow-hidden">
            <span className="flex items-center gap-0.5 text-emerald-400 font-semibold shrink-0">
              <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
              <span>COD</span>
            </span>
            <span className="text-slate-600 shrink-0">•</span>
            <span className="truncate text-slate-400">Tested</span>
          </div>
        </div>

        {/* 3. HIGH-INTENT CONVERSION ACTION BAR */}
        <div className="pt-1.5 sm:pt-2 border-t border-white/8 flex flex-col gap-1 mt-1 w-full min-w-0">
          <a
            id={`buy-btn-${product.id}`}
            href={buildAffiliateUrl(product.affiliateUrl)}
            onClick={handleCtaClick}
            className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 hover:brightness-110 active:brightness-95 text-slate-950 font-['Outfit'] font-black text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-md shadow-orange-500/20 active:scale-[0.98] min-h-[32px] sm:min-h-[36px] cursor-pointer min-w-0 overflow-hidden"
            title="Open deal in Daraz App or Browser"
          >
            <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 stroke-[2.5]" />
            <span className="truncate sm:hidden">Grab Deal</span>
            <span className="hidden sm:inline truncate">{ctaInfo.primaryText}</span>
            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 opacity-80 hidden sm:inline stroke-[2.5]" />
          </a>
        </div>
      </div>

    </article>
  );
}
