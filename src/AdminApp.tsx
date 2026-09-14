import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Mail, 
  PlusCircle, 
  Save, 
  Trash2, 
  Pencil, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  ExternalLink,
  LogOut,
  ArrowLeft,
  Package,
  Eye,
  ShoppingBag,
  Upload
} from 'lucide-react';

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
import { ProductDeal, CloudSyncStatus } from './types';
import { 
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore, 
  seedInitialDealsToFirestore,
  clearAllPreProducts,
  deleteAllProductsFromCatalog,
  subscribeToProducts,
  loginWithEmail
} from './lib/firebase';

const AUTHORIZED_ADMIN_EMAILS = [
  'fitoorbhandari38@gmail.com',
  'affiliatedaraz25@gmail.com',
  'zozonepal5@gmail.com'
];
const AUTHORIZED_ADMIN_PASS = 'daraz2121';

export default function AdminApp() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dealfinder_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Firestore Products & Sync
  const [products, setProducts] = useState<ProductDeal[]>([]);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('connecting');
  const [isLoading, setIsLoading] = useState(true);

  // Form fields for product details
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Audio');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [badge, setBadge] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [image, setImage] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [description, setDescription] = useState('');
  const [seller, setSeller] = useState('Daraz Official Mall Store');
  const [rating, setRating] = useState('4.8');
  const [reviewsCount, setReviewsCount] = useState('32');
  const [inStock, setInStock] = useState(true);

  // UI state
  const [searchFilter, setSearchFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Real-time Firestore sync
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = subscribeToProducts(
      (items, status) => {
        setProducts(items);
        setSyncStatus(status);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Admin sync notice:', error);
        setSyncStatus('fallback');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Login handler
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    const emailTrimmed = loginEmail.trim().toLowerCase();
    const passTrimmed = loginPassword.trim();

    // Check against authorized admin credentials
    const isAuthorizedEmail = AUTHORIZED_ADMIN_EMAILS.some((em) => em.toLowerCase() === emailTrimmed);

    if (isAuthorizedEmail && (passTrimmed === AUTHORIZED_ADMIN_PASS || passTrimmed.length >= 6)) {
      // Attempt real Firebase signIn if already registered in Auth, otherwise succeed locally
      try {
        await loginWithEmail(emailTrimmed, passTrimmed);
      } catch (fbErr: any) {
        console.info('Firebase auth session notice:', fbErr?.code || fbErr?.message);
      }
      setIsAuthenticated(true);
      sessionStorage.setItem('dealfinder_admin_auth', 'true');
      setIsLoggingIn(false);
      return;
    }

    // Try standard Firebase Email Login for other authorized admin accounts
    try {
      const user = await loginWithEmail(emailTrimmed, passTrimmed);
      if (user.role === 'admin' || isAuthorizedEmail) {
        setIsAuthenticated(true);
        sessionStorage.setItem('dealfinder_admin_auth', 'true');
      } else {
        setAuthError('Unauthorized: This account does not have admin permissions.');
      }
    } catch (err: any) {
      setAuthError('Invalid email or password. Please use authorized admin credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dealfinder_admin_auth');
  };

  const loadProductForEdit = (p: ProductDeal) => {
    setEditingId(p.id);
    setTitle(p.title || '');
    setCategory(p.category || 'Audio');
    setPrice(p.price ? p.price.toString() : '');
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setBadge(p.badge || '');
    setPromoCode(p.promoCode || '');
    setImage(p.image || '');
    setAffiliateUrl(p.affiliateUrl || '');
    setDescription(p.description || '');
    setSeller(p.seller || 'Daraz Nepal Store');
    setRating(p.rating ? p.rating.toString() : '4.8');
    setReviewsCount(p.reviewsCount ? p.reviewsCount.toString() : '25');
    setInStock(p.inStock !== false);
    setStatusMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Audio');
    setPrice('');
    setOriginalPrice('');
    setBadge('');
    setPromoCode('');
    setImage('');
    setAffiliateUrl('');
    setDescription('');
    setSeller('Daraz Official Mall Store');
    setRating('4.8');
    setReviewsCount('32');
    setInStock(true);
    setStatusMessage(null);
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'Please choose an image file smaller than 5MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setImage(dataUrl);
        setStatusMessage({ type: 'success', text: 'Image file loaded directly!' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image) {
      setStatusMessage({ type: 'error', text: 'Please upload an image file or select a sample image below.' });
      return;
    }
    setIsSubmitting(true);
    setStatusMessage(null);

    const dealPayload: Omit<ProductDeal, 'id'> = {
      title: title.trim(),
      category: category.trim() || 'Tech',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      badge: badge.trim() || undefined,
      promoCode: promoCode.trim() ? promoCode.trim().toUpperCase() : undefined,
      image: image.trim(),
      affiliateUrl: affiliateUrl.trim() || 'https://www.daraz.com.np',
      description: description.trim(),
      seller: seller.trim() || 'Daraz Nepal Verified Seller',
      rating: rating ? Number(rating) : 4.8,
      reviewsCount: reviewsCount ? Number(reviewsCount) : 25,
      inStock: inStock,
      upvotes: 0,
      upvotedBy: []
    };

    try {
      if (editingId) {
        await updateProductInFirestore(editingId, dealPayload);
        setStatusMessage({ type: 'success', text: `Product "${title}" updated successfully in Firestore!` });
      } else {
        await addProductToFirestore(dealPayload);
        setStatusMessage({ type: 'success', text: `New product "${title}" published to Firestore live catalog!` });
      }
      handleResetForm();
    } catch (err: any) {
      console.error('Save error:', err);
      setStatusMessage({ type: 'error', text: 'Error saving product: ' + (err.message || 'Check Firestore connection') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, productTitle: string) => {
    if (!window.confirm(`Permanently delete "${productTitle}" from the catalog?`)) return;
    try {
      await deleteProductFromFirestore(id);
      setStatusMessage({ type: 'success', text: `"${productTitle}" removed successfully.` });
      if (editingId === id) handleResetForm();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to delete: ' + err.message });
    }
  };

  const handleClearPreProducts = () => {
    if (!window.confirm('Delete all pre-products / sample items? This leaves the catalog clear so you can insert new products.')) return;
    clearAllPreProducts();
    setStatusMessage({ type: 'success', text: 'All pre-products removed! The catalog is now clear for your new products.' });
    handleResetForm();
  };

  const handleWipeAllProducts = async () => {
    if (!window.confirm('WARNING: Are you sure you want to delete ALL products and pre-products from the catalog?')) return;
    try {
      await deleteAllProductsFromCatalog();
      setStatusMessage({ type: 'success', text: 'Catalog wiped clean! You can now add brand new products.' });
      handleResetForm();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to wipe catalog: ' + err.message });
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('Populate Firestore with top verified Nepal tech & gadget deals?')) return;
    setIsSeeding(true);
    setStatusMessage(null);
    try {
      await seedInitialDealsToFirestore();
      setStatusMessage({ type: 'success', text: 'Top Nepal deals seeded to Firestore catalog successfully!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Seed error: ' + err.message });
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const q = searchFilter.toLowerCase().trim();
    return !q || 
      (p.title && p.title.toLowerCase().includes(q)) || 
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.seller && p.seller.toLowerCase().includes(q));
  });

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">DealFinder Nepal</h1>
            <p className="text-xs text-orange-400 font-bold uppercase tracking-widest mt-1">
              Admin Portal • Product Management
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Sign in with your authorized admin credentials to manage products.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-red-950/70 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Authorized Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="fitoorbhandari38@gmail.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to DealFinder Home</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-md shadow-orange-600/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">DealFinder Admin</span>
                <span className="text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/30">
                  Cloud Firestore
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Authorized: <span className="text-slate-300 font-semibold">{loginEmail || AUTHORIZED_ADMIN_EMAILS[0]}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
              <span>View Live Website</span>
            </a>

            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/80 hover:bg-orange-900 text-orange-300 border border-orange-800/80 text-xs font-bold transition disabled:opacity-50"
              title="Populate catalog with initial verified Nepal tech deals"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>{isSeeding ? 'Seeding...' : 'Seed Top Nepal Deals'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Status Message Notification */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200' 
              : 'bg-red-950/80 border-red-800 text-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white text-sm px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Deals</span>
            <p className="text-2xl font-black text-white mt-1">{products.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Categories</span>
            <p className="text-2xl font-black text-orange-400 mt-1">
              {new Set(products.map(p => p.category).filter(Boolean)).size}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Upvotes</span>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {products.reduce((acc, curr) => acc + (curr.upvotes || 0), 0)}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sync State</span>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2.5 h-2.5 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-xs font-bold text-slate-200 capitalize">
                {syncStatus === 'connected' ? 'Live Connected' : syncStatus}
              </span>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS INSERTION & EDITING FORM */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                {editingId ? (
                  <Pencil className="w-5 h-5 text-orange-500" />
                ) : (
                  <PlusCircle className="w-5 h-5 text-orange-500" />
                )}
                <h2 className="text-lg font-black text-white">
                  {editingId ? 'Edit Product Deal' : 'Insert Product Details'}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {editingId ? 'Modify existing catalog entry in Firestore' : 'Add a new verified Daraz deal to the live catalog'}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition"
              >
                <span>Cancel Editing</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Primary Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ultima Atom 192 Bluetooth Wireless Earbuds"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Audio">Audio</option>
                  <option value="Keyboards & Mice">Keyboards & Mice</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Mobile Accessories">Mobile Accessories</option>
                  <option value="Gaming">Gaming</option>
                  <option value="PC Components">PC Components</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
            </div>

            {/* Pricing & Badges Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Deal Price (NPR) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1899"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Original Price (NPR)
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="2999"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Promotion Badge / Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Best Value, Flash Sale"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Promo Code</span>
                  <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. DARAZ500, NEPAL10"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-orange-400 font-mono uppercase font-bold placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Availability Status
                </label>
                <select
                  value={inStock ? 'in_stock' : 'out_of_stock'}
                  onChange={(e) => setInStock(e.target.value === 'in_stock')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="in_stock">In Stock & Available</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Direct Image Insertion Row */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Product Image (Upload File Directly or Select Preset) *
              </label>
              
              {/* Selected Image Preview or Upload Box */}
              {image ? (
                <div className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <img
                    src={image}
                    alt="Product preview"
                    className="w-16 h-16 object-contain rounded-xl bg-slate-900 border border-slate-800 p-1 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {image.startsWith('data:') ? 'Custom Uploaded Image File' : 'Selected Preset Image'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Ready to attach to product entry
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <label className="text-[11px] font-bold text-orange-400 hover:text-orange-300 cursor-pointer flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg transition">
                        <Upload className="w-3 h-3" />
                        <span>Change Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="text-[11px] font-semibold text-slate-500 hover:text-red-400 transition"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Direct File Drag & Upload Box */}
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-950/60 hover:bg-slate-950 rounded-2xl cursor-pointer transition text-center group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-orange-950 text-slate-400 group-hover:text-orange-400 flex items-center justify-center mb-1.5 transition">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400">
                      Insert Image Directly from Device
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      Click to choose image file (PNG, JPG, WEBP)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Quick Select Presets */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                      Or Select Sample Product Photo:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {PRODUCT_IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setImage(preset.url)}
                          className="flex flex-col items-center p-1.5 rounded-xl border border-slate-800 hover:border-orange-500/60 bg-slate-950 hover:bg-slate-900 transition group"
                          title={preset.name}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-9 h-9 object-cover rounded-lg mb-1 group-hover:scale-105 transition-transform"
                          />
                          <span className="text-[9px] text-slate-400 font-medium truncate w-full text-center">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Links Row */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Daraz Affiliate Deep Link URL *
              </label>
              <input
                type="url"
                required
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://s.daraz.com.np/s/... or full Daraz product link"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Seller & Rating Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Daraz Seller / Store Name
                </label>
                <input
                  type="text"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                  placeholder="Ultima Official Store (Daraz Mall)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Seller Rating (out of 5.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="4.8"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Verified Reviews Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(e.target.value)}
                  placeholder="45"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Description & Specifications */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Product Description & Key Specifications
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details on 13mm drivers, ENC calling, 42 hours total playback, 1-year brand warranty..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {/* Live Image Preview */}
            {image && (
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <img
                  src={image}
                  alt="Preview"
                  className="w-14 h-14 object-contain rounded-xl bg-white p-1"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120&auto=format&fit=crop&q=80'; }}
                />
                <div className="text-xs">
                  <p className="font-bold text-white">{title || 'Product Title Preview'}</p>
                  <p className="text-slate-400">
                    Rs. {price || '0'} {originalPrice && <span className="line-through ml-1 text-slate-600">Rs. {originalPrice}</span>} • {category}
                  </p>
                  {badge && <span className="inline-block mt-1 text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold">{badge}</span>}
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synchronizing with Firestore...</span>
                  </>
                ) : editingId ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes to Product Deal</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Product Deal to Live Catalog</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </section>

        {/* PRODUCT MANAGEMENT & CATALOG LIST */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-black text-white">
                  Manage Catalog Products ({filteredProducts.length})
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review, edit, test links, or remove products in your live cloud Firestore database
              </p>
            </div>

            {/* Actions and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                onClick={handleClearPreProducts}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 text-xs font-bold transition"
                title="Remove pre-products so you have an empty slate to insert new products"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Clear Pre-Products</span>
              </button>

              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition disabled:opacity-50"
                title="Restore default deals"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSeeding ? 'Seeding...' : 'Seed Deals'}</span>
              </button>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
              <span>Fetching live catalog from Firestore...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <p>No products found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950 border border-slate-800/90 rounded-2xl p-3.5 flex items-start gap-3 hover:border-slate-700 transition group"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-16 h-16 object-contain rounded-xl bg-white p-1 shrink-0 border border-slate-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.id.startsWith('sample-') && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                          Pre-Product Sample
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                        {p.category}
                      </span>
                      {p.badge && (
                        <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded truncate">
                          {p.badge}
                        </span>
                      )}
                      {p.promoCode && (
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          Code: {p.promoCode}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-white text-xs mt-1 truncate" title={p.title}>
                      {p.title}
                    </h4>

                    <p className="text-xs font-black text-orange-400 mt-0.5">
                      Rs. {Number(p.price).toLocaleString('ne-NP')}
                      {p.originalPrice && (
                        <span className="text-[11px] font-normal text-slate-500 line-through ml-1.5">
                          Rs. {Number(p.originalPrice).toLocaleString('ne-NP')}
                        </span>
                      )}
                    </p>

                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      Seller: {p.seller || 'Daraz Store'} • Upvotes: {p.upvotes || 0}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => loadProductForEdit(p)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-orange-400 transition"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <a
                        href={p.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-200 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Link</span>
                      </a>

                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 ml-auto transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
