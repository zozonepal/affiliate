import { Search, X, SlidersHorizontal, ArrowUpDown, CheckCircle2, Zap } from 'lucide-react';
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
    <section className="bg-transparent text-white py-5 px-3 sm:py-8 sm:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3.5">
        
        {/* Curated Drop Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-['Outfit'] font-bold uppercase tracking-wider shadow-xs">
          <Zap className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
          <span>Curated Daraz Nepal Verified Deals</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-['Outfit'] text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Handpicked Deals &amp; Verified Price Drops
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto font-normal">
            Real-time monitored discounts, verified price drops, and curated recommendations on Daraz Nepal.
          </p>
        </div>

        {/* Minimalist Integrated Search & Filter Bar */}
        <div className="bg-[#0B132B]/90 p-2 rounded-2xl border border-white/10 max-w-3xl mx-auto shadow-lg backdrop-blur-md">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[150px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search earbuds, smartwatches, powerbanks, audio..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 bg-[#131b2e] border border-white/8 transition min-h-[42px] font-['Hanken_Grotesk']"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full transition cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Filter Dropdown */}
            <div className="relative w-[130px] sm:w-40 shrink-0">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                id="price-filter-select"
                value={priceFilter}
                onChange={(e) => onPriceFilterChange(e.target.value as PriceFilterRange)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#131b2e] text-slate-200 text-xs font-['Outfit'] font-semibold rounded-xl border border-white/8 focus:outline-none focus:ring-2 focus:ring-orange-400/30 cursor-pointer appearance-none min-h-[42px] truncate"
              >
                <option value="all">All Prices</option>
                <option value="under1k">Under Rs. 1k</option>
                <option value="1k-3k">Rs. 1k - 3k</option>
                <option value="3k-5k">Rs. 3k - 5k</option>
                <option value="over5k">Rs. 5k+</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="relative w-[120px] sm:w-36 shrink-0">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#131b2e] text-slate-200 text-xs font-['Outfit'] font-semibold rounded-xl border border-white/8 focus:outline-none focus:ring-2 focus:ring-orange-400/30 cursor-pointer appearance-none min-h-[42px] truncate"
              >
                <option value="featured">Featured</option>
                <option value="popular">Most Upvoted</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Drops</option>
              </select>
            </div>

          </div>
        </div>

        {/* Live Deals Badge Bar */}
        <div className="flex items-center justify-center gap-3 text-[11px] font-['Outfit'] font-semibold text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-white">{totalDeals}</strong> Verified Deals Active
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            COD &amp; Return Verified
          </span>
        </div>

      </div>
    </section>
  );
}
