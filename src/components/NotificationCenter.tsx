import { useState, useRef, useEffect } from 'react';
import { Bell, Flame, Tag, Check, ExternalLink, Sparkles, X, ChevronRight } from 'lucide-react';
import { ProductDeal, UserAccount } from '../types';

interface NotificationCenterProps {
  user: UserAccount | null;
  deals: ProductDeal[];
  onQuickView: (product: ProductDeal) => void;
  onOpenAuth: () => void;
}

export function NotificationCenter({
  user,
  deals,
  onQuickView,
  onOpenAuth
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(deals.length > 0 ? 3 : 0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0);
  };

  const notificationDeals = deals.slice(0, 4);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        id="notifications-bell-btn"
        onClick={handleOpen}
        className="relative w-8 h-8 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-slate-100 border border-transparent hover:border-slate-200/60 transition shrink-0 active:scale-95 flex items-center justify-center"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4 shrink-0" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Facebook-style Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">Notifications</h3>
              <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                Auto-Push
              </span>
            </div>
            {user ? (
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Connected: {user.email?.split('@')[0]}
              </span>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAuth();
                }}
                className="text-[10px] font-bold text-orange-600 hover:underline"
              >
                Sign in to customize
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notificationDeals.map((deal, idx) => {
              const original = deal.originalPrice || Math.round(deal.price * 1.4);
              const discount = Math.round(((original - deal.price) / original) * 100);

              return (
                <div
                  key={deal.id || idx}
                  onClick={() => {
                    onQuickView(deal);
                    setIsOpen(false);
                  }}
                  className="p-3 hover:bg-orange-50/50 transition cursor-pointer flex items-start gap-3 group"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-xl p-1 shrink-0 flex items-center justify-center border border-slate-200/60 relative">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                    />
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[8px] px-1 rounded">
                      -{discount}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[10px] text-orange-600 font-bold">
                      <Flame className="w-2.5 h-2.5 fill-orange-500" />
                      <span>Instant Price Drop • {idx === 0 ? 'Just now' : `${idx * 15}m ago`}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition">
                      {deal.title}
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5 text-xs">
                      <span className="font-bold text-slate-900">
                        Rs. {Number(deal.price).toLocaleString('ne-NP')}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        Rs. {Number(original).toLocaleString('ne-NP')}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition shrink-0 self-center" />
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-500">
              ⚡ Automated 24/7 Daraz Nepal deal tracker
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
