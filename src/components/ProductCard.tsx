import { useState, type MouseEvent } from 'react';
import { ExternalLink, Heart, Ticket, Check, Star, ShieldCheck, Flame, Scale, Smartphone } from 'lucide-react';
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
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleCopyCode = (e: MouseEvent) => {
    e.stopPropagation();
    if (!product.promoCode) return;
    navigator.clipboard.writeText(product.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCtaClick = (e: MouseEvent) => {
    e.preventDefault();
    openDarazDeal(product.affiliateUrl || 'https://www.daraz.com.np');
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 hover:border-orange-500/60 shadow-2xs hover:shadow-xl transition-all duration-300 p-2.5 sm:p-3.5 flex flex-col justify-between group relative overflow-hidden">
      
      {/* 1. MEDIA CONTAINER */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="relative w-full aspect-square bg-[#F8F9FA] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer mb-2.5 group-hover:bg-[#F1F3F5] transition-colors"
      >
        {/* Floating Controls Bar: Wishlist */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg backdrop-blur-md flex items-center justify-center transition-all active:scale-90 border border-slate-200/60 ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-xs border-transparent'
                  : 'bg-white/95 text-slate-400 hover:text-rose-500 hover:bg-white shadow-2xs'
              }`}
              title={isWishlisted ? 'Saved in wishlist' : 'Add to wishlist'}
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          )}
        </div>

        {/* Dynamic Badges: Hot Deal / Discount / Verified */}
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1 pointer-events-none">
          {discountPercent ? (
            <span className="bg-gradient-to-r from-orange-600 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs tracking-tight flex items-center gap-0.5 border border-rose-500/20">
              {isHotDeal && <Flame className="w-2.5 h-2.5 fill-white text-white" />}
              <span>-{discountPercent}%</span>
            </span>
          ) : product.badge ? (
            <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              {product.badge}
            </span>
          ) : null}

          {isHotDeal && (
            <span className="bg-slate-900/90 backdrop-blur-xs text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-2xs tracking-tight uppercase">
              Hot Deal
            </span>
          )}
        </div>

        {/* Product Photo */}
        <img
          src={imgError || (!product.image && !product.imageUrl) ? 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80' : (product.imageUrl || product.image)}
          alt={product.name || product.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 2. CONTENT STACK */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata Row: Category & Verified Rating Badge */}
          <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-slate-400 mb-1 min-w-0">
            <span className="text-orange-600 font-extrabold uppercase tracking-wide truncate max-w-[85px] sm:max-w-none">
              {product.category || 'Tech'}
            </span>

            {isHighRated && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200/70 text-[9px] shrink-0">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>{ratingValue.toFixed(1)}</span>
                <span className="text-amber-500 hidden sm:inline">• Top Seller</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView && onQuickView(product)}
            className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-orange-600 transition leading-snug cursor-pointer min-h-[32px] sm:min-h-[36px] break-words"
            title={product.name || product.title}
          >
            {product.name || product.title}
          </h3>

          {/* Pricing & Savings Callout */}
          <div className="my-1.5 min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight tabular-nums">
                Rs. {Number(product.price).toLocaleString('ne-NP')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through tabular-nums">
                  Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
                </span>
              )}
            </div>

            {savingsAmount > 0 && (
              <div className="text-[10px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1 min-w-0 truncate">
                <span className="truncate">Save Rs. {Number(savingsAmount).toLocaleString('ne-NP')}</span>
              </div>
            )}
          </div>

          {/* Trust Ticker: COD & Nepal Delivery */}
          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-medium my-1 pb-1 border-b border-slate-100 min-w-0 overflow-hidden">
            <span className="flex items-center gap-0.5 text-emerald-700 font-semibold shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>COD</span>
            </span>
            <span className="text-slate-300 shrink-0">•</span>
            <span className="truncate text-slate-400">Nepal Warranty</span>
          </div>

          {/* Promo Voucher Strip */}
          {product.promoCode && (
            <div className="my-1.5 flex items-center justify-between px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] min-w-0">
              <span className="font-mono font-bold text-amber-900 flex items-center gap-1 min-w-0 truncate">
                <Ticket className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate">{product.promoCode}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[10px] font-extrabold text-amber-900 hover:text-orange-600 shrink-0 ml-1 transition"
              >
                {copiedCode ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  'Copy'
                )}
              </button>
            </div>
          )}
        </div>

        {/* 3. HIGH-INTENT CONVERSION ACTION BAR */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 mt-1 w-full min-w-0">
          <a
            id={`buy-btn-${product.id}`}
            href={buildAffiliateUrl(product.affiliateUrl)}
            onClick={handleCtaClick}
            className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-[11px] sm:text-xs py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-2xs active:scale-[0.98] min-h-[36px] cursor-pointer min-w-0 overflow-hidden"
            title="Open deal in Daraz App or Browser"
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate sm:hidden">Grab Deal</span>
            <span className="hidden sm:inline truncate">{ctaInfo.primaryText}</span>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-80 hidden sm:inline" />
          </a>
        </div>
      </div>

    </article>
  );
}
