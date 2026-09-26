import { useState, useEffect } from 'react';
import { X, ExternalLink, Heart, ThumbsUp, Star, ShieldCheck, Truck, Check, Share2, Ticket, CheckCircle, Palette } from 'lucide-react';
import { ProductDeal, UserAccount } from '../types';
import { ShareModal } from './ShareModal';

interface ProductDetailModalProps {
  product: ProductDeal | null;
  user: UserAccount | null;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onUpvote: (id: string) => void;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  user,
  isWishlisted,
  onToggleWishlist,
  onUpvote,
  onClose
}: ProductDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [promoCopied, setPromoCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);

  useEffect(() => {
    if (product?.colorVariants && product.colorVariants.length > 0) {
      const idx = product.colorVariants.findIndex((v) => v.image === product.image);
      setSelectedColorIdx(idx >= 0 ? idx : 0);
    } else {
      setSelectedColorIdx(0);
    }
  }, [product]);

  if (!product) return null;

  const hasVariants = Boolean(product.colorVariants && product.colorVariants.length > 0);
  const activeVariant = hasVariants && product.colorVariants ? product.colorVariants[selectedColorIdx] : null;
  const heroImage = (activeVariant?.image || product.imageUrl || product.image);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const hasUpvoted = user && Array.isArray(product.upvotedBy) && product.upvotedBy.includes(user.uid);

  const handleShare = () => {
    setIsShareOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none duration-200">
        
        {/* Mobile drag handle bar */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded-md">
                {product.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* Image Preview and Multiple Color Thumbnails */}
            <div className="flex flex-col gap-2.5">
              <div className="relative h-64 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 overflow-hidden">
                <img
                  src={heroImage}
                  alt={activeVariant ? `${product.name || product.title} (${activeVariant.name})` : (product.name || product.title)}
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80';
                  }}
                />
                {discountPercent && (
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                    SAVE {discountPercent}%
                  </div>
                )}
                {activeVariant && (
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/50"
                      style={{ backgroundColor: activeVariant.colorCode || '#ffffff' }}
                    />
                    <span>{activeVariant.name}</span>
                  </div>
                )}
              </div>

              {/* Color Variant Thumbnail Gallery */}
              {hasVariants && product.colorVariants && product.colorVariants.length > 1 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                    <span>Color Photos ({product.colorVariants.length}):</span>
                    <span className="font-bold text-slate-800">{activeVariant?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {product.colorVariants.map((variant, idx) => {
                      const isActive = selectedColorIdx === idx;
                      return (
                        <button
                          key={variant.name + idx}
                          type="button"
                          onClick={() => setSelectedColorIdx(idx)}
                          className={`relative flex items-center gap-1.5 p-1 rounded-xl border bg-white transition-all shrink-0 ${
                            isActive
                              ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={variant.image}
                            alt={variant.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-0.5"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80';
                            }}
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: variant.colorCode || '#333333' }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Price & Primary Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {product.name || product.title}
              </h2>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>{product.rating ? product.rating.toFixed(1) : '4.6'}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500">
                  {product.reviewsCount || 48} Daraz verified reviews
                </span>
              </div>

              {/* Color Variant Selector Pills */}
              {hasVariants && product.colorVariants && (
                <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-orange-600" />
                      <span>Available Colors:</span>
                    </span>
                    <span className="font-extrabold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded text-[11px]">
                      {activeVariant?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {product.colorVariants.map((variant, idx) => {
                      const isSelected = selectedColorIdx === idx;
                      return (
                        <button
                          key={variant.name + idx}
                          type="button"
                          onClick={() => setSelectedColorIdx(idx)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                            style={{ backgroundColor: variant.colorCode || '#333' }}
                          />
                          <span>{variant.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <span className="text-xs font-bold text-slate-400 block mb-1">Current Deal Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-orange-600">Rs.</span>
                  <span className="text-3xl font-black text-slate-900">
                    {Number(product.price).toLocaleString('ne-NP')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through ml-1">
                      Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
                    </span>
                  )}
                </div>
                {product.seller && (
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Sold by: <span className="font-bold text-slate-700">{product.seller}</span>
                  </p>
                )}

                {product.promoCode && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between bg-orange-50/70 -mx-4 -mb-4 p-3 rounded-b-xl">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-orange-600" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Daraz Promo Code</span>
                        <span className="font-mono font-black text-orange-700 text-sm tracking-wider">{product.promoCode}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(product.promoCode || '');
                        setPromoCopied(true);
                        setTimeout(() => setPromoCopied(false), 2000);
                      }}
                      className="text-xs font-bold bg-white text-orange-700 hover:text-orange-900 border border-orange-200 px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5 transition"
                    >
                      {promoCopied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Code Copied!</span>
                        </>
                      ) : (
                        <span>Copy Code</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpvote(product.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    hasUpvoted
                      ? 'bg-orange-50 border-orange-200 text-orange-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-orange-600 text-orange-600' : ''}`} />
                  <span>Upvote ({product.upvotes || 0})</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-bold"
                  title="Share deal on WhatsApp & Facebook"
                >
                  <Share2 className="w-4 h-4 text-orange-600" />
                  <span>Share</span>
                </button>
              </div>

            </div>

          </div>

          {/* Description & Key Specs */}
          {product.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Deal Overview & Highlights
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                {product.description}
              </p>
            </div>
          )}

          {/* Daraz Shopping Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/50 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold block">Buyer Protection</span>
                Check seller rating and Daraz Mall badge for genuine warranty.
              </div>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/50 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold block">Delivery Nepal</span>
                Available across Kathmandu valley and all major districts.
              </div>
            </div>
          </div>

        </div>

        {/* Footer Action - Sticky on mobile */}
        <div className="p-3.5 sm:p-5 bg-slate-50 border-t border-slate-200/80 sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-2.5 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-5">
          <div className="text-[11px] text-slate-500 text-center sm:text-left hidden sm:block">
            *Prices on Daraz Nepal may fluctuate with flash sales and vouchers.
          </div>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition min-h-[48px] active:scale-[0.98]"
          >
            <span>Proceed to Buy on Daraz Nepal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={product}
      />
    </div>
  );
}
