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

  const handleMultipleImagesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: `File "${file.name}" exceeds 5MB limit and was skipped.` });
      } else {
        validFiles.push(file);
      }
    }
    if (validFiles.length === 0) return;

    let loadedCount = 0;
    const newItems: ColorVariant[] = [];

    Array.from(validFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (typeof dataUrl === 'string') {
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
            image: dataUrl
          });
          loadedCount++;

          if (loadedCount === validFiles.length) {
            setColorVariants((prev) => {
              const updated = [...prev, ...newItems];
              if (!image && updated.length > 0) {
                setImage(updated[0].image);
              }
              return updated;
            });
            setMessage({
              type: 'success',
              text: `Uploaded ${loadedCount} product image${loadedCount > 1 ? 's' : ''}! Customize their colors below.`
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
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

    const dealPayload: Omit<ProductDeal, 'id'> = {
      title: title.trim(),
      category: category.trim() || 'Tech',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      badge: badge.trim() || undefined,
      promoCode: promoCode.trim() ? promoCode.trim().toUpperCase() : undefined,
      image: primaryImg.trim(),
      colorVariants: colorVariants.length > 0 ? colorVariants : undefined,
      affiliateUrl: affiliateUrl.trim() || 'https://www.daraz.com.np',
      description: description.trim(),
      rating: 4.8,
      reviewsCount: 25,
      upvotes: 0,
      upvotedBy: [],
      inStock: true,
      seller: 'Daraz Nepal Store'
    };

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
      setMessage({ type: 'error', text: 'Failed to save to Firestore: ' + (err.message || 'Check connection') });
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-4 sm:p-7 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none duration-200">
        
        {/* Mobile drag handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">
                Firebase Cloud Admin Dashboard
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Live Firestore real-time database management & catalog
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 flex-wrap">
            <button
              onClick={handleClearPreProducts}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition min-h-[36px] border border-red-200/60"
              title="Delete all pre-products / sample items so you can start clean with your own products"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Pre-Products</span>
            </button>

            <button
              onClick={handleSeedDeals}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition disabled:opacity-50 min-h-[36px]"
              title="Restore sample Nepal deals into Firestore"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Seeding...' : 'Seed Sample Deals'}</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="text-xs font-bold text-slate-600 hover:text-red-700 px-2 py-1.5 rounded hover:bg-red-50 transition min-h-[36px] flex items-center"
            >
              Exit Admin
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Deals</span>
            <p className="text-2xl font-black text-slate-900">{totalDeals}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Active Categories</span>
            <p className="text-2xl font-black text-slate-900">{categoriesCount}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Upvotes</span>
            <p className="text-2xl font-black text-slate-900">{totalUpvotes}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cloud Sync Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-bold text-slate-800 capitalize">
                {syncStatus === 'connected' ? 'Live Connected' : syncStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Alert Feedback Banner */}
        {message && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Add / Edit Form */}
        <form onSubmit={handleSubmit} className="bg-slate-50/80 border border-slate-200/80 p-4 sm:p-5 rounded-2xl mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ultima Atom 192 Earbuds"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Audio, Keyboards & Mice, Wearables, etc."
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deal Price in NPR *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1899"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Original Price in NPR (Optional)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="2999"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tag (Optional)</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best Value Under 2k, Flash Deal"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5 text-orange-600" />
                  <span>Promo / Voucher Code (Optional)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">e.g. DARAZ500</span>
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. DARAZ500, NEPAL10"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none uppercase font-mono font-bold text-orange-700 placeholder-slate-400"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Product Images by Color (Upload File) *
                </label>
                {colorVariants.length > 0 && (
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 rounded-full">
                    {colorVariants.length} {colorVariants.length === 1 ? 'Color Image' : 'Color Images'}
                  </span>
                )}
              </div>

              {/* Upload Dropzone / Button */}
              {colorVariants.length === 0 ? (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50 rounded-2xl cursor-pointer transition text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 group-hover:bg-orange-200 text-orange-600 flex items-center justify-center mb-2 transition shadow-2xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 group-hover:text-orange-600">
                    Upload Product Images from Device
                  </span>
                  <span className="text-xs text-slate-500 mt-1 max-w-sm">
                    Select one or multiple photos according to colors (PNG, JPG, WEBP). Each image will have its own color variant!
                  </span>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-lg">
                      Choose Files from Device (Multiple Allowed)
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
                <div className="space-y-3">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-2xs">
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
                          className={`p-3 rounded-2xl border bg-white shadow-2xs transition-all space-y-2.5 ${
                            isCover ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'
                          }`}
                        >
                          {/* Image preview & cover toggle */}
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
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
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Primary Cover
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsCover(variant.image)}
                                    className="text-[10px] font-bold text-orange-600 hover:text-orange-800 hover:underline"
                                  >
                                    Set as Primary Cover
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariant(idx)}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition"
                                  title="Remove this image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Color Name & Swatch */}
                              <div className="flex items-center gap-1.5 mt-2">
                                <div className="relative flex items-center">
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
                                  className="flex-1 min-w-0 px-2 py-1 text-xs font-bold text-slate-800 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Quick Color Presets */}
                          <div className="pt-1.5 border-t border-slate-100">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
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
                                  <span>{preset.name}</span>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Daraz Affiliate Deep Link URL *</label>
            <input
              type="url"
              required
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://s.daraz.com.np/s/..."
              className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description / Key Specs</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key specifications, battery life, drivers, warranty details..."
              className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            />
          </div>

          {/* Live Thumbnail Preview if image URL exists */}
          {image && (
            <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
              <img
                src={image}
                alt="Preview"
                className="w-12 h-12 object-contain rounded bg-slate-50 border p-1"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="text-xs">
                <p className="font-bold text-slate-800">{title || 'Preview Title'}</p>
                <p className="text-slate-500">Rs. {price || '0'} • {category || 'General'}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-slate-900 hover:bg-black text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Live Database Items ({filteredList.length})
            </h3>
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter items..."
                className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-orange-500"
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
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs transition"
                >
                  <div className="flex items-center gap-3 overflow-hidden pr-2">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-10 h-10 object-contain rounded-lg bg-white border p-0.5 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <p className="font-bold text-slate-900 truncate">{p.title}</p>
                        {p.id.startsWith('sample-') && (
                          <span className="bg-amber-100 text-amber-800 font-bold text-[9px] px-1.5 py-0.2 rounded border border-amber-200 shrink-0">
                            Pre-Product
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                        <span>Rs. {Number(p.price).toLocaleString('ne-NP')}</span>
                        <span>•</span>
                        <span className="font-medium text-orange-600">{p.category}</span>
                        {p.promoCode && (
                          <>
                            <span>•</span>
                            <span className="bg-orange-100 text-orange-800 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border border-orange-200">
                              Code: {p.promoCode}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>Upvotes: {p.upvotes || 0}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
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
