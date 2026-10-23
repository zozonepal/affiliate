import { Search, X, SlidersHorizontal, ArrowUpDown, CheckCircle2 } from 'lucide-react';
import { PriceFilterRange, SortOption } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceFilter: PriceFilterRange;
  onPriceFilterChange: (price: PriceFilterRange) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalDeals: number;
}

export function Hero({
  searchQuery,
  onSearchChange,
  priceFilter,
  onPriceFilterChange,
  sortOption,
  onSortChange,
  totalDeals
}: HeroProps) {
  return (
    <section className="bg-slate-950 text-white py-4 px-3 sm:py-6 sm:px-8 border-b border-slate-900 relative">
      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-3">
        
        {/* Title */}
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight">
            Best Tech and Lifestyle Deals in Nepal
          </h1>
          <p className="hidden sm:block text-slate-400 text-xs mt-1 max-w-xl mx-auto font-normal">
            Handpicked, verified discounts on Daraz Nepal with real-time price monitoring.
          </p>
        </div>

        {/* Minimalist Integrated Search & Filter Bar */}
        <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800/90 max-w-3xl mx-auto shadow-sm">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[140px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search deals..."
                className="w-full pl-9 pr-8 py-2 rounded-lg text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-950/80 border border-slate-800 transition min-h-[38px]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 min-w-[28px] min-h-[28px] flex items-center justify-center"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Price Filter Dropdown */}
            <div className="relative w-[125px] sm:w-36 shrink-0">
              <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                id="price-filter-select"
                value={priceFilter}
                onChange={(e) => onPriceFilterChange(e.target.value as PriceFilterRange)}
                className="w-full pl-8 pr-2 py-2 bg-slate-950/80 text-slate-200 text-xs font-medium rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer appearance-none min-h-[38px] truncate"
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
              <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full pl-8 pr-2 py-2 bg-slate-950/80 text-slate-200 text-xs font-medium rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer appearance-none min-h-[38px] truncate"
              >
                <option value="featured">Featured</option>
                <option value="popular">Most Upvoted</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

          </div>
        </div>

        {/* Minimalist Trust Features */}
        <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-orange-500" />
            <span>Verified Flagship Sellers</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-orange-500" />
            <span>Cash on Delivery</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-orange-500" />
            <span>Daily Price Updates</span>
          </div>
        </div>

      </div>
    </section>
  );
}
