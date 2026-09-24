import { useState, type FormEvent } from 'react';
import { X, Send, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { addProductToFirestore } from '../lib/firebase';
import { ProductDeal, UserAccount } from '../types';

interface SubmitDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
}

export function SubmitDealModal({
  isOpen,
  onClose,
  user,
  onOpenAuth
}: SubmitDealModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Audio');
  const [price, setPrice] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [image, setImage] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto Extractor state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractMsg, setExtractMsg] = useState('');

  if (!isOpen) return null;

  const handleAutoExtract = async () => {
    if (!affiliateUrl || !affiliateUrl.trim().startsWith('http')) {
      alert('Please enter a product link starting with http:// or https://');
      return;
    }

    setIsExtracting(true);
    setExtractMsg('Extracting product details with Gemini AI...');

    try {
      const res = await fetch('/api/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: affiliateUrl.trim() }),
      });

      const result = await res.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to extract product details.');
      }

      const data = result.data;
      setTitle(data.title || '');
      setCategory(data.category || 'Audio');
      setPrice(data.price ? data.price.toString() : '');
      setPromoCode(data.promoCode || '');
      setImage(data.image || '');
      setDescription(data.description || '');
      setExtractMsg('⚡ Product details automatically loaded!');
    } catch (err: any) {
      alert('Auto extraction notice: ' + (err.message || 'Could not fetch product details'));
      setExtractMsg('');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    setSubmitting(true);
    try {
      const deal: Omit<ProductDeal, 'id'> = {
        title: title.trim(),
        category: category.trim(),
        price: Number(price),
        promoCode: promoCode.trim() ? promoCode.trim().toUpperCase() : undefined,
        image: image.trim() || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
        affiliateUrl: affiliateUrl.trim(),
        description: description.trim(),
        badge: 'Community Submitted',
        rating: 4.5,
        reviewsCount: 1,
        upvotes: 1,
        upvotedBy: [user.uid],
        inStock: true,
        seller: user.displayName || 'Community Member'
      };

      await addProductToFirestore(deal);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setTitle('');
        setPrice('');
        setPromoCode('');
        setImage('');
        setAffiliateUrl('');
        setDescription('');
        setExtractMsg('');
      }, 2000);
    } catch (err: any) {
      alert('Error submitting deal: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-5 sm:p-6 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none duration-200">
        
        {/* Mobile drag handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-2 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-2xs shrink-0">
              <img src="/logo.png" alt="Finder Nepal" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-none">
                Recommend a Daraz Deal
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Share budget tech with the Nepal community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">Deal Submitted Successfully!</h4>
            <p className="text-xs text-slate-500">Your deal has been sent to the live cloud database.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Quick Link Extractor Box */}
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl space-y-2">
              <label className="block text-xs font-extrabold text-orange-950 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                  <span>Paste Product Link for Auto-Fill</span>
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="https://s.daraz.com.np/s/... or Amazon URL"
                  className="flex-1 px-3 py-1.5 border border-orange-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAutoExtract}
                  disabled={isExtracting || !affiliateUrl.trim()}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 shrink-0 disabled:opacity-50"
                >
                  {isExtracting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Auto Load</span>
                </button>
              </div>
              {extractMsg && (
                <p className="text-[10px] text-orange-800 font-semibold">{extractMsg}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fantech Captain 7.1 Gaming Headset"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="Audio">Audio</option>
                  <option value="Keyboards & Mice">Keyboards & Mice</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Mobile Accessories">Mobile Accessories</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (NPR) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2499"
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Promo / Coupon Code</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. DARAZ500, NEPAL10"
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 uppercase font-mono font-semibold text-orange-600 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://sg-test-11.slatic.net/p/..."
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Why is this a great deal?</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Huge discount, lowest price in 6 months, verified seller..."
                className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {!user && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                * You need to sign in to submit a deal.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Deal to Catalog'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
