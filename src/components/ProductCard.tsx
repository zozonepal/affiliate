import { useState } from 'react';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { ProductDeal, UserAccount } from '../types';

interface ProductCardProps {
  key?: string;
  product: ProductDeal;
  user: UserAccount | null;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  onUpvote?: (id: string) => void;
  onQuickView?: (product: ProductDeal) => void;
  onEdit?: (product: ProductDeal) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({
  product,
  user,
  onQuickView,
  onEdit,
  onDelete
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const isAdmin = user?.role === 'admin';

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-orange-300 shadow-xs hover:shadow-md transition-all duration-200 p-2.5 sm:p-3.5 flex flex-col justify-between group">
      
      {/* 1. IMAGE with Top-Right Discount Badge */}
      <div 
        onClick={() => onQuickView && onQuickView(product)}
        className="relative w-full aspect-square bg-slate-50 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 cursor-pointer mb-2.5 sm:mb-3"
      >
        {/* Top-Right Discount Tag (as shown in wireframe: 50% or -X%) */}
        {discountPercent ? (
          <span className="absolute top-1.5 right-1.5 z-10 bg-slate-900/90 text-white text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md shadow-xs pointer-events-none tracking-tight">
            {discountPercent}%
          </span>
        ) : null}

        <img
          src={imgError || !product.image ? 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80' : product.image}
          alt={product.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      {/* Content Stack: Name -> Price -> Button */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* 2. NAME */}
          <h3
            onClick={() => onQuickView && onQuickView(product)}
            className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-orange-600 transition leading-snug cursor-pointer mb-1 sm:mb-1.5 min-h-[32px] sm:min-h-[38px]"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* 3. PRICE */}
          <div className="flex items-baseline gap-1.5 mb-2.5 sm:mb-3">
            <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Rs. {Number(product.price).toLocaleString('ne-NP')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
              </span>
            )}
          </div>
        </div>

        {/* 4. BUTTON */}
        <div>
          <a
            id={`buy-btn-${product.id}`}
            href={product.affiliateUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] min-h-[38px]"
          >
            <span>Buy on Daraz</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>

          {/* Optional Admin Controls */}
          {isAdmin && (
            <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-slate-100">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="p-1 text-slate-400 hover:text-orange-600 transition"
                  title="Edit product"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(product.id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition"
                  title="Delete product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
