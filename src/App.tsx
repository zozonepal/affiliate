import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  subscribeToProducts, 
  onAuthStateChanged, 
  auth, 
  db,
  toggleProductUpvote, 
  syncUserWishlist, 
  loadUserWishlist, 
  logoutCurrentAuth,
  addSubscriberToNewsletter
} from './lib/firebase';
import { ProductDeal, UserAccount, CloudSyncStatus, PriceFilterRange, SortOption, ActiveViewMode } from './types';
import { extractAllImages } from './utils/productImages';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SubmitDealModal } from './components/SubmitDealModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileHeader } from './components/MobileHeader';
import { MobileFilterModal } from './components/MobileFilterModal';
import { BestDealBanner } from './components/BestDealBanner';
import { LoadingScreen } from './components/LoadingScreen';
import { TrustDisclosureBanner } from './components/TrustDisclosureBanner';
import { BestOfListicleView } from './components/BestOfListicleView';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsAndConditionsModal } from './components/TermsAndConditionsModal';
import { CustomDomainModal } from './components/CustomDomainModal';
import { CategorySelectionGateway } from './components/CategorySelectionGateway';
import { PackageOpen, RotateCcw, Plus, Sparkles, X as XIcon, ShieldCheck, Globe, FileText, Lock } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<ProductDeal[]>([]);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('connecting');
  const [user, setUser] = useState<UserAccount | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // CRO Views
  const [activeView, setActiveView] = useState<ActiveViewMode>('grid');

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<PriceFilterRange>('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');

  // Modal visibility states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSubmitDealOpen, setIsSubmitDealOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<ProductDeal | null>(null);

  // Category Selection Gateway First Page State
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('darazdeals_gateway_completed') !== 'true';
    } catch {
      return true;
    }
  });

  const [userPreferredCategories, setUserPreferredCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('darazdeals_user_categories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
        const currentAccount: UserAccount = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Shopper',
          photoURL: firebaseUser.photoURL,
          role: 'user',
          wishlist: []
        };
        setUser(currentAccount);
        localStorage.setItem('dealfinder_user_session', JSON.stringify(currentAccount));

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

  // 2. Connect to shared catalog & live Firestore database via robust subscriber
  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (liveProducts, status) => {
        setProducts(liveProducts);
        setSyncStatus(status);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Live products subscriber notice:', error);
        setSyncStatus('error');
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

    const userSaved = await loadUserWishlist(loggedInUser.uid);
    setWishlist(userSaved);
  };

  const handleLogout = async () => {
    await logoutCurrentAuth();
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('dealfinder_user_session');
  };

  // Filter categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    if (userPreferredCategories.length > 0) {
      return ['All', 'Personalized', ...unique.filter((c) => c !== 'Personalized')];
    }
    return ['All', ...unique];
  }, [products, userPreferredCategories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      let matchesCat = false;
      if (selectedCategory === 'All') {
        matchesCat = true;
      } else if (selectedCategory === 'Personalized') {
        if (userPreferredCategories.length === 0) {
          matchesCat = true;
        } else {
          matchesCat = userPreferredCategories.some((pref) => {
            const pCat = (p.category || '').toLowerCase().trim();
            const prefCat = pref.toLowerCase().trim();
            return (
              pCat === prefCat ||
              pCat.includes(prefCat) ||
              prefCat.includes(pCat)
            );
          });
        }
      } else {
        const pCat = (p.category || '').toLowerCase().trim();
        const selCat = selectedCategory.toLowerCase().trim();
        matchesCat = pCat === selCat || pCat.includes(selCat) || selCat.includes(pCat);
      }

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
  }, [products, searchQuery, selectedCategory, userPreferredCategories, priceFilter, sortOption]);

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

  const handleGatewayComplete = (chosenCategories: string[]) => {
    try {
      localStorage.setItem('darazdeals_gateway_completed', 'true');
      localStorage.setItem('darazdeals_user_categories', JSON.stringify(chosenCategories));
    } catch {}

    setUserPreferredCategories(chosenCategories);
    if (chosenCategories.length === 1) {
      setSelectedCategory(chosenCategories[0]);
    } else if (chosenCategories.length > 1) {
      setSelectedCategory('Personalized');
    } else {
      setSelectedCategory('All');
    }
    setIsGatewayOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGatewaySkip = () => {
    try {
      localStorage.setItem('darazdeals_gateway_completed', 'true');
    } catch {}
    setSelectedCategory('All');
    setIsGatewayOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Category Selection Gateway is active, present it as the dedicated first page
  if (isGatewayOpen && !isLoading) {
    return (
      <CategorySelectionGateway
        user={user}
        deals={products}
        onComplete={handleGatewayComplete}
        onSkip={handleGatewaySkip}
        initialSelected={['earbuds', 'headphones', 'smartwatch']}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col font-['Hanken_Grotesk'] antialiased selection:bg-orange-500 selection:text-white relative overflow-x-hidden">

      {/* Dynamic Ambient Glow Backdrops matching Gateway */}
      <div 
        aria-hidden="true" 
        className="fixed top-20 right-0 -mr-24 w-80 h-80 rounded-full bg-orange-500/10 blur-[100px] pointer-events-none -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="fixed top-96 left-0 -ml-28 w-72 h-72 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none -z-10" 
      />

      {/* Desktop Header & Hero (Loaded for desktop screens) */}
      <div className="hidden md:block">
        <Navbar
          user={user}
          syncStatus={syncStatus}
          wishlistCount={wishlist.length}
          deals={products}
          onQuickView={setActiveQuickViewProduct}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onLogout={handleLogout}
          onOpenDomainModal={() => setIsDomainOpen(true)}
          onOpenGateway={() => setIsGatewayOpen(true)}
        />

        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          totalDeals={products.length}
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
        onOpenSubmitDeal={() => setIsSubmitDealOpen(true)}
        totalDeals={filteredProducts.length}
        onOpenGateway={() => setIsGatewayOpen(true)}
      />

      {/* Main Content Area (With bottom padding compensation for mobile nav) */}
      <main className="w-full px-2.5 sm:px-6 lg:px-10 py-2 sm:py-4 flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-8">

        {/* 1. TOP 10 RANKINGS LISTICLE VIEW */}
        {activeView === 'best-of' && (
          <BestOfListicleView
            products={products}
            onQuickView={setActiveQuickViewProduct}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {/* MAIN DEALS GRID VIEW */}
        {activeView === 'grid' && (
          <>
            {/* Category Filter Pills (Enhanced for both mobile & desktop) */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              productCount={filteredProducts.length}
            />

            {/* Personalized Feed Banner when filtered by custom gateway selection */}
            {selectedCategory === 'Personalized' && (
              <div className="mb-3.5 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 via-[#0B132B] to-[#131b2e] border border-orange-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md font-['Outfit']">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                        Personalized Feed Active
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {userPreferredCategories.length} Categories
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Showing deals tailored to: <span className="text-orange-300 font-semibold">{userPreferredCategories.join(', ')}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsGatewayOpen(true)}
                    className="flex-1 sm:flex-initial text-xs font-bold text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition cursor-pointer"
                  >
                    Edit Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="flex-1 sm:flex-initial text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:brightness-105 px-3.5 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                  >
                    View All Deals
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Active Filter Badge Row - High Contrast Midnight Theme */}
            <div className="md:hidden flex items-center justify-between gap-2 px-1 mb-3 text-xs font-['Outfit']">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="font-black text-slate-200 text-xs shrink-0 tabular-nums bg-[#131b2e] px-2 py-0.5 rounded-lg border border-white/10">
                  {filteredProducts.length} Deals
                </span>
                {priceFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-[#131b2e] text-orange-400 font-bold px-2 py-0.5 rounded-lg text-xs shrink-0 border border-white/10 shadow-2xs">
                    <span>{priceFilter === 'under1k' ? '< Rs. 1k' : priceFilter === '1k-3k' ? '1k-3k' : priceFilter === '3k-5k' ? '3k-5k' : '5k+'}</span>
                    <button onClick={() => setPriceFilter('all')} className="hover:text-white text-slate-400 font-black ml-0.5 cursor-pointer">×</button>
                  </span>
                )}
                {sortOption !== 'featured' && (
                  <span className="inline-flex items-center gap-1 bg-[#131b2e] text-orange-400 font-bold px-2 py-0.5 rounded-lg text-xs shrink-0 border border-white/10 shadow-2xs">
                    <span>{sortOption}</span>
                    <button onClick={() => setSortOption('featured')} className="hover:text-white text-slate-400 font-black ml-0.5 cursor-pointer">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-[#131b2e] text-white font-bold px-2 py-0.5 rounded-lg text-xs shrink-0 border border-white/10 shadow-2xs">
                    <span>"{searchQuery.length > 12 ? searchQuery.slice(0, 12) + '...' : searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-orange-400 text-slate-400 font-black ml-0.5 cursor-pointer">×</button>
                  </span>
                )}
              </div>
              {(priceFilter !== 'all' || sortOption !== 'featured' || searchQuery || selectedCategory !== 'All') && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-orange-400 font-bold shrink-0 hover:text-orange-300 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 px-2 py-1 rounded-lg active:scale-95 transition cursor-pointer"
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
              <LoadingScreen />
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-[#0B132B] rounded-3xl border border-white/10 p-8 max-w-lg mx-auto shadow-md font-['Outfit']">
                <PackageOpen className="w-16 h-16 text-slate-500 mx-auto mb-3" />
                <h3 className="font-bold text-white text-lg">No deals match your criteria</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                  Try adjusting your search query, selecting "All" categories, or resetting the price filters.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-2 bg-[#131b2e] hover:bg-[#1a233b] text-white border border-white/10 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                  {userPreferredCategories.length > 0 && (
                    <button
                      onClick={() => setIsGatewayOpen(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer hover:brightness-105"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Edit Categories</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onUpvote={handleUpvote}
                    onQuickView={setActiveQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#070d1a] border-t border-white/10 py-6 px-4 text-center text-xs text-slate-400 mt-10 mb-16 md:mb-0 font-['Outfit']">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 font-bold text-white">
            <img src="/logo.png" alt="Daraz Deals Nepal Logo" className="w-5 h-5 object-contain" />
            <span className="text-sm">Daraz Deals Nepal</span>
            <span className="text-slate-600">•</span>
            <span className="text-orange-400 font-semibold text-xs">Verified Nepal Curation</span>
          </div>

          {/* Legal Pages & Navigation Links */}
          <div className="flex items-center justify-center gap-3 text-xs font-medium text-slate-400 pt-0.5">
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-orange-400 transition underline underline-offset-2 cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-orange-400 transition underline underline-offset-2 cursor-pointer"
            >
              Terms and Conditions
            </button>
          </div>

          <p className="max-w-xl mx-auto text-slate-500 text-[11px] leading-relaxed font-['Hanken_Grotesk']">
            Daraz Deals Nepal is an independent affiliate curation platform for Daraz Nepal. Product prices and availability remain subject to change by Daraz sellers.
          </p>

          <p className="text-[10px] text-slate-600 pt-0.5 font-mono">
            Copyright (c) 2026 Daraz Deals Nepal. All rights reserved.
          </p>
        </div>
      </footer>

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
        onSuccess={handleAuthSuccess}
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
        onOpenFilter={() => setIsMobileFilterOpen(true)}
        onOpenSubmitDeal={() => setIsSubmitDealOpen(true)}
        isFilterActive={priceFilter !== 'all' || sortOption !== 'featured'}
        activeView={activeView}
        onViewChange={setActiveView}
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

      {/* Privacy Policy Legal Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Terms and Conditions Legal Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Custom Domain Connection & Verification Modal */}
      <CustomDomainModal
        isOpen={isDomainOpen}
        onClose={() => setIsDomainOpen(false)}
      />

    </div>
  );
}
