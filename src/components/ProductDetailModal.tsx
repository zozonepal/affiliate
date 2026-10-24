import { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ExternalLink, 
  Heart, 
  ThumbsUp, 
  Star, 
  ShieldCheck, 
  Truck, 
  Check, 
  Share2, 
  CheckCircle, 
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Flame,
  Sparkles
} from 'lucide-react';
import { ProductDeal, UserAccount } from '../types';
import { ShareModal } from './ShareModal';
import { extractAllImages, getProductVariants } from '../utils/productImages';
import { openDarazDeal, buildAffiliateUrl, getHighIntentCtaText } from '../utils/affiliateLink';

interface ProductDetailModalProps {
  product: ProductDeal | null;
  user: UserAccount | null;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onUpvote: (id: string) => void;
  onClose: () => void;
}

function getVariantDisplayName(name: string | undefined, idx: number): string {
  if (!name) return `Option ${idx + 1}`;
  if (/^\d{6,}$/.test(name.trim())) {
    return `Style ${idx + 1}`;
  }
  return name;
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
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);

  // Extract all uploaded images (primary image, colorImages, colorVariants, images array, gallery, photos)
  const allImages = useMemo(() => {
    return extractAllImages(product);
  }, [product]);

  // Extract all normalized variants (from colorVariants or colorImages)
  const variants = useMemo(() => {
    return getProductVariants(product);
  }, [product]);

  // Reset when active product changes
  useEffect(() => {
    setActiveImgIdx(0);
    if (variants.length > 0) {
      const idx = variants.findIndex((v) => v.image === product?.image);
      setSelectedVariantIdx(idx >= 0 ? idx : 0);
    } else {
      setSelectedVariantIdx(0);
    }
  }, [product?.id, variants]);

  // Keyboard navigation for images
  useEffect(() => {
    if (!product || allImages.length <= 1) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveImgIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
      } else if (e.key === 'ArrowRight') {
        setActiveImgIdx((prev) => (prev + 1) % allImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, allImages.length]);

  if (!product) return null;

  const hasVariants = variants.length > 0;
  
  // Hero image based on active image selection
  const heroImage = allImages[activeImgIdx] || product.imageUrl || product.image;

  // Active color variant if the current hero image matches a variant, or fallback to selectedVariantIdx
  const activeVariant = hasVariants 
    ? (variants.find(v => v.image === heroImage) || variants[selectedVariantIdx])
    : null;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const hasUpvoted = user && Array.isArray(product.upvotedBy) && product.upvotedBy.includes(user.uid);

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleSelectImage = (idx: number) => {
    setActiveImgIdx(idx);
    const targetUrl = allImages[idx];
    if (variants.length > 0) {
      const matchedIdx = variants.findIndex(v => v.image === targetUrl);
      if (matchedIdx >= 0) {
        setSelectedVariantIdx(matchedIdx);
      }
    }
  };

  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    const nextIdx = (activeImgIdx - 1 + allImages.length) % allImages.length;
    handleSelectImage(nextIdx);
  };

  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    const nextIdx = (activeImgIdx + 1) % allImages.length;
    handleSelectImage(nextIdx);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 font-['Hanken_Grotesk']">
      <div className="bg-[#0B132B] text-[#dae2fd] rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none duration-200">
        
        {/* Mobile drag handle bar */}
        <div className="w-12 h-1 bg-white/20 rounded-sm mx-auto mt-2.5 sm:hidden" />

        {/* Header bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-white/10 sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-['Outfit'] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-xs font-['Outfit'] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 px-2.5 py-1 rounded-md shadow-xs">
                {product.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:bg-white/15 transition cursor-pointer"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Image Preview and Multi-Image Gallery */}
            <div className="flex flex-col gap-3">
              <div className="relative h-64 sm:h-72 bg-[#131b2e] rounded-2xl p-4 flex items-center justify-center border border-white/10 overflow-hidden group select-none">
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
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 text-xs font-['Outfit'] font-black px-2.5 py-1 rounded-lg shadow-md z-10">
                    SAVE {discountPercent}%
                  </div>
                )}

                {activeVariant && (
                  <div className="absolute top-3 left-3 bg-[#0B132B]/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10 shadow-xs flex items-center gap-1.5 z-10">
                    <span
                      className="w-2.5 h-2.5 rounded-sm border border-white/50 shrink-0"
                      style={{ backgroundColor: activeVariant.colorCode || '#ffffff' }}
                    />
                    <span>{getVariantDisplayName(activeVariant.name, selectedVariantIdx)}</span>
                  </div>
                )}

                {/* Multi-Image Counter Chip */}
                {allImages.length > 1 && (
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs z-10">
                    {activeImgIdx + 1} / {allImages.length}
                  </div>
                )}

                {/* Previous & Next Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-800 shadow-md backdrop-blur-xs flex items-center justify-center transition active:scale-90 border border-slate-200/80 cursor-pointer z-10"
                      aria-label="Previous image"
                      title="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-800 shadow-md backdrop-blur-xs flex items-center justify-center transition active:scale-90 border border-slate-200/80 cursor-pointer z-10"
                      aria-label="Next image"
                      title="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-700" />
                    </button>

                    {/* Bottom indicator dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/50 backdrop-blur-xs z-10">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectImage(i)}
                          className={`h-1.5 rounded-sm transition-all cursor-pointer ${
                            i === activeImgIdx ? 'bg-orange-500 w-3.5' : 'bg-white/70 hover:bg-white w-1.5'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Multi-Image Thumbnail Gallery (All Uploaded Photos) */}
              {allImages.length > 1 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
                    <span>Product Photos ({allImages.length}):</span>
                    <span className="text-[10px] text-slate-500 font-medium">Click photo to preview</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                    {allImages.map((imgUrl, idx) => {
                      const isActive = activeImgIdx === idx;
                      const matchedVariant = variants.find(v => v.image === imgUrl);

                      return (
                        <button
                          key={imgUrl.slice(0, 32) + idx}
                          type="button"
                          onClick={() => handleSelectImage(idx)}
                          className={`relative flex items-center justify-center p-1 rounded-xl border bg-[#131b2e] transition-all shrink-0 cursor-pointer ${
                            isActive
                              ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-xs scale-105'
                              : 'border-white/10 hover:border-white/20 opacity-75 hover:opacity-100 hover:scale-[1.02]'
                          }`}
                          title={matchedVariant ? `Option: ${getVariantDisplayName(matchedVariant.name, idx)}` : `Photo ${idx + 1}`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Photo ${idx + 1}`}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg bg-[#0B132B] border border-white/5 p-0.5"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80';
                            }}
                          />
                          {matchedVariant?.colorCode && (
                            <span
                              className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-sm border border-white/50 shadow-2xs shrink-0"
                              style={{ backgroundColor: matchedVariant.colorCode }}
                              title={matchedVariant.name}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Price & Primary Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-['Outfit'] font-bold text-white leading-snug">
                {product.name || product.title}
              </h2>

              <div className="flex items-center gap-2 font-['Outfit']">
                <div className="flex items-center text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>{product.rating ? product.rating.toFixed(1) : '4.6'}</span>
                </div>
                <span className="text-white/20">|</span>
                <span className="text-xs text-slate-400">
                  {product.reviewsCount || 48} Daraz verified reviews
                </span>
              </div>

              {/* Price Box */}
              <div className="bg-[#131b2e] p-4 rounded-2xl border border-white/10 font-['Outfit']">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-400 block">Current Deal Price:</span>
                  {discountPercent && (
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-md shadow-xs">
                      <Flame className="w-3 h-3 fill-slate-950 text-slate-950" />
                      <span>{discountPercent}% OFF</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-orange-400">Rs.</span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {Number(product.price).toLocaleString('ne-NP')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through ml-1">
                      Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
                    </span>
                  )}
                </div>

                {/* Net Savings & Urgency Callout */}
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="mt-2 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant Savings: Rs. {Number(product.originalPrice - product.price).toLocaleString('ne-NP')}</span>
                    <span className="text-slate-400 font-normal hidden sm:inline">• Daraz App Verified</span>
                  </div>
                )}

                {product.seller && (
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    Sold by: <span className="font-bold text-slate-200">{product.seller}</span>
                  </p>
                )}
              </div>

              {/* Interactive buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 font-['Outfit']">
                <button
                  onClick={() => onUpvote(product.id)}
                  className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold border transition min-w-0 cursor-pointer ${
                    hasUpvoted
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                      : 'border-white/10 text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${hasUpvoted ? 'fill-orange-400 text-orange-400' : ''}`} />
                  <span className="truncate">Upvote ({product.upvotes || 0})</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-xl text-[11px] sm:text-xs font-bold border transition shrink-0 cursor-pointer ${
                    isWishlisted
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'border-white/10 text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isWishlisted ? 'fill-red-400 text-red-400' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 transition text-[11px] sm:text-xs font-bold shrink-0 cursor-pointer"
                  title="Share deal on WhatsApp & Facebook"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 shrink-0" />
                  <span>Share</span>
                </button>
              </div>

            </div>

          </div>

          {/* Description & Key Specs */}
          {product.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-['Outfit'] font-bold text-white uppercase tracking-wider">
                Deal Overview & Highlights
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#131b2e] p-3.5 rounded-xl border border-white/10">
                {product.description}
              </p>
            </div>
          )}

          {/* Daraz Shopping Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#131b2e] rounded-xl border border-white/10 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block">Buyer Protection</span>
                Check seller rating and Daraz Mall badge for genuine warranty.
              </div>
            </div>
            <div className="p-3 bg-[#131b2e] rounded-xl border border-white/10 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block">Delivery Nepal</span>
                Available across Kathmandu valley and all major districts.
              </div>
            </div>
          </div>

        </div>

        {/* Footer Action - Sticky on mobile */}
        <div className="p-3 sm:p-5 bg-[#070d1a] border-t border-white/10 sticky bottom-0 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-5 shadow-2xl">
          <div className="text-[11px] text-slate-400 text-center sm:text-left hidden sm:block">
            <span className="font-['Outfit'] font-bold text-slate-200 block">Daraz Nepal Verified Affiliate Link</span>
            <span>Zero extra markup. Cash on Delivery (COD) & 7-day return available.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto font-['Outfit']">
            <a
              href={buildAffiliateUrl(product.affiliateUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-white/15 hover:border-white/30 bg-[#131b2e] text-slate-200 hover:text-white font-bold text-xs transition min-h-[44px] shrink-0"
              title="Open product on Daraz website"
            >
              <span className="hidden sm:inline">Open on Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => openDarazDeal(product.affiliateUrl)}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 hover:brightness-105 text-slate-950 font-extrabold text-xs sm:text-sm py-3 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-orange-500/25 transition min-h-[44px] sm:min-h-[48px] active:scale-[0.98] cursor-pointer min-w-0"
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              <span className="truncate">Open Deal on Daraz App</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80 hidden sm:inline" />
            </button>
          </div>
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
