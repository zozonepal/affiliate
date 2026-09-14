import { X, Trash2, ExternalLink, Heart, ShoppingBag } from 'lucide-react';
import { ProductDeal } from '../types';

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-red-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-none">
                Saved Deals ({wishlistedProducts.length})
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Your personal Daraz watchlist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <Heart className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Your wishlist is empty</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Click the heart icon on any deal card to save it here for tracking discounts.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl flex gap-3 items-center justify-between transition group"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 object-contain rounded-xl bg-white border p-1 shrink-0 cursor-pointer"
                  onClick={() => onQuickView(product)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80';
                  }}
                />

                <div className="flex-1 min-w-0 pr-1">
                  <h4
                    onClick={() => onQuickView(product)}
                    className="text-xs font-bold text-slate-900 line-clamp-1 cursor-pointer hover:text-orange-600"
                  >
                    {product.title}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xs font-bold text-orange-600">Rs.</span>
                    <span className="text-sm font-black text-slate-900">
                      {Number(product.price).toLocaleString('ne-NP')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] text-slate-400 line-through ml-1">
                        Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-900 hover:bg-orange-600 text-white rounded-xl transition"
                    title="Buy on Daraz"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
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
          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Total Deals Value:</span>
              <span className="font-black text-slate-900 text-sm">
                Rs. {totalValue.toLocaleString('ne-NP')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={onClearWishlist}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 underline py-2 min-h-[40px] flex items-center"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition min-h-[40px]"
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
