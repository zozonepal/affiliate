import { X, Trash2, ExternalLink, Heart, ShoppingBag, Smartphone } from 'lucide-react';
import { ProductDeal } from '../types';
import { openDarazDeal, buildAffiliateUrl } from '../utils/affiliateLink';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  allProducts: ProductDeal[];
  onRemoveFromWishlist: (id: string) => void;
  onClearWishlist: () => void;
  onQuickView: (product: ProductDeal) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  allProducts,
  onRemoveFromWishlist,
  onClearWishlist,
  onQuickView
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));
  const totalValue = wishlistedProducts.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end font-['Hanken_Grotesk']">
      <div className="bg-[#0B132B] text-[#dae2fd] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-red-400" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-black text-white text-base leading-none">
                Saved Deals ({wishlistedProducts.length})
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Your personal Daraz watchlist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-['Outfit'] font-bold text-white">Your wishlist is empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Click the heart icon on any deal card to save it here for tracking discounts.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="p-3 bg-[#131b2e] hover:bg-[#1a233b] border border-white/10 rounded-2xl flex gap-3 items-center justify-between transition group"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 object-contain rounded-xl bg-[#0B132B] border border-white/5 p-1 shrink-0 cursor-pointer"
                  onClick={() => onQuickView(product)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80';
                  }}
                />

                <div className="flex-1 min-w-0 pr-1">
                  <h4
                    onClick={() => onQuickView(product)}
                    className="text-xs font-['Outfit'] font-bold text-white line-clamp-1 cursor-pointer hover:text-orange-400"
                  >
                    {product.title}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-0.5 font-['Outfit']">
                    <span className="text-xs font-bold text-orange-400">Rs.</span>
                    <span className="text-sm font-black text-white">
                      {Number(product.price).toLocaleString('ne-NP')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] text-slate-400 line-through ml-1">
                        Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-['Outfit']">
                  <a
                    href={buildAffiliateUrl(product.affiliateUrl)}
                    onClick={(e) => {
                      e.preventDefault();
                      openDarazDeal(product.affiliateUrl);
                    }}
                    className="py-1.5 px-2.5 bg-gradient-to-r from-orange-500 to-amber-400 hover:brightness-105 text-slate-950 rounded-xl text-xs font-extrabold transition flex items-center gap-1 shadow-sm cursor-pointer"
                    title="Open deal on Daraz App"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">App Deal</span>
                  </a>

                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 bg-[#070d1a] border-t border-white/10 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))] font-['Outfit']">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Total Deals Value:</span>
              <span className="font-black text-white text-sm">
                Rs. {totalValue.toLocaleString('ne-NP')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={onClearWishlist}
                className="text-xs font-semibold text-slate-400 hover:text-red-400 underline py-2 min-h-[40px] flex items-center cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-4 py-2 rounded-xl transition min-h-[40px] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
