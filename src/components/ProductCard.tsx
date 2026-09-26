import { useState, type MouseEvent } from 'react';
import { ExternalLink, Heart, ThumbsUp, Ticket, Check } from 'lucide-react';
import { ProductDeal } from '../types';

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
  onUpvote,
  onQuickView
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleCopyCode = (e: MouseEvent) => {
    e.stopPropagation();
    if (!product.promoCode) return;
    navigator.clipboard.writeText(product.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 hover:border-orange-500/50 shadow-2xs hover:shadow-lg transition-all duration-300 p-2.5 sm:p-3.5 flex flex-col justify-between group relative overflow-hidden">
      
      {/* 1. MEDIA CONTAINER */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="relative w-full aspect-square bg-[#F7F7F8] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer mb-2.5 group-hover:bg-[#F2F2F4] transition-colors"
      >
        {/* Wishlist Floating Heart */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-2 left-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white shadow-2xs'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        )}

        {/* Minimal Floating Discount Tag */}
        {discountPercent ? (
          <span className="absolute top-2 right-2 z-10 bg-slate-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs tracking-tight">
            -{discountPercent}%
          </span>
        ) : product.badge ? (
          <span className="absolute top-2 right-2 z-10 bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
            {product.badge}
          </span>
        ) : null}

        <img
          src={imgError || (!product.image && !product.imageUrl) ? 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80' : (product.imageUrl || product.image)}
          alt={product.name || product.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* 2. CONTENT STACK */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata Row: Quiet unboxed inline text */}
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mb-1 min-w-0">
            <span className="text-orange-600 font-extrabold uppercase tracking-wide truncate">
              {product.category || 'Tech'}
            </span>
            {product.seller && (
              <>
                <span aria-hidden="true" className="text-slate-300">•</span>
                <span className="text-slate-400 truncate" title={product.seller}>
                  {product.seller}
                </span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView && onQuickView(product)}
            className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-orange-600 transition leading-snug cursor-pointer min-h-[32px] sm:min-h-[36px]"
            title={product.name || product.title}
          >
            {product.name || product.title}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 my-1.5">
            <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight tabular-nums">
              Rs. {Number(product.price).toLocaleString('ne-NP')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through tabular-nums">
                Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
              </span>
            )}
          </div>

          {/* Promo Voucher Strip */}
          {product.promoCode && (
            <div className="my-1.5 flex items-center justify-between px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px]">
              <span className="font-mono font-bold text-amber-900 flex items-center gap-1 truncate">
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

        {/* 3. CONVERSION ACTION BAR */}
        <div className="pt-2 border-t border-slate-100/90 flex items-center mt-1">
          <a
            id={`buy-btn-${product.id}`}
            href={product.affiliateUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.97] min-h-[36px] whitespace-nowrap"
          >
            <span>Buy on Daraz</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      </div>

    </div>
  );
}
