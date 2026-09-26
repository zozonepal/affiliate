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
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400/80 shadow-xs hover:shadow-xl transition-all duration-300 p-3 sm:p-4 flex flex-col justify-between group relative overflow-hidden">
      
      {/* 1. IMAGE with Top Badges & Wishlist Trigger */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-orange-50/20 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 cursor-pointer mb-3"
      >
        {/* Wishlist Heart Button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-2 left-2 z-20 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              isWishlisted
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white shadow-2xs'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
        )}

        {/* Top-Right Discount Badge */}
        {discountPercent ? (
          <span className="absolute top-2 right-2 z-10 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-md tracking-tight">
            -{discountPercent}%
          </span>
        ) : product.badge ? (
          <span className="absolute top-2 right-2 z-10 bg-slate-900 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
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

      {/* Content Stack: Name -> Category & Store -> Price -> Actions */}
      <div className="flex flex-col flex-1 justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-extrabold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
              {product.category || 'Tech'}
            </span>
            {product.seller && (
              <span className="text-[10px] font-medium text-slate-500 truncate max-w-[110px]" title={product.seller}>
                {product.seller}
              </span>
            )}
          </div>

          {/* 2. NAME */}
          <h3
            onClick={() => onQuickView && onQuickView(product)}
            className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-orange-600 transition leading-snug cursor-pointer min-h-[32px] sm:min-h-[38px]"
            title={product.name || product.title}
          >
            {product.name || product.title}
          </h3>

          {/* 3. PRICE */}
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Rs. {Number(product.price).toLocaleString('ne-NP')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
              </span>
            )}
          </div>

          {/* Promo Code Badge if present */}
          {product.promoCode && (
            <div className="mt-2 flex items-center justify-between p-1.5 bg-orange-50 border border-orange-200/80 rounded-xl">
              <span className="text-[10px] font-mono font-extrabold text-orange-800 uppercase flex items-center gap-1">
                <Ticket className="w-3 h-3 text-orange-600" />
                <span>Code: {product.promoCode}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[10px] font-extrabold text-orange-600 hover:text-orange-800 bg-white px-2 py-0.5 rounded-lg border border-orange-200 transition flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 4. BUTTONS & UPVOTE */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2">
            <a
              id={`buy-btn-${product.id}`}
              href={product.affiliateUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-500/20 active:scale-[0.98] min-h-[38px]"
            >
              <span>Buy on Daraz</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>

            {onUpvote && (
              <button
                type="button"
                onClick={() => onUpvote(product.id)}
                className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 font-bold text-xs flex items-center gap-1 transition active:scale-95 min-h-[38px] cursor-pointer"
                title="Upvote this deal"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{product.upvotes || 0}</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
