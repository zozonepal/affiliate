import { type KeyboardEvent } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Tag, CheckCircle2 } from 'lucide-react';
import { PriceFilterRange, SortOption } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceFilter: PriceFilterRange;
  onPriceFilterChange: (price: PriceFilterRange) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalDeals: number;
  onOpenAdmin?: () => void;
}

export function Hero({
  searchQuery,
  onSearchChange,
  priceFilter,
  onPriceFilterChange,
  sortOption,
  onSortChange,
  totalDeals,
  onOpenAdmin
}: HeroProps) {
  const pricePills: { id: PriceFilterRange; label: string }[] = [
    { id: 'all', label: 'All Prices' },
    { id: 'under1k', label: 'Under Rs. 1,000' },
    { id: '1k-3k', label: 'Rs. 1,000 - 3,000' },
    { id: '3k-5k', label: 'Rs. 3,000 - 5,000' },
    { id: 'over5k', label: 'Rs. 5,000+' }
  ];

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim().toLowerCase();
      if (q === 'admin' || q === 'admin.html' || q === '/admin.html' || q === 'admin/') {
        e.preventDefault();
        window.location.href = '/admin.html';
      }
    }
  };

  const handleInputChange = (val: string) => {
    onSearchChange(val);
    const q = val.trim().toLowerCase();
    if (q === 'admin.html' || q === '/admin.html') {
      window.location.href = '/admin.html';
    }
  };

  return (
    <section className="bg-gradient-to-b from-orange-600 via-orange-500 to-amber-500 text-white py-2 px-3 sm:py-3.5 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background graphic accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Headline badge (desktop only to preserve mobile vertical space) */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-orange-50 text-xs font-semibold mb-1 border border-white/25 shadow-2xs">
          <img src="/logo.png" alt="Finder Nepal" className="w-4 h-4 object-contain" />
          <span>DealFinder Nepal • Curated Daily for Nepal 🇳🇵</span>
        </div>

        {/* Main Title */}
        <h1 className="text-base sm:text-2xl font-black tracking-tight text-white mb-0.5 sm:mb-1 leading-tight">
          Best Budget Tech & Lifestyle Deals
        </h1>
        <p className="hidden sm:block text-orange-100 text-xs sm:text-xs max-w-2xl mx-auto mb-2 font-normal leading-normal px-2">
          Handpicked top-rated gadgets and lifestyle picks verified for authentic discounts on Daraz Nepal.
        </p>

        {/* Unified Integrated Search & Filter Bar */}
        <div className="bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg max-w-4xl mx-auto border border-orange-200/40">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[140px]">
              <Search className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search deals..."
                className="w-full pl-8 sm:pl-10 pr-7 sm:pr-9 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 hover:bg-white transition min-h-[36px] sm:min-h-[40px]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            {/* Price Filter Dropdown */}
            <div className="relative w-[125px] sm:w-40 shrink-0">
              <SlidersHorizontal className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 pointer-events-none" />
              <select
                id="price-filter-select"
                value={priceFilter}
                onChange={(e) => onPriceFilterChange(e.target.value as PriceFilterRange)}
                className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1.5 sm:py-2 bg-slate-50 hover:bg-white text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none min-h-[36px] sm:min-h-[40px] truncate"
              >
                <option value="all">All Prices</option>
                <option value="under1k">Under Rs. 1k</option>
                <option value="1k-3k">Rs. 1k - 3k</option>
                <option value="3k-5k">Rs. 3k - 5k</option>
                <option value="over5k">Rs. 5k+</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="relative w-[115px] sm:w-36 shrink-0">
              <ArrowUpDown className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 pointer-events-none" />
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full pl-6 sm:pl-8 pr-2 sm:pr-3 py-1.5 sm:py-2 bg-slate-50 hover:bg-white text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none min-h-[36px] sm:min-h-[40px] truncate"
              >
                <option value="featured">Featured</option>
                <option value="popular">Upvoted 🔥</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="newest">Newest</option>
              </select>
            </div>

          </div>
        </div>

        {/* Value Props & Trust Badges (desktop only to keep mobile header slim) */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4 text-[11px] text-orange-100 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-amber-200" />
            <span>Official Flagship & Mall Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-amber-200" />
            <span>Cash on Delivery (COD) Compatible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-amber-200" />
            <span>Real-time Nepal Price Tracking</span>
          </div>
        </div>

      </div>
    </section>
  );
}
