import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { 
  X, 
  PlusCircle, 
  Save, 
  Trash2, 
  Pencil, 
  Layers, 
  TrendingUp, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  Search,
  Tag,
  Ticket,
  Upload,
  Image as ImageIcon,
  Palette,
  Check
} from 'lucide-react';
import { ProductDeal, CloudSyncStatus, ColorVariant } from '../types';
import { 
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore, 
  seedInitialDealsToFirestore,
  clearAllPreProducts,
  deleteAllProductsFromCatalog
} from '../lib/firebase';
import { compressImage, estimatePayloadBytes, formatBytes } from '../utils/imageCompressor';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductDeal[];
  syncStatus: CloudSyncStatus;
  initialEditProduct?: ProductDeal | null;
  onLogoutAdmin: () => void;
}

const PRODUCT_IMAGE_PRESETS = [
  { name: 'Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80' },
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { name: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
  { name: 'Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80' },
  { name: 'Mouse', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80' },
  { name: 'Powerbank', url: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80' },
  { name: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
  { name: 'Speaker', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80' },
];

export function AdminModal({
  isOpen,
  onClose,
  products,
  syncStatus,
  initialEditProduct,
  onLogoutAdmin
}: AdminModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [badge, setBadge] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [image, setImage] = useState('');
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);

  const COMMON_COLOR_PRESETS = [
    { name: 'Black', hex: '#18181b' },
    { name: 'White', hex: '#f8fafc' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Navy', hex: '#1e3a8a' },
    { name: 'Red', hex: '#dc2626' },
    { name: 'Green', hex: '#16a34a' },
    { name: 'Gold', hex: '#eab308' },
    { name: 'Silver / Grey', hex: '#94a3b8' },
    { name: 'Pink', hex: '#f472b6' },
    { name: 'Purple', hex: '#9333ea' }
  ];

  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleMultipleImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name)) {
        validFiles.push(file);
      }
    }
    if (validFiles.length === 0) return;

    setIsOptimizing(true);
    setMessage({
      type: 'success',
      text: `Optimizing and compressing ${validFiles.length} photo${validFiles.length > 1 ? 's' : ''} for Firestore cloud storage...`
    });

    try {
      const newItems: ColorVariant[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        // Compresses camera/phone photos to ~25KB - 50KB WebP/JPEG, well within Firestore's 1MB limit
        const compressed = await compressImage(file, {
          maxWidth: 850,
          maxHeight: 850,
          quality: 0.75,
          format: 'image/webp'
        });

        const cleanName = file.name.toLowerCase();
        const matched = COMMON_COLOR_PRESETS.find((p) => cleanName.includes(p.name.toLowerCase()));

        let initialName = 'Default';
        let initialHex = '#18181b';
        if (matched) {
          initialName = matched.name;
          initialHex = matched.hex;
        } else {
          const offset = colorVariants.length + newItems.length;
          if (offset < COMMON_COLOR_PRESETS.length) {
            initialName = COMMON_COLOR_PRESETS[offset].name;
            initialHex = COMMON_COLOR_PRESETS[offset].hex;
          } else {
            initialName = `Color ${offset + 1}`;
            initialHex = '#18181b';
          }
        }

        newItems.push({
          name: initialName,
          colorCode: initialHex,
          image: compressed.dataUrl
        });
      }

      setColorVariants((prev) => {
        const updated = [...prev, ...newItems];
        if (!image && updated.length > 0) {
          setImage(updated[0].image);
        }
        return updated;
      });

      setMessage({
        type: 'success',
        text: `Uploaded and optimized ${newItems.length} photo${newItems.length > 1 ? 's' : ''}! Cloud storage optimized.`
      });
    } catch (err: any) {
      console.error('Image compression error:', err);
      setMessage({ type: 'error', text: 'Error compressing images: ' + (err.message || 'Unknown error') });
    } finally {
      setIsOptimizing(false);
      e.target.value = '';
    }
  };

  const handleUpdateVariant = (index: number, updates: Partial<ColorVariant>) => {
    setColorVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...updates } : v)));
  };

  const handleRemoveVariant = (index: number) => {
    setColorVariants((prev) => {
      const toRemove = prev[index];
      const updated = prev.filter((_, i) => i !== index);
      if (image === toRemove?.image) {
        setImage(updated.length > 0 ? updated[0].image : '');
      }
      return updated;
    });
  };

  const handleSetAsCover = (imgUrl: string) => {
    setImage(imgUrl);
    setMessage({ type: 'success', text: 'Set as primary cover image!' });
  };
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterQuery, setFilterQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialEditProduct) {
      loadProductForEdit(initialEditProduct);
    }
  }, [initialEditProduct]);

  if (!isOpen) return null;

  const loadProductForEdit = (p: ProductDeal) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setCategory(p.category || '');
    setPrice(p.price?.toString() || '');
    setOriginalPrice(p.originalPrice?.toString() || '');
    setBadge(p.badge || '');
    setPromoCode(p.promoCode || '');
    setImage(p.image || '');
    if (p.colorVariants && p.colorVariants.length > 0) {
      setColorVariants([...p.colorVariants]);
    } else if (p.image) {
      setColorVariants([{ name: 'Default', colorCode: '#18181b', image: p.image }]);
    } else {
      setColorVariants([]);
    }
    setAffiliateUrl(p.affiliateUrl || '');
    setDescription(p.description || '');
    setMessage(null);
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setPrice('');
    setOriginalPrice('');
    setBadge('');
    setPromoCode('');
    setImage('');
    setColorVariants([]);
    setAffiliateUrl('');
    setDescription('');
    setMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const primaryImg = image || (colorVariants.length > 0 ? colorVariants[0].image : '');
    if (!primaryImg) {
      setMessage({ type: 'error', text: 'Please upload a primary image or add at least one color variant with an image.' });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);

    let currentVariants = [...colorVariants];
    let currentPrimaryImg = primaryImg;

    const dealPayload: Omit<ProductDeal, 'id'> = {
      title: title.trim(),
      category: category.trim() || 'Tech',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      badge: badge.trim() || undefined,
      promoCode: promoCode.trim() ? promoCode.trim().toUpperCase() : undefined,
      image: currentPrimaryImg.trim(),
      colorVariants: currentVariants.length > 0 ? currentVariants : undefined,
      affiliateUrl: affiliateUrl.trim() || 'https://www.daraz.com.np',
      description: description.trim(),
      rating: 4.8,
      reviewsCount: 25,
      upvotes: 0,
      upvotedBy: [],
      inStock: true,
      seller: 'Daraz Nepal Store'
    };

    // Pre-flight check payload size to prevent Firestore 1MB document rejection
    const estBytes = estimatePayloadBytes(dealPayload);

    // If approaching 800KB limit, run secondary compression pass
    if (estBytes > 800 * 1024) {
      try {
        setMessage({ type: 'success', text: 'Running secondary compression to ensure Firestore document remains safely under 1MB...' });
        const recompressedVariants = await Promise.all(
          currentVariants.map(async (v) => {
            if (v.image.startsWith('data:image')) {
              const res = await compressImage(v.image, { maxWidth: 650, maxHeight: 650, quality: 0.65 });
              return { ...v, image: res.dataUrl };
            }
            return v;
          })
        );
        let recompressedPrimary = currentPrimaryImg;
        if (currentPrimaryImg.startsWith('data:image')) {
          const res = await compressImage(currentPrimaryImg, { maxWidth: 650, maxHeight: 650, quality: 0.65 });
          recompressedPrimary = res.dataUrl;
        }
        dealPayload.image = recompressedPrimary;
        dealPayload.colorVariants = recompressedVariants.length > 0 ? recompressedVariants : undefined;
        setColorVariants(recompressedVariants);
        setImage(recompressedPrimary);
      } catch (compErr) {
        console.warn('Payload optimization warning:', compErr);
      }
    }

    try {
      if (editingId) {
        await updateProductInFirestore(editingId, dealPayload);
        setMessage({ type: 'success', text: 'Deal updated in Firestore successfully!' });
      } else {
        await addProductToFirestore(dealPayload);
        setMessage({ type: 'success', text: 'New deal published to Firestore database!' });
      }
      handleResetForm();
    } catch (err: any) {
      console.error('Firestore save error:', err);
      const errMsg = err?.message || 'Check connection';
      if (errMsg.includes('exceeds the maximum allowed size') || errMsg.includes('1,048,576 bytes')) {
        setMessage({
          type: 'error',
          text: 'Upload exceeded Firestore 1MB document limit. Try removing extra photos or uploading again with automatic optimization.'
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to save to Firestore: ' + errMsg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, dealTitle: string) => {
    if (!window.confirm(`Delete "${dealTitle}" permanently from the database?`)) return;
    try {
      await deleteProductFromFirestore(id);
      setMessage({ type: 'success', text: `"${dealTitle}" removed successfully.` });
      if (editingId === id) handleResetForm();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to delete: ' + err.message });
    }
  };

  const handleClearPreProducts = () => {
    if (!window.confirm('Delete all pre-products from the website? This clears out the initial placeholder products so you can insert your new products.')) return;
    clearAllPreProducts();
    setMessage({ type: 'success', text: 'All pre-products deleted! The catalog is now clear for your new products.' });
    handleResetForm();
  };

  const handleSeedDeals = async () => {
    if (!window.confirm('Populate Firestore with verified top Nepal tech & lifestyle deals?')) return;
    setIsSeeding(true);
    setMessage(null);
    try {
      await seedInitialDealsToFirestore();
      setMessage({ type: 'success', text: 'Successfully seeded verified Nepali deals to Firestore!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Seeding error: ' + err.message });
    } finally {
      setIsSeeding(false);
    }
  };

  // Metrics calculation
  const totalDeals = products.length;
  const categoriesCount = new Set(products.map(p => p.category).filter(Boolean)).size;
  const totalUpvotes = products.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);
  const avgPrice = totalDeals > 0 ? Math.round(products.reduce((acc, curr) => acc + curr.price, 0) / totalDeals) : 0;

  const filteredList = products.filter(p => {
    const q = filterQuery.toLowerCase();
    return (p.title && p.title.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q));
  });

  const currentEstBytes = estimatePayloadBytes({
    title,
    category,
    price,
    originalPrice,
    badge,
    promoCode,
    image,
    colorVariants,
    affiliateUrl,
    description
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden w-full max-w-full">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto overflow-x-hidden shadow-2xl border border-slate-100 p-3.5 sm:p-7 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none duration-200 box-border">
        
        {/* Mobile drag handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2.5 sm:hidden shrink-0" />

        {/* Top Header */}
        <div className="flex flex-col gap-2.5 pb-3.5 mb-3.5 border-b border-slate-100 w-full min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                <img src="/logo.png" alt="Finder Nepal" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-lg font-extrabold text-slate-900 leading-tight truncate">
                  Finder Nepal Admin Dashboard
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                  Live Firestore real-time database management & catalog
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-start sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={handleClearPreProducts}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition min-h-[32px] border border-red-200/60 shrink-0"
              title="Delete all pre-products / sample items so you can start clean with your own products"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Pre-Deals</span>
            </button>

            <button
              onClick={handleSeedDeals}
              disabled={isSeeding}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition disabled:opacity-50 min-h-[32px] border border-orange-200/60 shrink-0"
              title="Restore sample Nepal deals into Firestore"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Seeding...' : 'Seed Sample Deals'}</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="text-xs font-bold text-slate-600 hover:text-red-700 px-2 py-1.5 rounded hover:bg-red-50 transition min-h-[32px] flex items-center border border-slate-200/60 shrink-0"
            >
              Exit Admin
            </button>
          </div>
        </div>

        {/* Real-time Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 w-full min-w-0">
          <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 min-w-0">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block mb-0.5 truncate">Total Deals</span>
            <p className="text-lg sm:text-2xl font-black text-slate-900 truncate">{totalDeals}</p>
          </div>

          <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 min-w-0">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block mb-0.5 truncate">Active Categories</span>
            <p className="text-lg sm:text-2xl font-black text-slate-900 truncate">{categoriesCount}</p>
          </div>

          <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 min-w-0">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block mb-0.5 truncate">Total Upvotes</span>
            <p className="text-lg sm:text-2xl font-black text-slate-900 truncate">{totalUpvotes}</p>
          </div>

          <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 min-w-0">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block mb-0.5 truncate">Cloud Sync Status</span>
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${syncStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 capitalize truncate">
                {syncStatus === 'connected' ? 'Live Connected' : syncStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Alert Feedback Banner */}
        {message && (
          <div className={`p-3 rounded-xl text-xs font-semibold mb-4 flex items-start gap-2 max-w-full overflow-hidden w-full min-w-0 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            )}
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="break-all break-words leading-relaxed">{message.text}</p>
            </div>
          </div>
        )}

        {/* Add / Edit Form */}
        <form onSubmit={handleSubmit} className="bg-slate-50/80 border border-slate-200/80 p-3 sm:p-5 rounded-2xl mb-5 space-y-3.5 w-full min-w-0 box-border">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              {editingId ? <Pencil className="w-4 h-4 text-orange-600" /> : <PlusCircle className="w-4 h-4 text-orange-600" />}
              <span>{editingId ? 'Edit Product Deal' : 'Add New Affiliate Deal'}</span>
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ultima Atom 192 Earbuds"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none box-border"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Audio, Keyboards & Mice, Wearables, etc."
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none box-border"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 mb-1">Deal Price in NPR *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1899"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none box-border"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 mb-1">Original Price in NPR (Optional)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="2999"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none box-border"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tag (Optional)</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best Value Under 2k, Flash Deal"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none box-border"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between gap-1">
                <span className="flex items-center gap-1 truncate">
                  <Ticket className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="truncate">Promo Code (Optional)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal shrink-0">e.g. DARAZ500</span>
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. DARAZ500, NEPAL10"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none uppercase font-mono font-bold text-orange-700 placeholder-slate-400 box-border"
              />
            </div>

            <div className="md:col-span-2 space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <label className="block text-xs font-bold text-slate-800">
                  Product Images by Color (Upload Photos) *
                </label>
                {colorVariants.length > 0 && (
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 rounded-full shrink-0">
                    {colorVariants.length} {colorVariants.length === 1 ? 'Color Image' : 'Color Images'}
                  </span>
                )}
              </div>

              {/* Upload Dropzone / Button */}
              {isOptimizing ? (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-orange-300 bg-orange-50/50 rounded-2xl text-center">
                  <RefreshCw className="w-6 h-6 text-orange-600 animate-spin mb-2" />
                  <span className="text-xs font-bold text-orange-900">Optimizing & Compressing Photos...</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Auto-shrinking to WebP for instant Firestore cloud sync</span>
                </div>
              ) : colorVariants.length === 0 ? (
                <label className="flex flex-col items-center justify-center p-5 sm:p-6 border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50 rounded-2xl cursor-pointer transition text-center group w-full box-border">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100 group-hover:bg-orange-200 text-orange-600 flex items-center justify-center mb-2 transition shadow-2xs shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-orange-600">
                    Upload Multiple Photos from Device
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 max-w-sm px-2">
                    Select 1 or multiple photos (PNG, JPG, WEBP). Photos are automatically compressed to safely fit inside Firestore's 1MB limit.
                  </span>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-lg">
                      Choose Multiple Photos
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleImagesUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-3 min-w-0">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex-wrap">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-2xs shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Upload More Color Images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleImagesUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setColorVariants([]);
                        setImage('');
                      }}
                      className="text-xs text-slate-400 hover:text-red-600 transition font-semibold"
                    >
                      Remove All Images
                    </button>
                  </div>

                  {/* List of Uploaded Color Images */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {colorVariants.map((variant, idx) => {
                      const isCover = (image ? image === variant.image : idx === 0);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border bg-white shadow-2xs transition-all space-y-2.5 min-w-0 ${
                            isCover ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'
                          }`}
                        >
                          {/* Image preview & cover toggle */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                              <img
                                src={variant.image}
                                alt={variant.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80';
                                }}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                {isCover ? (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 truncate">
                                    <Check className="w-3 h-3 shrink-0" /> Cover
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsCover(variant.image)}
                                    className="text-[10px] font-bold text-orange-600 hover:text-orange-800 hover:underline truncate"
                                  >
                                    Set as Primary
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariant(idx)}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition shrink-0"
                                  title="Remove this image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Color Name & Swatch */}
                              <div className="flex items-center gap-1.5 mt-2 min-w-0">
                                <div className="relative flex items-center shrink-0">
                                  <input
                                    type="color"
                                    value={variant.colorCode || '#18181b'}
                                    onChange={(e) => handleUpdateVariant(idx, { colorCode: e.target.value })}
                                    className="w-7 h-7 p-0.5 rounded-lg border border-slate-300 cursor-pointer bg-white"
                                    title="Pick swatch color"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={variant.name}
                                  onChange={(e) => handleUpdateVariant(idx, { name: e.target.value })}
                                  placeholder="e.g. Black"
                                  className="flex-1 min-w-0 px-2 py-1 text-xs font-bold text-slate-800 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none box-border"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Quick Color Presets */}
                          <div className="pt-1.5 border-t border-slate-100 min-w-0">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1 truncate">
                              Quick Color Preset:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {COMMON_COLOR_PRESETS.map((preset) => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => handleUpdateVariant(idx, { name: preset.name, colorCode: preset.hex })}
                                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border flex items-center gap-1 transition ${
                                    variant.name.toLowerCase() === preset.name.toLowerCase()
                                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full border border-slate-300 shrink-0"
                                    style={{ backgroundColor: preset.hex }}
                                  />
                                  <span className="truncate">{preset.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <label className="block text-xs font-bold text-slate-700 mb-1">Daraz Affiliate Deep Link URL *</label>
            <input
              type="url"
              required
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://s.daraz.com.np/s/..."
              className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none box-border"
            />
          </div>

          <div className="min-w-0">
            <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description / Key Specs</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key specifications, battery life, drivers, warranty details..."
              className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none resize-none box-border"
            />
          </div>

          {/* Live Thumbnail Preview if image URL exists */}
          {image && (
            <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 min-w-0">
              <img
                src={image}
                alt="Preview"
                className="w-11 h-11 object-contain rounded bg-slate-50 border p-1 shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="text-xs min-w-0 flex-1 truncate">
                <p className="font-bold text-slate-800 truncate">{title || 'Preview Title'}</p>
                <p className="text-slate-500 truncate">Rs. {price || '0'} • {category || 'General'}</p>
              </div>
            </div>
          )}

          {/* Firestore Document Payload Size Safety Indicator */}
          <div className="flex items-center justify-between text-[11px] px-3 py-2 bg-slate-100/90 rounded-xl border border-slate-200 min-w-0">
            <span className="text-slate-600 font-semibold flex items-center gap-1.5 truncate">
              <Database className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">Firestore Doc Size:</span>
            </span>
            <span className={`font-mono font-bold shrink-0 ${
              currentEstBytes > 850 * 1024 ? 'text-red-600' : currentEstBytes > 500 * 1024 ? 'text-amber-600' : 'text-emerald-700'
            }`}>
              {formatBytes(currentEstBytes)} / 1,024 KB {currentEstBytes <= 850 * 1024 ? '✓ Safe' : '⚠️ Heavy'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting || isOptimizing}
              className="flex-1 bg-slate-900 hover:bg-black text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 min-h-[40px]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing to Cloud...</span>
                </>
              ) : editingId ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Deal in Firestore</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Deal to Firestore</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Database Items List */}
        <div className="space-y-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
              Live Database Items ({filteredList.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter items..."
                className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-orange-500 box-border"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No products match your filter.</p>
            ) : (
              filteredList.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs transition min-w-0 gap-2"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden pr-1 min-w-0 flex-1">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg bg-white border p-0.5 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="truncate min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <p className="font-bold text-slate-900 truncate">{p.title}</p>
                        {p.id.startsWith('sample-') && (
                          <span className="bg-amber-100 text-amber-800 font-bold text-[9px] px-1.5 py-0.2 rounded border border-amber-200 shrink-0">
                            Pre-Product
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap truncate">
                        <span>Rs. {Number(p.price).toLocaleString('ne-NP')}</span>
                        <span>•</span>
                        <span className="font-medium text-orange-600 truncate">{p.category}</span>
                        {p.promoCode && (
                          <>
                            <span>•</span>
                            <span className="bg-orange-100 text-orange-800 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border border-orange-200 shrink-0">
                              Code: {p.promoCode}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>Upvotes: {p.upvotes || 0}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => loadProductForEdit(p)}
                      title="Edit Deal"
                      className="p-1.5 text-slate-600 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      title="Delete Deal"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
