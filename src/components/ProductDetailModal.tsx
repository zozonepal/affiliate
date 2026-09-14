import { useState } from 'react';
import { X, ExternalLink, Heart, ThumbsUp, Star, ShieldCheck, Truck, Check, Share2, Ticket, CheckCircle } from 'lucide-react';
import { ProductDeal, UserAccount } from '../types';

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

  if (!product) return null;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const hasUpvoted = user && Array.isArray(product.upvotedBy) && product.upvotedBy.includes(user.uid);

  const handleShare = () => {
    navigator.clipboard.writeText(product.affiliateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
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
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* Image Preview */}
            <div className="relative h-64 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80';
                }}
              />
              {discountPercent && (
                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                  SAVE {discountPercent}%
                </div>
              )}
            </div>

            {/* Price & Primary Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {product.title}
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
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
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

        {/* Footer Action */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            *Prices on Daraz Nepal may fluctuate with flash sales and vouchers.
          </div>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
          >
            <span>Proceed to Buy on Daraz</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
