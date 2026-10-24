import { Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { UserAccount, CloudSyncStatus, ProductDeal } from '../types';

interface NavbarProps {
  user: UserAccount | null;
  syncStatus: CloudSyncStatus;
  wishlistCount: number;
  deals?: ProductDeal[];
  onQuickView?: (product: ProductDeal) => void;
  onOpenAuth: () => void;
  onOpenWishlist: () => void;
  onLogout: () => void;
  onOpenDomainModal?: () => void;
  onOpenGateway?: () => void;
}

export function Navbar({
  user,
  wishlistCount,
  deals = [],
  onQuickView = () => {},
  onOpenAuth,
  onOpenWishlist,
  onOpenDomainModal,
  onOpenGateway
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0b1326]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.35)] w-full">
      <div className="w-full px-3 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Daraz Deals Nepal" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5 font-['Outfit'] font-extrabold text-sm sm:text-base tracking-tight text-white leading-snug whitespace-nowrap">
                <span>Daraz Deals</span>
                <span className="text-orange-500">NP</span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 font-medium leading-normal mt-0.5 truncate">
                Curated Deals &amp; Price Drops • Nepal
              </p>
            </div>
          </a>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

          {/* Personalize Feed / Category Gateway Button */}
          {onOpenGateway && (
            <button
              onClick={onOpenGateway}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['Outfit'] font-bold text-slate-200 hover:text-white bg-[#131b2e] hover:bg-[#1E293B] border border-orange-500/30 hover:border-orange-500/60 transition active:scale-95 cursor-pointer shadow-xs"
              title="Personalize Feed Categories"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Personalize Feed</span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            id="nav-wishlist-btn"
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-300 hover:text-orange-400 hover:bg-white/5 rounded-xl border border-white/8 transition shrink-0 cursor-pointer"
            title="Saved Deals"
            aria-label="View Saved Deals"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-md flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
