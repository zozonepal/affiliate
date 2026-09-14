import { useState } from 'react';
import { ExternalLink, Heart, ThumbsUp, Star, Eye, Pencil, Trash2, CheckCircle, Ticket } from 'lucide-react';
import { ProductDeal, UserAccount } from '../types';

interface ProductCardProps {
  key?: string;
  product: ProductDeal;
  user: UserAccount | null;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onUpvote: (id: string) => void;
  onQuickView: (product: ProductDeal) => void;
  onEdit?: (product: ProductDeal) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({
  product,
  user,
  isWishlisted,
  onToggleWishlist,
  onUpvote,
  onQuickView,
  onEdit,
  onDelete
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const hasUpvoted = user && Array.isArray(product.upvotedBy) && product.upvotedBy.includes(user.uid);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Image Section */}
      <div className="relative p-3">
        <div className="relative w-full h-48 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
          
          {/* Custom Badge or Discount Badge */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
            {product.badge && (
              <span className="text-[10px] font-extrabold uppercase tracking-wide bg-orange-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                {product.badge}
              </span>
            )}
            {discountPercent && (
              <span className="text-[10px] font-bold bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded-md shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-red-50 text-red-600 shadow-xs scale-105'
                : 'bg-white/80 text-slate-500 hover:text-red-500 hover:bg-white shadow-xs'
            }`}
            title={isWishlisted ? 'Remove from Saved' : 'Save deal'}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
          </button>

          {/* Product Image */}
          <img
            src={imgError || !product.image ? 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80' : product.image}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Quick View overlay button */}
          <button
            id={`quickview-btn-${product.id}`}
            onClick={() => onQuickView(product)}
            className="absolute bottom-2 inset-x-2 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Details</span>
          </button>
        </div>

        {/* Category & Title */}
        <div className="pt-3">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              {product.category || 'Deals'}
            </span>
            {product.seller && (
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                {product.seller}
              </span>
            )}
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-orange-600 cursor-pointer transition leading-snug mt-1 min-h-[2.5rem]"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating ? product.rating.toFixed(1) : '4.6'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500">
              ({product.reviewsCount || 48} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & Action Section */}
      <div className="p-3 pt-0 border-t border-slate-100 mt-2">
        <div className="flex items-baseline justify-between mb-3 pt-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-orange-600">Rs.</span>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {Number(product.price).toLocaleString('ne-NP')}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
              </span>
            )}
          </div>

          {/* Upvote Pill */}
          <button
            id={`upvote-btn-${product.id}`}
            onClick={() => onUpvote(product.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              hasUpvoted
                ? 'bg-orange-100 text-orange-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Helpful Deal Upvote"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-orange-600 text-orange-600' : ''}`} />
            <span>{product.upvotes || 0}</span>
          </button>
        </div>

        {/* Promo Code Box if available */}
        {product.promoCode && (
          <div className="mb-2.5 flex items-center justify-between bg-orange-50/80 border border-dashed border-orange-300 rounded-xl px-2.5 py-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-orange-950 min-w-0">
              <Ticket className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="text-[11px] text-slate-500 shrink-0">Code:</span>
              <span className="font-mono font-black text-orange-700 tracking-wider truncate">
                {product.promoCode}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(product.promoCode || '');
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
              className="text-[10px] font-bold text-orange-700 hover:text-orange-900 bg-white px-2 py-0.5 rounded-md shadow-2xs border border-orange-200 transition shrink-0 ml-1 cursor-pointer flex items-center gap-1"
              title="Copy promo code"
            >
              {isCopied ? (
                <>
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <span>Copy</span>
              )}
            </button>
          </div>
        )}

        {/* Affiliate Purchase Button */}
        <div className="space-y-2">
          <a
            id={`daraz-link-${product.id}`}
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-xs group-hover:bg-orange-600"
          >
            <span>Buy on Daraz Nepal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Admin Operations if logged in as Admin */}
          {isAdmin && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Admin:</span>
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 transition"
                    title="Edit Deal"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition"
                    title="Delete Deal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
