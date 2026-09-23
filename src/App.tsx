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
  deleteProductFromFirestore,
  addSubscriberToNewsletter
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
import { MobileHeader } from './components/MobileHeader';
import { MobileFilterModal } from './components/MobileFilterModal';
import { BestDealBanner } from './components/BestDealBanner';
import { Loader2, PackageOpen, RotateCcw, Plus, Sparkles, X as XIcon } from 'lucide-react';

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
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
        const isAdmin = ADMIN_EMAILS.some((e) => e.toLowerCase() === userEmail) || userEmail === 'zozonepal5@gmail.com' || userEmail === 'affiliatedaraz25@gmail.com';
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

        // Automatically open the admin panel when signed in from zozonepal5@gmail.com or affiliatedaraz25@gmail.com
        if (userEmail === 'zozonepal5@gmail.com' || userEmail === 'affiliatedaraz25@gmail.com') {
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

  // Auto-open deal when opened from a WhatsApp / Facebook shareable link
  useEffect(() => {
    if (products.length > 0 && !activeQuickViewProduct) {
      const params = new URLSearchParams(window.location.search);
      const sharedDealId = params.get('deal');
      if (sharedDealId) {
        const found = products.find((p) => p.id === sharedDealId);
        if (found) {
          setActiveQuickViewProduct(found);
        }
      }
    }
  }, [products]);

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
    
    // Automatically register user's email into the automated notification system
    if (loggedInUser.email && !loggedInUser.email.includes('guest')) {
      addSubscriberToNewsletter(loggedInUser.email).catch(console.error);
    }

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

  // Automatically score and insert the BEST deals without any manual interference
  const bestDeals = useMemo(() => {
    if (products.length === 0) return [];
    
    return [...products]
      .map((p) => {
        const orig = p.originalPrice || Math.round(p.price * 1.35);
        const savings = orig > p.price ? orig - p.price : 0;
        const discountPercent = orig > p.price ? Math.round((savings / orig) * 100) : 0;
        
        // Multi-factor Deal Value Score (calculates highest % discount, savings, community upvotes, and ratings)
        const dealScore = 
          discountPercent * 2.5 + 
          (p.upvotes || 0) * 3 + 
          ((p.rating || 4.5) * 3) + 
          (p.promoCode ? 15 : 0) + 
          (p.badge ? 10 : 0);
          
        return { product: p, dealScore };
      })
      .sort((a, b) => b.dealScore - a.dealScore)
      .map((item) => item.product);
  }, [products]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceFilter('all');
    setSortOption('featured');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Desktop Header & Hero (Loaded for desktop screens) */}
      <div className="hidden md:block">
        <Navbar
          user={user}
          syncStatus={syncStatus}
          wishlistCount={wishlist.length}
          deals={products}
          onQuickView={setActiveQuickViewProduct}
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
      </div>

      {/* Mobile App Header (Loaded for mobile devices) */}
      <MobileHeader
        user={user}
        wishlistCount={wishlist.length}
        deals={products}
        onQuickView={setActiveQuickViewProduct}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        priceFilter={priceFilter}
        sortOption={sortOption}
        onOpenFilterModal={() => setIsMobileFilterOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => {
          if (user?.role === 'admin') {
            setIsAdminOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
        onOpenSubmitDeal={() => setIsSubmitDealOpen(true)}
        totalDeals={filteredProducts.length}
      />

      {/* Main Content Area (With bottom padding compensation for mobile nav) */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-4 flex-1 w-full pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-8">
        
        {/* Category Filter Pills (Desktop only, as mobile has native header scroll pills) */}
        <div className="hidden md:block">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            productCount={filteredProducts.length}
          />
        </div>

        {/* Mobile Active Filter Badge Row */}
        <div className="md:hidden flex items-center justify-between gap-2 px-1 mb-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="font-black text-slate-800 text-[11px] shrink-0">
              {filteredProducts.length} Deals
            </span>
            {priceFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">
                <span>{priceFilter === 'under1k' ? '< Rs. 1k' : priceFilter === '1k-3k' ? '1k-3k' : priceFilter === '3k-5k' ? '3k-5k' : '5k+'}</span>
                <button onClick={() => setPriceFilter('all')} className="hover:text-orange-950 font-black">×</button>
              </span>
            )}
            {sortOption !== 'featured' && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">
                <span>{sortOption}</span>
                <button onClick={() => setSortOption('featured')} className="hover:text-orange-950 font-black">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">
                <span>"{searchQuery.length > 15 ? searchQuery.slice(0, 15) + '...' : searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-slate-950 font-black">×</button>
              </span>
            )}
          </div>
          {(priceFilter !== 'all' || sortOption !== 'featured' || searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={resetAllFilters}
              className="text-[10px] text-orange-600 font-bold shrink-0 hover:underline active:text-orange-700"
            >
              Reset
            </button>
          )}
        </div>

        {/* Automated Best Deal Banner: Analyzes all uploaded products and displays the best deal */}
        {!isLoading && !searchQuery && selectedCategory === 'All' && priceFilter === 'all' && products.length > 0 && (
          <BestDealBanner
            products={products}
            onQuickView={setActiveQuickViewProduct}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.includes(products[0]?.id || '')}
          />
        )}

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
          <div className="flex items-center justify-center gap-2.5 font-bold text-slate-800">
            <img src="/logo.png" alt="Finder Nepal Logo" className="w-6 h-6 object-contain" />
            <span>DealFinder Nepal</span>
            <span className="text-slate-300">•</span>
            <span className="text-orange-600">🇳🇵 Verified Tech & Lifestyle Recommendations</span>
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

      {/* Mobile Bottom Bar Navigation */}
      <MobileBottomNav
        user={user}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => {
          if (user?.role === 'admin') {
            setIsAdminOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
        onOpenFilter={() => setIsMobileFilterOpen(true)}
        onOpenSubmitDeal={() => setIsSubmitDealOpen(true)}
        isFilterActive={priceFilter !== 'all' || sortOption !== 'featured'}
      />

      {/* Mobile Filter & Sort Bottom Sheet Modal */}
      <MobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        priceFilter={priceFilter}
        onPriceFilterChange={(price) => {
          setPriceFilter(price);
          setIsMobileFilterOpen(false);
        }}
        sortOption={sortOption}
        onSortChange={(sort) => {
          setSortOption(sort);
          setIsMobileFilterOpen(false);
        }}
        totalDealsCount={filteredProducts.length}
        onReset={() => {
          setPriceFilter('all');
          setSortOption('featured');
          setIsMobileFilterOpen(false);
        }}
      />

    </div>
  );
}
