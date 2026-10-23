import { Home, Heart, SlidersHorizontal, Trophy, Zap } from 'lucide-react';
import { UserAccount, ActiveViewMode } from '../types';

interface MobileBottomNavProps {
  user: UserAccount | null;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenFilter?: () => void;
  onOpenSubmitDeal?: () => void;
  isFilterActive?: boolean;
  activeView?: ActiveViewMode;
  onViewChange?: (view: ActiveViewMode) => void;
}

export function MobileBottomNav({
  wishlistCount,
  onOpenWishlist,
  onOpenFilter,
  isFilterActive,
  activeView = 'grid',
  onViewChange
}: MobileBottomNavProps) {
  const handleViewClick = (view: ActiveViewMode) => {
    if (onViewChange) {
      onViewChange(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.07)] px-1 py-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Deals / Home */}
        <button
          onClick={() => handleViewClick('grid')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[46px] py-0.5 active:scale-95 transition cursor-pointer select-none ${
            activeView === 'grid' ? 'text-orange-600 font-black' : 'text-slate-800 hover:text-black font-extrabold'
          }`}
          aria-label="Explore Deals"
        >
          <Home className="w-4 h-4" />
          <span className="text-[11px] font-black mt-0.5 tracking-tight">Deals</span>
        </button>

        {/* Top 10 Best Of Rankings */}
        <button
          onClick={() => handleViewClick('best-of')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[46px] py-0.5 active:scale-95 transition cursor-pointer select-none ${
            activeView === 'best-of' ? 'text-orange-600 font-black' : 'text-slate-800 hover:text-black font-extrabold'
          }`}
          aria-label="Top 10 Rankings"
        >
          <Trophy className="w-4 h-4" />
          <span className="text-[11px] font-black mt-0.5 tracking-tight">Top 10</span>
        </button>

        {/* Flash Megadeals Hub */}
        <button
          onClick={() => handleViewClick('megadeals')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[46px] py-0.5 active:scale-95 transition cursor-pointer select-none ${
            activeView === 'megadeals' ? 'text-orange-600 font-black' : 'text-slate-800 hover:text-black font-extrabold'
          }`}
          aria-label="Flash Deals"
        >
          <div className="relative">
            <Zap className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-xs bg-rose-600 animate-pulse" />
          </div>
          <span className="text-[11px] font-black mt-0.5 tracking-tight">Flash</span>
        </button>

        {/* Filter Trigger */}
        {onOpenFilter && (
          <button
            onClick={onOpenFilter}
            className="relative flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-0.5 text-slate-500 hover:text-orange-600 active:scale-95 transition"
            aria-label="Filter Deals"
          >
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4" />
              {isFilterActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-xs bg-orange-600 border border-white" />
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">Filters</span>
          </button>
        )}

        {/* Wishlist / Saved */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-0.5 text-slate-500 hover:text-orange-600 active:scale-95 transition"
          aria-label="View Saved Deals"
        >
          <div className="relative">
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-md flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Saved</span>
        </button>

      </div>
    </nav>
  );
}
