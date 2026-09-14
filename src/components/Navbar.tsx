import { ShoppingBag, ShieldCheck, Heart, User as UserIcon, LogOut, Flame, Wifi, RefreshCw } from 'lucide-react';
import { UserAccount, CloudSyncStatus } from '../types';

interface NavbarProps {
  user: UserAccount | null;
  syncStatus: CloudSyncStatus;
  wishlistCount: number;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenWishlist: () => void;
  onOpenSubmitDeal: () => void;
  onLogout: () => void;
}

export function Navbar({
  user,
  syncStatus,
  wishlistCount,
  onOpenAuth,
  onOpenAdmin,
  onOpenWishlist,
  onOpenSubmitDeal,
  onLogout
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-lg tracking-tight text-slate-900 leading-none">
                <span>DealFinder</span>
                <span className="text-orange-600">NP</span>
                <span className="text-[10px] uppercase font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded tracking-wide">
                  Daraz
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Nepal Tech & Lifestyle Deals
              </p>
            </div>
          </a>

          {/* Cloud Sync Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-slate-50 border-slate-200 text-slate-600">
            {syncStatus === 'connected' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-700 font-medium">Real-time Firestore</span>
              </>
            ) : syncStatus === 'connecting' ? (
              <>
                <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
                <span className="text-amber-700 font-medium">Connecting...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-slate-600 font-medium">Local Cache Mode</span>
              </>
            )}
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Recommend a Deal button */}
          <button
            id="nav-submit-deal-btn"
            onClick={onOpenSubmitDeal}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Suggest Deal</span>
          </button>

          {/* Wishlist Button */}
          <button
            id="nav-wishlist-btn"
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-700 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition"
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
            <div className="flex items-center gap-2">
              {/* Show Admin Panel button if signed in as fitoorbhandari38@gmail.com or admin */}
              {(user.role === 'admin' || user.email?.toLowerCase() === 'fitoorbhandari38@gmail.com') && (
                <button
                  id="nav-admin-panel-btn"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer"
                  title="Open Admin Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs border border-orange-200 overflow-hidden">
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
                    {(user.role === 'admin' || user.email?.toLowerCase() === 'fitoorbhandari38@gmail.com') && (
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
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-signin-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
