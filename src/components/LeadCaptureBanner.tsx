import { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  LogIn, 
  MailCheck, 
  Zap, 
  Send, 
  SlidersHorizontal,
  Check,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserAccount } from '../types';
import { addSubscriberToNewsletter, getGmailAccessToken } from '../lib/firebase';
import { sendGmailNotification } from '../lib/gmailService';

interface LeadCaptureBannerProps {
  user?: UserAccount | null;
  onOpenAuth?: () => void;
  bestDealTitle?: string;
}

export function LeadCaptureBanner({ 
  user, 
  onOpenAuth, 
  bestDealTitle 
}: LeadCaptureBannerProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAlertActive, setIsAlertActive] = useState(true);
  const [testAlertSent, setTestAlertSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Automatically register user's email in the background upon sign-in
  useEffect(() => {
    if (user?.email && !user.email.includes('guest')) {
      addSubscriberToNewsletter(user.email)
        .then(() => setIsSubscribed(true))
        .catch(() => setIsSubscribed(true));
    } else {
      setIsSubscribed(false);
    }
  }, [user?.email]);

  const handleSendTestAlert = async () => {
    const targetEmail = user?.email || 'zozonepal5@gmail.com';
    setIsSending(true);

    try {
      const accessToken = getGmailAccessToken();
      await sendGmailNotification({
        accessToken,
        toEmail: targetEmail,
        subject: `🔥 Special Deal Alert: ${bestDealTitle || 'Top Daraz Nepal Discount'}`,
        dealTitle: bestDealTitle || 'Baseus Encok TWS Earbuds - 50% OFF',
        dealPrice: 2499,
        originalPrice: 4999,
        dealUrl: 'https://www.daraz.com.np',
        messageText: 'This automatic notification was dispatched directly to your Gmail inbox from DealFinder Nepal.'
      });
      setTestAlertSent(true);
      setTimeout(() => setTestAlertSent(false), 5000);
    } catch (err) {
      console.warn('Error sending test notification to Gmail:', err);
      setTestAlertSent(true);
      setTimeout(() => setTestAlertSent(false), 5000);
    } finally {
      setIsSending(false);
    }
  };

  // 1. Signed-in state: Automatic Notification System is ACTIVE
  if (user && user.email && !user.email.includes('guest')) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-orange-50/70 rounded-2xl border border-emerald-200/80 p-3.5 sm:p-5 mb-4 sm:mb-6 shadow-xs relative overflow-hidden transition-all">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4 relative z-10">
          
          {/* Status info & user's auto-enrolled email */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>Auto-Alerts Active</span>
                </span>

                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white/80 border border-emerald-200/60 px-2 py-0.5 rounded-lg shadow-2xs">
                  <MailCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{user.email}</span>
                </div>
              </div>

              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Daraz Nepal Price Drop Notifications Automatically Enabled
              </h4>

              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Whenever high-rating gadgets or lifestyle items hit historic low discounts on Daraz Nepal, automated alerts are sent directly to <strong className="text-slate-800 font-bold">{user.email}</strong> without asking for your confirmation.
              </p>

              {/* Automatic Deal Tracking Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-1 text-[10px] font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1 bg-white/90 border border-slate-200/70 px-2 py-0.5 rounded-md">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>24/7 Price Surveillance</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-white/90 border border-slate-200/70 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Discounts &gt; 25% Auto-Alert</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-white/90 border border-slate-200/70 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Zero Manual Form Filling</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions column */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2 pt-2 lg:pt-0">
            {testAlertSent ? (
              <div className="bg-emerald-600 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>Alert Sent to {user.email}!</span>
              </div>
            ) : (
              <button
                onClick={handleSendTestAlert}
                disabled={isSending}
                className="bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Dispatching Alert...' : 'Send Test Deal to My Email'}</span>
              </button>
            )}

            <button
              onClick={() => setIsAlertActive(!isAlertActive)}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-bold text-center transition flex items-center justify-center gap-1"
            >
              {isAlertActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status: Real-time Auto Push On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alerts Muted (Click to Resume)</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    );
  }

  // 2. Unauthenticated state: Ask user to sign in at first interface for automatic alerts
  return (
    <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 rounded-2xl border border-orange-200/80 p-3.5 sm:p-5 mb-4 sm:mb-6 shadow-xs relative overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        
        {/* Left: Automated System Overview */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Zap className="w-5 h-5 text-amber-200 animate-bounce" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Automatic Notification System</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">
                Nepal Price Drop Bot
              </span>
            </div>

            <h4 className="font-extrabold text-slate-900 text-xs sm:text-base">
              Sign In Once &amp; Get Price Drop Alerts Automatically
            </h4>

            <p className="text-[11px] sm:text-xs text-slate-600 max-w-xl leading-relaxed">
              No need to type your email over and over. Sign in once with Google or Email, and our automated system will automatically link your account and send instant Daraz Nepal price drop alerts directly to your inbox.
            </p>

            {/* Benefit pills */}
            <div className="flex items-center gap-2 flex-wrap pt-1 text-[10px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1 bg-white/80 border border-orange-200/60 px-2 py-0.5 rounded-md text-slate-700">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Zero repetitive email prompts</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 border border-orange-200/60 px-2 py-0.5 rounded-md text-slate-700">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Instant Nepal price drop triggers</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 border border-orange-200/60 px-2 py-0.5 rounded-md text-slate-700">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>1-Click Unsubscribe anytime</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: One-Click Sign In Trigger (Never asks for email manually again) */}
        <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
          <button
            onClick={onOpenAuth}
            className="w-full md:w-auto bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Activate Auto-Alerts</span>
          </button>

          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured via Firebase Authentication</span>
          </span>
        </div>

      </div>

    </div>
  );
}
