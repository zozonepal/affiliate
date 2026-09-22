import { ShoppingBag, ShieldCheck, Heart, User as UserIcon, LogOut, Flame, Wifi, RefreshCw } from 'lucide-react';
import { UserAccount, CloudSyncStatus, ProductDeal } from '../types';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  user: UserAccount | null;
  syncStatus: CloudSyncStatus;
  wishlistCount: number;
  deals?: ProductDeal[];
  onQuickView?: (product: ProductDeal) => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenWishlist: () => void;
  onLogout: () => void;
}

export function Navbar({
  user,
  syncStatus,
  wishlistCount,
  deals = [],
  onQuickView = () => {},
  onOpenAuth,
  onOpenAdmin,
  onOpenWishlist,
  onLogout
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all shrink-0 overflow-hidden">
              <img src="/logo.svg" alt="DealFinder Nepal" className="w-full h-full object-contain" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5 font-black text-sm sm:text-lg tracking-tight text-slate-900 leading-none whitespace-nowrap">
                <span>DealFinder</span>
                <span className="text-orange-600">NP</span>
                <span className="hidden sm:inline-block text-[9px] sm:text-[10px] uppercase font-bold bg-orange-100 text-orange-700 px-1 sm:px-1.5 py-0.5 rounded tracking-wide shrink-0">
                  Daraz
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium leading-none mt-0.5 truncate">
                Finder Nepal Deals & Catalog
              </p>
            </div>
          </a>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Notification Center (Auto Push Deals) */}
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
            className="relative p-2 text-slate-700 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition shrink-0"
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

          {/* User Account / Auth Section */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Show Admin Panel button if signed in as admin or authorized email */}
              {(user.role === 'admin' || user.email?.toLowerCase() === 'affiliatedaraz25@gmail.com') && (
                <button
                  id="nav-admin-panel-btn"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 px-2 sm:px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer whitespace-nowrap shrink-0"
                  title="Open Admin Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Admin Panel</span>
                  <span className="sm:hidden text-[10px]">Admin</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs border border-orange-200 overflow-hidden shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    user.displayName?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight max-w-[100px] truncate">
                      {user.displayName}
                    </p>
                    {(user.role === 'admin' || user.email?.toLowerCase() === 'affiliatedaraz25@gmail.com') && (
                      <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.2 rounded uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-[100px]">
                    {user.email || 'Guest User'}
                  </p>
                </div>
              </div>

              {/* Logout button */}
              <button
                id="nav-logout-btn"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center shrink-0">
              <button
                id="nav-signin-btn"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-orange-500/25 active:scale-95 group cursor-pointer border border-orange-500/20 whitespace-nowrap shrink-0"
              >
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shrink-0">
                  <UserIcon className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="tracking-tight font-extrabold text-white whitespace-nowrap">Sign In</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
