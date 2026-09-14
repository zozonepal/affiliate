import { useState, useEffect, type FormEvent } from 'react';
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
  Ticket
} from 'lucide-react';
import { ProductDeal, CloudSyncStatus } from '../types';
import { 
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore, 
  seedInitialDealsToFirestore 
} from '../lib/firebase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductDeal[];
  syncStatus: CloudSyncStatus;
  initialEditProduct?: ProductDeal | null;
  onLogoutAdmin: () => void;
}

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
    setAffiliateUrl('');
    setDescription('');
    setMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const dealPayload: Omit<ProductDeal, 'id'> = {
      title: title.trim(),
      category: category.trim() || 'Tech',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      badge: badge.trim() || undefined,
      promoCode: promoCode.trim() ? promoCode.trim().toUpperCase() : undefined,
      image: image.trim(),
      affiliateUrl: affiliateUrl.trim(),
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
    if (!window.confirm(`Delete "${dealTitle}" permanently from cloud database?`)) return;
    try {
      await deleteProductFromFirestore(id);
      setMessage({ type: 'success', text: 'Deal deleted successfully.' });
      if (editingId === id) handleResetForm();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to delete: ' + err.message });
    }
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-5 sm:p-7 flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                Firebase Cloud Admin Dashboard
              </h2>
              <p className="text-xs text-slate-500">
                Live Firestore real-time database management & catalog controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSeedDeals}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition disabled:opacity-50"
              title="Push sample top Nepal deals directly into Firestore"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Seeding...' : 'Seed Top Nepal Deals'}</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition"
            >
              Exit Admin
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
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

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Image URL *</label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
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
                      <p className="font-bold text-slate-900 truncate">{p.title}</p>
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
