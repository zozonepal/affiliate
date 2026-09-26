import { useRef, type KeyboardEvent } from 'react';
import { 
  ShoppingBag, 
  Search, 
  X, 
  SlidersHorizontal, 
  Heart, 
  Plus, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { UserAccount, PriceFilterRange, SortOption, ProductDeal } from '../types';
import { NotificationCenter } from './NotificationCenter';

interface MobileHeaderProps {
  user: UserAccount | null;
  wishlistCount: number;
  deals?: ProductDeal[];
  onQuickView?: (product: ProductDeal) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  priceFilter: PriceFilterRange;
  sortOption: SortOption;
  onOpenFilterModal: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenSubmitDeal: () => void;
  totalDeals: number;
}

export function MobileHeader({
  user,
  wishlistCount,
  deals = [],
  onQuickView = () => {},
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  priceFilter,
  sortOption,
  onOpenFilterModal,
  onOpenWishlist,
  onOpenAuth,
  onOpenSubmitDeal,
  totalDeals
}: MobileHeaderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFilterActive = priceFilter !== 'all' || sortOption !== 'featured';

  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs w-full max-w-full overflow-hidden">
      
      {/* Top App Bar */}
      <div className="px-2.5 sm:px-3.5 pt-2 pb-1.5 flex items-center justify-between gap-1.5 sm:gap-2">
        
        {/* Brand */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shadow-2xs overflow-hidden shrink-0">
            <img src="/logo.png" alt="DealFinder Nepal Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 leading-none truncate">
              DealFinder<span className="text-orange-600">NP</span>
            </span>
          </div>
        </div>

        {/* Quick Action Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Notifications */}
          <NotificationCenter
            user={user}
            deals={deals}
            onQuickView={onQuickView}
            onOpenAuth={onOpenAuth}
          />

          {/* Wishlist - Button 2 */}
          <button
            onClick={onOpenWishlist}
            className="relative w-8 h-8 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-slate-100 border border-transparent hover:border-slate-200/60 active:scale-90 transition flex items-center justify-center shrink-0"
            title="Saved Deals"
            aria-label="View Saved Deals"
          >
            <Heart className="w-4 h-4 shrink-0" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-orange-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </button>

          {/* User Account - Button 3 */}
          {user ? (
            <button
              onClick={onOpenAuth}
              className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center border border-orange-200 overflow-hidden active:scale-95 transition shrink-0 shadow-2xs"
              title={user.displayName || 'Account'}
              aria-label="Account"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                user.displayName?.charAt(0).toUpperCase() || 'U'
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-8 h-8 rounded-xl text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200/80 active:scale-95 transition flex items-center justify-center shrink-0"
              title="Sign In"
              aria-label="Sign In"
            >
              <UserIcon className="w-4 h-4 text-slate-700 shrink-0" />
            </button>
          )}
        </div>

      </div>

      {/* Mobile Search & Filter Bar */}
      <div className="px-3 pb-2 flex items-center gap-2">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search deals, earbuds, electronics..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl border border-transparent focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition min-h-[38px]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter & Sort Trigger Button */}
        <button
          onClick={onOpenFilterModal}
          className={`relative px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 min-h-[38px] shrink-0 border ${
            isFilterActive
              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
          }`}
          aria-label="Filter and sort deals"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {isFilterActive && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </button>

      </div>

      {/* Category Pills Horizontal Scroll */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-1 px-3 pb-2.5 overflow-x-auto no-scrollbar scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl w-max">
          {categories.map((category) => {
            const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg whitespace-nowrap transition-all duration-150 shrink-0 flex items-center gap-1 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 active:bg-slate-200/50'
                }`}
              >
                {category === 'All' && <Sparkles className="w-3 h-3 text-amber-300" />}
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
