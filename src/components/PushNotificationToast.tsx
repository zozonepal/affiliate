import { useState, useEffect } from 'react';
import { Bell, Flame, X, ShoppingBag, ExternalLink, Sparkles } from 'lucide-react';
import { ProductDeal, UserAccount } from '../types';

interface PushNotificationToastProps {
  user: UserAccount | null;
  latestDeal: ProductDeal | null;
  onQuickView: (product: ProductDeal) => void;
}

export function PushNotificationToast({
  user,
  latestDeal,
  onQuickView
}: PushNotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownForUser, setHasShownForUser] = useState<string | null>(null);

  // Trigger automatic push notification when user signs in (like Facebook/mobile apps)
  useEffect(() => {
    if (!user || !latestDeal) return;

    const userKey = `${user.uid || user.email}_${latestDeal.id}`;
    if (hasShownForUser === userKey) return;

    // Small natural delay like native mobile push notifications
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasShownForUser(userKey);

      // Trigger native browser notification if supported and permitted
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            new Notification('🔥 DealFinder Nepal: New Price Drop!', {
              body: `${latestDeal.title} dropped to Rs. ${latestDeal.price.toLocaleString('ne-NP')}!`,
              icon: latestDeal.image
            });
          } catch (e) {
            console.log('Native push notification error', e);
          }
        } else if (Notification.permission === 'default') {
          // Automatically request permission without disruptive modal
          try {
            Notification.requestPermission().then((perm) => {
              if (perm === 'granted') {
                new Notification('DealFinder Nepal Alert', {
                  body: `Auto-alerts enabled for ${user.email}. Top Nepal deals will be pushed here.`,
                });
              }
            });
          } catch {}
        }
      }

      // Play soft notification beep or vibrate if available
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch {}
    }, 1200);

    return () => clearTimeout(timer);
  }, [user, latestDeal, hasShownForUser]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!isVisible) return;
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 8500);
    return () => clearTimeout(hideTimer);
  }, [isVisible]);

  if (!isVisible || !latestDeal) return null;

  const originalPriceNum = latestDeal.originalPrice || Math.round(latestDeal.price * 1.4);
  const discountPercent = Math.round(((originalPriceNum - latestDeal.price) / originalPriceNum) * 100);

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 max-w-sm w-[calc(100vw-1.5rem)] sm:w-96 animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-orange-500/30 flex flex-col gap-2.5">
        
        {/* Header ticker row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <div className="w-5 h-5 rounded-md bg-orange-600 flex items-center justify-center text-white">
              <Bell className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
              Auto Deal Push Alert
            </span>
            <span className="text-white/40 text-[10px]">• Just now</span>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product deal payload */}
        <div 
          onClick={() => {
            onQuickView(latestDeal);
            setIsVisible(false);
          }}
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/5 transition cursor-pointer group"
        >
          <div className="w-14 h-14 bg-white/10 rounded-lg p-1 shrink-0 flex items-center justify-center relative">
            <img 
              src={latestDeal.image} 
              alt={latestDeal.title} 
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80';
              }}
            />
            {discountPercent > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[8px] px-1 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold">
              <Flame className="w-2.5 h-2.5 fill-amber-300" />
              <span>Price Dropped for {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'You'}</span>
            </div>
            <h5 className="text-xs font-bold text-white truncate group-hover:text-orange-300 transition">
              {latestDeal.title}
            </h5>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[10px] font-bold text-orange-400">Rs.</span>
              <span className="text-sm font-black text-white">
                {Number(latestDeal.price).toLocaleString('ne-NP')}
              </span>
              <span className="text-[10px] text-slate-400 line-through ml-1">
                Rs. {Number(originalPriceNum).toLocaleString('ne-NP')}
              </span>
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[10px] text-slate-400 truncate">
            Auto-dispatched to <strong className="text-slate-200">{user?.email}</strong>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                onQuickView(latestDeal);
                setIsVisible(false);
              }}
              className="text-[11px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-md transition"
            >
              Specs
            </button>
            <a
              href={latestDeal.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsVisible(false)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition"
            >
              <span>Daraz</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
