import { useRef } from 'react';
import { Search, X, SlidersHorizontal, Heart, Sparkles } from 'lucide-react';
import { UserAccount, PriceFilterRange, SortOption, ProductDeal } from '../types';

interface MobileHeaderProps {
  user: UserAccount | null;
  wishlistCount: number;
  deals?: ProductDeal[];
  onQuickView?: (product: ProductDeal) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  priceFilter: PriceFilterRange;
  sortOption: SortOption;
  onOpenFilterModal: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenSubmitDeal: () => void;
  totalDeals: number;
  onOpenGateway?: () => void;
}

export function MobileHeader({
  user,
  wishlistCount,
  deals = [],
  onQuickView = () => {},
  searchQuery,
  onSearchChange,
  priceFilter,
  sortOption,
  onOpenFilterModal,
  onOpenWishlist,
  onOpenAuth,
  onOpenGateway
}: MobileHeaderProps) {
  const isFilterActive = priceFilter !== 'all' || sortOption !== 'featured';

  return (
    <header className="md:hidden sticky top-0 z-30 bg-[#0b1326]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_2px_15px_rgba(0,0,0,0.4)] w-full max-w-full overflow-hidden text-white">
      
      {/* Top App Bar */}
      <div className="px-3 pt-2.5 pb-2 flex items-center justify-between gap-2">
        
        {/* Brand */}
        <div className="flex items-center gap-2 shrink min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
            <img src="/logo.png" alt="Daraz Deals Nepal Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-['Outfit'] font-black text-sm tracking-tight text-white leading-none truncate">
              Daraz Deals<span className="text-orange-500">NP</span>
            </span>
          </div>
        </div>

        {/* Quick Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Feed / Category Gateway Picker */}
          {onOpenGateway && (
            <button
              onClick={onOpenGateway}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-orange-400 bg-orange-500/15 border border-orange-500/30 active:scale-95 transition text-xs font-['Outfit'] font-bold shrink-0 cursor-pointer"
              title="Personalize Feed Categories"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Feed</span>
            </button>
          )}

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative w-8 h-8 rounded-xl text-slate-300 hover:text-orange-400 hover:bg-white/5 border border-white/10 active:scale-90 transition flex items-center justify-center shrink-0 cursor-pointer"
            title="Saved Deals"
            aria-label="View Saved Deals"
          >
            <Heart className="w-4 h-4 shrink-0" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-md flex items-center justify-center shadow-xs">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Search & Filter Bar */}
      <div className="px-3 pb-2.5 flex items-center gap-2">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search earbuds, smartwatch, powerbanks..."
            className="w-full pl-9 pr-8 py-1.5 sm:py-2 bg-[#131b2e] focus:bg-[#171f33] text-white placeholder-slate-400 text-xs rounded-xl border border-white/10 focus:border-orange-400/80 focus:outline-none focus:ring-1 focus:ring-orange-400/30 transition min-h-[36px] font-['Hanken_Grotesk']"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter & Sort Trigger Button */}
        <button
          onClick={onOpenFilterModal}
          className={`relative px-3 py-2 rounded-xl text-xs font-['Outfit'] font-bold flex items-center gap-1.5 transition active:scale-95 min-h-[38px] shrink-0 border cursor-pointer ${
            isFilterActive
              ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 border-orange-400 shadow-sm'
              : 'bg-[#131b2e] hover:bg-[#1E293B] text-slate-300 border-white/10'
          }`}
          aria-label="Filter and sort deals"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {isFilterActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
          )}
        </button>

      </div>
    </header>
  );
}
