import { Heart } from 'lucide-react';
import { UserAccount, CloudSyncStatus, ProductDeal } from '../types';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  user: UserAccount | null;
  syncStatus: CloudSyncStatus;
  wishlistCount: number;
  deals?: ProductDeal[];
  onQuickView?: (product: ProductDeal) => void;
  onOpenAuth: () => void;
  onOpenWishlist: () => void;
  onLogout: () => void;
}

export function Navbar({
  user,
  wishlistCount,
  deals = [],
  onQuickView = () => {},
  onOpenAuth,
  onOpenWishlist,
  onLogout
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs w-full">
      <div className="w-full px-3 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all shrink-0 overflow-hidden">
              <img src="/logo.png" alt="DealFinder Nepal" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5 font-black text-sm sm:text-lg tracking-tight text-slate-900 leading-snug whitespace-nowrap">
                <span>DealFinder</span>
                <span className="text-orange-600">NP</span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium leading-normal mt-0.5 truncate">
                Nepal Deals & Discount Catalog
              </p>
            </div>
          </a>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Notification Center */}
          <NotificationCenter
            user={user}
            deals={deals}
            onQuickView={onQuickView}
            onOpenAuth={onOpenAuth}
          />

          {/* Wishlist Button */}
          <button
            id="nav-wishlist-btn"
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-700 hover:text-orange-600 hover:bg-slate-100 rounded-xl transition shrink-0"
            title="Saved Deals"
            aria-label="View Saved Deals"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
