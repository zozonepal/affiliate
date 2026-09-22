import { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageCircle, 
  Facebook, 
  Send,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ProductDeal } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDeal | null;
}

export function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !product) return null;

  const originalPriceNum = product.originalPrice || Math.round(product.price * 1.35);
  const discountPercent = originalPriceNum > product.price 
    ? Math.round(((originalPriceNum - product.price) / originalPriceNum) * 100) 
    : 0;

  // Generate shareable URL (app base + deal ID)
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const shareUrl = `${currentOrigin}${currentPath}?deal=${product.id}`;

  // Pre-filled message text crafted for high conversion and context
  const shareMessage = `🔥 Deal Alert! ${product.title} is now Rs. ${Number(product.price).toLocaleString('ne-NP')}${
    discountPercent > 0 ? ` (${discountPercent}% OFF!)` : ''
  } on Daraz Nepal.${product.promoCode ? ` Use promo code: ${product.promoCode}` : ''} Check deal: ${shareUrl}`;

  // Pre-filled WhatsApp link
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  // Pre-filled Facebook share link
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyFullMessage = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `🔥 ${product.title} is now Rs. ${Number(product.price).toLocaleString('ne-NP')}!`,
          url: shareUrl,
        });
        onClose();
      } catch (e) {
        console.log('Native share canceled/failed', e);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Share This Deal</h3>
              <p className="text-[11px] text-slate-500">Send pre-filled link to your friends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product mini banner */}
        <div className="p-4 sm:p-5 pb-0">
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-14 h-14 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center border border-slate-200/60">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-black text-slate-900">
                  Rs. {Number(product.price).toLocaleString('ne-NP')}
                </span>
                {discountPercent > 0 && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="p-4 sm:p-5 space-y-3">
          
          <div className="grid grid-cols-2 gap-2.5">
            {/* WhatsApp Pre-filled Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl shadow-xs transition active:scale-95 text-center"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>

            {/* Facebook Pre-filled Button */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl shadow-xs transition active:scale-95 text-center"
            >
              <Facebook className="w-4 h-4 fill-white" />
              <span>Facebook</span>
            </a>
          </div>

          {/* Native Share button if supported */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition active:scale-98"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>More Share Options (Apps, SMS, Messenger)</span>
            </button>
          )}

          {/* Copyable Link Input */}
          <div className="pt-2">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Direct Link:
            </label>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1.5 pl-3">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-slate-700 w-full outline-none truncate font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-orange-600 hover:bg-orange-500 text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pre-filled Message Preview with Copy text */}
          <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wide">
                Pre-filled Message Text:
              </span>
              <button
                onClick={handleCopyFullMessage}
                className="text-[10px] text-orange-600 font-bold hover:underline flex items-center gap-0.5"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-600 italic leading-relaxed line-clamp-2">
              "{shareMessage}"
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
