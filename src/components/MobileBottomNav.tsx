import { Home, Heart, SlidersHorizontal, Trophy } from 'lucide-react';
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B132B]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-1 py-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Deals / Home */}
        <button
          onClick={() => handleViewClick('grid')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[46px] py-0.5 active:scale-95 transition cursor-pointer select-none ${
            activeView === 'grid' ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-white font-medium'
          }`}
          aria-label="Explore Deals"
        >
          <Home className="w-4 h-4" />
          <span className="font-['Outfit'] text-[11px] mt-0.5 tracking-tight">Deals</span>
        </button>

        {/* Top 10 Best Of Rankings */}
        <button
          onClick={() => handleViewClick('best-of')}
          className={`flex flex-col items-center justify-center min-w-[52px] min-h-[46px] py-0.5 active:scale-95 transition cursor-pointer select-none ${
            activeView === 'best-of' ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-white font-medium'
          }`}
          aria-label="Top 10 Rankings"
        >
          <Trophy className="w-4 h-4" />
          <span className="font-['Outfit'] text-[11px] mt-0.5 tracking-tight">Top 10</span>
        </button>

        {/* Filter Trigger */}
        {onOpenFilter && (
          <button
            onClick={onOpenFilter}
            className="relative flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-0.5 text-slate-400 hover:text-orange-400 active:scale-95 transition cursor-pointer"
            aria-label="Filter Deals"
          >
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4" />
              {isFilterActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 border border-[#0B132B]" />
              )}
            </div>
            <span className="font-['Outfit'] text-[10px] font-semibold mt-0.5">Filters</span>
          </button>
        )}

        {/* Wishlist / Saved */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-0.5 text-slate-400 hover:text-orange-400 active:scale-95 transition cursor-pointer"
          aria-label="View Saved Deals"
        >
          <div className="relative">
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </div>
          <span className="font-['Outfit'] text-[10px] font-semibold mt-0.5">Saved</span>
        </button>

      </div>
    </nav>
  );
}
