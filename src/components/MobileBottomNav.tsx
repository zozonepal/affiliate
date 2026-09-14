import { Home, Heart, PlusCircle, ShieldCheck, User } from 'lucide-react';
import { UserAccount } from '../types';

interface MobileBottomNavProps {
  user: UserAccount | null;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export function MobileBottomNav({
  user,
  wishlistCount,
  onOpenWishlist,
  onOpenAuth,
  onOpenAdmin
}: MobileBottomNavProps) {
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'fitoorbhandari38@gmail.com';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Explore / Home */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition"
          aria-label="Explore Deals"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Explore</span>
        </button>

        {/* Wishlist / Saved */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition"
          aria-label="View Saved Deals"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-orange-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Saved</span>
        </button>

        {/* Admin or Profile */}
        {isAdmin ? (
          <button
            onClick={onOpenAdmin}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-amber-700 hover:text-amber-900 active:scale-95 transition"
            aria-label="Admin Panel"
          >
            <div className="relative">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            </div>
            <span className="text-[10px] font-black mt-0.5 text-orange-600">Admin</span>
          </button>
        ) : user ? (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition"
            aria-label="Account Profile"
          >
            <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-black text-[10px] flex items-center justify-center border border-orange-200 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                user.displayName?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5 truncate max-w-[52px]">
              {user.displayName?.split(' ')[0] || 'Account'}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition"
            aria-label="Sign In"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
