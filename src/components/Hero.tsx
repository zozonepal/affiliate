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
    <section className="bg-gradient-to-b from-orange-600 via-orange-500 to-amber-500 text-white pt-5 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background graphic accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Headline badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-orange-50 text-[11px] font-semibold mb-2 border border-white/20">
          <Tag className="w-3 h-3 text-amber-200" />
          <span>Curated Daily from Daraz Nepal 🇳🇵</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-black tracking-tight text-white mb-1.5">
          Best Budget Tech & Lifestyle Deals
        </h1>
        <p className="text-orange-100 text-xs sm:text-sm max-w-xl mx-auto mb-4 font-normal leading-snug">
          Handpicked top-rated gadgets and accessories verified for authentic seller reviews and real discounts on Daraz Nepal.
        </p>

        {/* Search & Filter Bar Container */}
        <div className="bg-white p-2 rounded-2xl shadow-lg max-w-3xl mx-auto border border-orange-200/40">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search deals (e.g. Ultima earbuds, mechanical keyboard, power bank)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 hover:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-44">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 hover:bg-white text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer appearance-none"
                >
                  <option value="featured">Featured Deals</option>
                  <option value="popular">Most Upvoted 🔥</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Added</option>
                </select>
              </div>
            </div>

          </div>

          {/* Price Range Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 mt-2 border-t border-slate-100 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1 hidden sm:inline">
              Price:
            </span>
            {pricePills.map((pill) => (
              <button
                key={pill.id}
                id={`price-filter-${pill.id}`}
                onClick={() => onPriceFilterChange(pill.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  priceFilter === pill.id
                    ? 'bg-orange-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

        </div>

        {/* Value Props & Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4 text-[11px] text-orange-100 font-medium">
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
