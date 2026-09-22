import { useState } from 'react';
import { ExternalLink, Heart, ThumbsUp, Star, Eye, Pencil, Trash2, CheckCircle, Ticket, Share2 } from 'lucide-react';
import { ProductDeal, UserAccount } from '../types';
import { ShareModal } from './ShareModal';

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
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);

  const hasVariants = Boolean(product.colorVariants && product.colorVariants.length > 0);
  const activeVariant = hasVariants && product.colorVariants ? product.colorVariants[selectedColorIdx] : null;
  const currentImg = (activeVariant?.image || product.image);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const hasUpvoted = user && Array.isArray(product.upvotedBy) && product.upvotedBy.includes(user.uid);
  const isAdmin = user?.role === 'admin';

  const handleQuickViewWithColor = () => {
    if (activeVariant) {
      onQuickView({
        ...product,
        image: activeVariant.image
      });
    } else {
      onQuickView(product);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group h-[310px] sm:h-[340px]">
      
      {/* Top Image Section */}
      <div className="relative p-1.5 sm:p-2 flex-1 min-h-0 flex flex-col justify-between">
        <div className="relative w-full h-28 sm:h-36 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
          
          {/* Custom Badge or Discount Badge */}
          <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 z-10 flex flex-col gap-0.5 items-start pointer-events-none max-w-[80%]">
            {product.badge && (
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide bg-orange-600 text-white px-1.5 sm:px-2 py-0.5 rounded shadow-xs truncate max-w-full">
                {product.badge}
              </span>
            )}
            {discountPercent && (
              <span className="text-[9px] sm:text-[10px] font-bold bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Top-Right Card Actions: Share & Wishlist */}
          <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-10 flex items-center gap-1">
            {/* Share Deal Button */}
            <button
              id={`share-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(true);
              }}
              className="p-1.5 min-w-[30px] min-h-[30px] sm:min-w-[34px] sm:min-h-[34px] flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 bg-white/90 text-slate-600 hover:text-orange-600 hover:bg-white shadow-xs"
              title="Share deal (WhatsApp & Facebook)"
              aria-label="Share deal"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              id={`wishlist-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className={`p-1.5 min-w-[30px] min-h-[30px] sm:min-w-[34px] sm:min-h-[34px] flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
                isWishlisted
                  ? 'bg-red-50 text-red-600 shadow-xs scale-105'
                  : 'bg-white/90 text-slate-500 hover:text-red-500 hover:bg-white shadow-xs'
              }`}
              title={isWishlisted ? 'Remove from Saved' : 'Save deal'}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
            </button>
          </div>

          {/* Active color pill tag on image */}
          {activeVariant && (
            <div className="absolute bottom-1 left-1 sm:bottom-1.5 sm:left-1.5 bg-slate-900/80 backdrop-blur-xs text-[8px] sm:text-[9px] font-semibold text-white px-1.5 py-0.5 rounded shadow-xs z-10 pointer-events-none flex items-center gap-1 max-w-[70%]">
              <span 
                className="w-1.5 h-1.5 rounded-full shrink-0" 
                style={{ backgroundColor: activeVariant.colorCode || '#ffffff' }}
              />
              <span className="truncate">{activeVariant.name}</span>
            </div>
          )}

          {/* Product Image (updates based on selected color) */}
          <img
            src={imgError || !currentImg ? 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80' : currentImg}
            alt={activeVariant ? `${product.title} - ${activeVariant.name}` : product.title}
            onError={() => setImgError(true)}
            onClick={handleQuickViewWithColor}
            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            loading="lazy"
          />

          {/* Quick View overlay button */}
          <button
            id={`quickview-btn-${product.id}`}
            onClick={handleQuickViewWithColor}
            className="absolute bottom-1 inset-x-1 sm:bottom-1.5 sm:inset-x-1.5 bg-slate-900/85 hover:bg-slate-900 text-white text-[10px] sm:text-xs font-semibold py-1 px-1.5 sm:py-1 sm:px-2 rounded-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex items-center justify-center gap-1 backdrop-blur-xs min-h-[26px] sm:min-h-[30px] active:scale-95"
            aria-label="Quick View Deal"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Category, Color Dots & Title */}
        <div className="pt-1 sm:pt-1.5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-1 py-0.2 rounded truncate">
                {product.category || 'Deals'}
              </span>
              
              {/* Color Swatch Dots */}
              {hasVariants && product.colorVariants ? (
                <div 
                  className="flex items-center gap-1 bg-slate-100/90 px-1.5 py-0.5 rounded-full border border-slate-200/80 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  title={`${product.colorVariants.length} color variants`}
                >
                  {product.colorVariants.slice(0, 4).map((variant, idx) => (
                    <button
                      key={variant.name + idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColorIdx(idx);
                        setImgError(false);
                      }}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all relative ${
                        selectedColorIdx === idx
                          ? 'ring-2 ring-orange-500 ring-offset-1 scale-110'
                          : 'hover:scale-110 opacity-70 hover:opacity-100 border border-slate-300'
                      }`}
                      style={{ backgroundColor: variant.colorCode || '#333333' }}
                      title={`Color: ${variant.name}`}
                      aria-label={`Select ${variant.name}`}
                    />
                  ))}
                  {product.colorVariants.length > 4 && (
                    <span className="text-[8px] text-slate-500 font-bold leading-none">
                      +{product.colorVariants.length - 4}
                    </span>
                  )}
                </div>
              ) : product.seller ? (
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate max-w-[65px] sm:max-w-[100px]">
                  {product.seller}
                </span>
              ) : null}
            </div>

            <h3
              onClick={handleQuickViewWithColor}
              className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-orange-600 cursor-pointer transition leading-snug"
              title={product.title}
            >
              {product.title}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
            <div className="flex items-center text-amber-500 text-[10px] sm:text-xs font-bold gap-0.5">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating ? product.rating.toFixed(1) : '4.6'}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              {product.reviewsCount || 48} rev
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & Action Section */}
      <div className="p-1.5 sm:p-2.5 pt-0 border-t border-slate-100 shrink-0">
        <div className="flex items-baseline justify-between mb-1 sm:mb-1.5 pt-1">
          <div>
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-orange-600">Rs.</span>
              <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                {Number(product.price).toLocaleString('ne-NP')}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[9px] sm:text-[10px] text-slate-400 line-through">
                Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
              </span>
            )}
          </div>

          {/* Action Pills: Share & Upvote */}
          <div className="flex items-center gap-1">
            {/* Share Pill Button */}
            <button
              id={`share-pill-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(true);
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition active:scale-95"
              title="Share deal on WhatsApp & Facebook"
            >
              <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Share</span>
            </button>

            {/* Upvote Pill */}
            <button
              id={`upvote-btn-${product.id}`}
              onClick={() => onUpvote(product.id)}
              className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold transition active:scale-95 ${
                hasUpvoted
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Helpful Deal Upvote"
            >
              <ThumbsUp className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${hasUpvoted ? 'fill-orange-600 text-orange-600' : ''}`} />
              <span>{product.upvotes || 0}</span>
            </button>
          </div>
        </div>

        {/* Affiliate Purchase Button */}
        <div className="space-y-1">
          <a
            id={`daraz-link-${product.id}`}
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 transition duration-200 shadow-xs active:scale-[0.98] min-h-[36px]"
          >
            <span className="truncate sm:hidden">Buy on Daraz</span>
            <span className="hidden sm:inline">Buy on Daraz Nepal</span>
            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
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

      {/* Share Modal Dialog with pre-filled WhatsApp and Facebook links */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={product}
      />

    </div>
  );
}
