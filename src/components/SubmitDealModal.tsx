import { useState, type FormEvent } from 'react';
import { X, Send, Sparkles, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { addProductToFirestore } from '../lib/firebase';
import { ProductDeal, UserAccount } from '../types';
import { extractProductFromUrl } from '../utils/productExtractor';
import { extractAllImages } from '../utils/productImages';

interface SubmitDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
}

const ALLOWED_CATEGORIES = [
  'Tech & Accessories',
  'Tools & Hardware',
  'Home Appliances',
  'Mobile Gear',
  'Gaming & PC',
  'Smart Home & Audio',
  'Outdoor & EDC',
  'Automotive Tech'
];

export function SubmitDealModal({
  isOpen,
  onClose,
  user,
  onOpenAuth
}: SubmitDealModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech & Accessories');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto Extractor state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractMsg, setExtractMsg] = useState('');

  if (!isOpen) return null;

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
      const host = parsed.hostname.toLowerCase();
      return host.endsWith('daraz.com.np') || host.endsWith('daraz.np') || host.includes('daraz');
    } catch {
      return false;
    }
  };

  const handleAutoExtract = async () => {
    setErrorMsg('');
    if (!affiliateUrl || !affiliateUrl.trim().startsWith('http')) {
      setErrorMsg('Please enter a valid product link starting with https://');
      return;
    }

    setIsExtracting(true);
    setExtractMsg('Extracting product details...');

    try {
      const data = await extractProductFromUrl(affiliateUrl.trim());
      setTitle(data.title || '');
      if (data.category && ALLOWED_CATEGORIES.includes(data.category)) {
        setCategory(data.category);
      }
      setPrice(data.price ? data.price.toString() : '');
      setImage(data.image || '');
      setDescription(data.description || '');
      setExtractMsg('Product details successfully loaded.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not fetch product details automatically. You can fill them in manually below.');
      setExtractMsg('');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      onOpenAuth();
      return;
    }

    const cleanPrice = Number(price);
    if (isNaN(cleanPrice) || cleanPrice <= 0 || cleanPrice > 2000000) {
      setErrorMsg('Please enter a valid price between Rs. 1 and Rs. 2,000,000.');
      return;
    }

    if (!affiliateUrl.trim()) {
      setErrorMsg('Please provide the Daraz product URL.');
      return;
    }

    setSubmitting(true);
    try {
      const allExtractedImages = extractAllImages({ image: image.trim() });
      const primaryImage = allExtractedImages[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';

      const deal: Omit<ProductDeal, 'id'> = {
        title: title.trim(),
        category: category.trim(),
        price: cleanPrice,
        image: primaryImage,
        imageUrl: primaryImage,
        images: allExtractedImages,
        gallery: allExtractedImages,
        affiliateUrl: affiliateUrl.trim(),
        description: description.trim(),
        badge: 'Community Verified',
        rating: 4.8,
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
        setImage('');
        setAffiliateUrl('');
        setDescription('');
        setExtractMsg('');
        setErrorMsg('');
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not submit deal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 font-['Hanken_Grotesk']">
      <div className="bg-[#0B132B] text-[#dae2fd] rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-white/10 p-5 sm:p-6 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none duration-200">
        
        {/* Mobile drag handle */}
        <div className="w-12 h-1 bg-white/20 rounded-sm mx-auto mb-2 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-10 font-['Outfit']">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#131b2e] border border-white/10 p-1 flex items-center justify-center shadow-xs shrink-0">
              <img src="/logo.png" alt="Daraz Deals" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-none">
                Submit a Daraz Deal
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Share verified bargains with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-3 bg-red-500/15 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-300 text-xs font-['Outfit']">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-2 font-['Outfit']">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-base">Deal Submitted Successfully!</h4>
            <p className="text-xs text-slate-400">Your deal is live on the cloud feed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 font-['Outfit']">
            {/* Quick Link Extractor Box */}
            <div className="bg-[#131b2e] border border-orange-500/30 p-3 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-orange-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span>Paste Product Link for Auto-Fill</span>
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="https://s.daraz.com.np/s/..."
                  className="flex-1 px-3 py-2 border border-white/10 rounded-lg text-xs bg-[#0B132B] text-white placeholder-slate-500 focus:border-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAutoExtract}
                  disabled={isExtracting || !affiliateUrl.trim()}
                  className="px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1 shrink-0 disabled:opacity-50 cursor-pointer"
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
                <p className="text-[10px] text-emerald-400 font-semibold">{extractMsg}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ultima Atom 192 True Wireless Earbuds"
                className="w-full px-3 py-2 bg-[#131b2e] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#131b2e] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-orange-500"
                >
                  {ALLOWED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0B132B] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Price (NPR) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1899"
                  className="w-full px-3 py-2 bg-[#131b2e] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Product Image URL(s)</span>
                <span className="text-[10px] text-slate-500 font-normal">Single URL or multiple (comma separated)</span>
              </label>
              <textarea
                rows={2}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-[#131b2e] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Why is this a great deal?</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Huge discount, lowest price in 6 months, verified seller..."
                className="w-full px-3 py-2 bg-[#131b2e] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 resize-none"
              />
            </div>

            {!user && (
              <p className="text-[11px] text-amber-300 bg-amber-500/15 border border-amber-500/30 p-2.5 rounded-xl">
                * You need to sign in to submit a deal to the live community feed.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 hover:brightness-105 cursor-pointer shadow-md shadow-orange-500/20"
            >
              <Send className="w-3.5 h-3.5 text-slate-950" />
              <span>{submitting ? 'Submitting...' : 'Submit Deal to Catalog'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
