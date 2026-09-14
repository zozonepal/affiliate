import { useState, useEffect, useMemo } from 'react';
import { 
  subscribeToProducts, 
  onAuthStateChanged, 
  auth, 
  toggleProductUpvote, 
  syncUserWishlist, 
  loadUserWishlist, 
  logoutCurrentAuth,
  ADMIN_EMAILS,
  deleteProductFromFirestore
} from './lib/firebase';
import { ProductDeal, UserAccount, CloudSyncStatus, PriceFilterRange, SortOption } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SubmitDealModal } from './components/SubmitDealModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Loader2, PackageOpen, RotateCcw, Plus, Sparkles } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<ProductDeal[]>([]);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('connecting');
  const [user, setUser] = useState<UserAccount | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<PriceFilterRange>('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');

  // Modal visibility states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.hash === '#admin' || window.location.search.includes('admin=true');
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSubmitDealOpen, setIsSubmitDealOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<ProductDeal | null>(null);
  const [editingProductForAdmin, setEditingProductForAdmin] = useState<ProductDeal | null>(null);

  // 1. Subscribe to Firebase Auth state & restore local persistent session
  useEffect(() => {
    // Restore saved session immediately so refreshing on Vercel never loses authentication
    const savedUserSession = localStorage.getItem('dealfinder_user_session');
    if (savedUserSession) {
      try {
        const parsed: UserAccount = JSON.parse(savedUserSession);
        setUser(parsed);
      } catch {
        localStorage.removeItem('dealfinder_user_session');
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userEmail = (firebaseUser.email || '').toLowerCase().trim();
        const isAdmin = ADMIN_EMAILS.some((e) => e.toLowerCase() === userEmail) || userEmail === 'affiliatedaraz25@gmail.com';
        const currentAccount: UserAccount = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Shopper',
          photoURL: firebaseUser.photoURL,
          role: isAdmin ? 'admin' : 'user',
          wishlist: []
        };
        setUser(currentAccount);
        localStorage.setItem('dealfinder_user_session', JSON.stringify(currentAccount));

        // Automatically open the admin panel when signed in from affiliatedaraz25@gmail.com
        if (userEmail === 'affiliatedaraz25@gmail.com') {
          setIsAdminOpen(true);
        }

        const savedWishlist = await loadUserWishlist(firebaseUser.uid);
        setWishlist(savedWishlist);
      } else {
        // Fallback to local guest wishlist if no account session saved
        if (!localStorage.getItem('dealfinder_user_session')) {
          const localGuestWishlist = localStorage.getItem('dealfinder_wishlist_guest');
          if (localGuestWishlist) {
            try {
              setWishlist(JSON.parse(localGuestWishlist));
            } catch {
              setWishlist([]);
            }
          }
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Subscribe to real-time Firestore collection
  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (items, status) => {
        setProducts(items);
        setSyncStatus(status);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Live subscription error, using local fallback:', error);
        setSyncStatus('fallback');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Wishlist handlers
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      const userId = user?.uid || 'guest';
      syncUserWishlist(userId, next);
      return next;
    });
  };

  const handleClearWishlist = () => {
    setWishlist([]);
    const userId = user?.uid || 'guest';
    syncUserWishlist(userId, []);
  };

  // Upvote deal handler
  const handleUpvote = async (productId: string) => {
    const userId = user?.uid || 'guest_user';
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const hasUpvoted = Array.isArray(product.upvotedBy) && product.upvotedBy.includes(userId);

    // Optimistic local update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const currentUpvotedBy = p.upvotedBy || [];
        return {
          ...p,
          upvotes: hasUpvoted ? Math.max(0, (p.upvotes || 0) - 1) : (p.upvotes || 0) + 1,
          upvotedBy: hasUpvoted
            ? currentUpvotedBy.filter((id) => id !== userId)
            : [...currentUpvotedBy, userId]
        };
      })
    );

    try {
      await toggleProductUpvote(productId, userId, hasUpvoted);
    } catch (err) {
      console.error('Error toggling upvote in Firestore:', err);
    }
  };

  // Auth handlers
  const handleAuthSuccess = async (loggedInUser: UserAccount) => {
    setUser(loggedInUser);
    localStorage.setItem('dealfinder_user_session', JSON.stringify(loggedInUser));
    if (loggedInUser.role === 'admin' || loggedInUser.email?.toLowerCase() === 'affiliatedaraz25@gmail.com') {
      setIsAdminOpen(true);
    }
    const userSaved = await loadUserWishlist(loggedInUser.uid);
    setWishlist(userSaved);
  };

  const handleLogout = async () => {
    await logoutCurrentAuth();
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('dealfinder_user_session');
    localStorage.removeItem('dealfinder_admin_auth');
    sessionStorage.removeItem('dealfinder_admin_auth');
  };

  const handleEditFromCard = (product: ProductDeal) => {
    setEditingProductForAdmin(product);
    setIsAdminOpen(true);
  };

  // Filter categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ['All', ...unique];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      const matchesCat =
        selectedCategory === 'All' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.seller && p.seller.toLowerCase().includes(q));

      // Price filter match
      let matchesPrice = true;
      if (priceFilter === 'under1k') matchesPrice = p.price < 1000;
      else if (priceFilter === '1k-3k') matchesPrice = p.price >= 1000 && p.price <= 3000;
      else if (priceFilter === '3k-5k') matchesPrice = p.price > 3000 && p.price <= 5000;
      else if (priceFilter === 'over5k') matchesPrice = p.price > 5000;

      return matchesCat && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'popular') return (b.upvotes || 0) - (a.upvotes || 0);
      if (sortOption === 'newest') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      return 0; // Default featured
    });
  }, [products, searchQuery, selectedCategory, priceFilter, sortOption]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceFilter('all');
    setSortOption('featured');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        syncStatus={syncStatus}
        wishlistCount={wishlist.length}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => {
          if (user?.role === 'admin') {
            setIsAdminOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onLogout={handleLogout}
      />

      {/* Hero Section with Search & Sorting */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priceFilter={priceFilter}
        onPriceFilterChange={setPriceFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        totalDeals={products.length}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full">
        
        {/* Category Filter Pills */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          productCount={filteredProducts.length}
        />

        {/* Product Grid or Loading / Empty States */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-base">
              Connecting to Real-time Cloud Firestore...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Synchronizing verified Nepal affiliate deals & discounts
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 max-w-lg mx-auto shadow-xs">
            <PackageOpen className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No deals match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Try adjusting your search query, selecting "All" categories, or resetting the price filters.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                user={user}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onUpvote={handleUpvote}
                onQuickView={setActiveQuickViewProduct}
                onEdit={handleEditFromCard}
                onDelete={async (id) => {
                  const target = products.find(p => p.id === id);
                  if (window.confirm(`Permanently delete "${target?.title || 'this deal'}"?`)) {
                    await deleteProductFromFirestore(id);
                  }
                }}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 text-center text-xs text-slate-500 mt-12 mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-800">
            <span>DealFinder NP</span>
            <span className="text-slate-300">•</span>
            <span className="text-orange-600">🇳🇵 Nepal Tech & Lifestyle Recommendations</span>
          </div>
          <p className="max-w-xl mx-auto text-slate-400 text-[11px] leading-relaxed">
            DealFinder NP is an affiliate curation platform for Daraz Nepal. We earn a small commission through verified affiliate links at zero additional cost to buyers. Product prices and availability are accurate as of posting and are subject to change by Daraz sellers.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-slate-400 text-[11px]">
            <span>Cloud Sync: Google Firebase Firestore</span>
            <span>•</span>
            <span>Real-time Updates</span>
            <span>•</span>
            <span>Auth & Wishlist Persistence</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (thumb-friendly, sticky) */}
      <MobileBottomNav
        user={user}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => {
          if (user?.role === 'admin' || user?.email?.toLowerCase() === 'affiliatedaraz25@gmail.com') {
            setIsAdminOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={activeQuickViewProduct}
        user={user}
        isWishlisted={activeQuickViewProduct ? wishlist.includes(activeQuickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onUpvote={handleUpvote}
        onClose={() => setActiveQuickViewProduct(null)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(account) => {
          handleAuthSuccess(account);
          if (account.role === 'admin') {
            setIsAdminOpen(true);
          }
        }}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setEditingProductForAdmin(null);
        }}
        products={products}
        syncStatus={syncStatus}
        initialEditProduct={editingProductForAdmin}
        onLogoutAdmin={() => {
          setIsAdminOpen(false);
          if (user?.role === 'admin') {
            handleLogout();
          }
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        allProducts={products}
        onRemoveFromWishlist={handleToggleWishlist}
        onClearWishlist={handleClearWishlist}
        onQuickView={setActiveQuickViewProduct}
      />

      <SubmitDealModal
        isOpen={isSubmitDealOpen}
        onClose={() => setIsSubmitDealOpen(false)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

    </div>
  );
}
