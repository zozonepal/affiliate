import { X, Check, RotateCcw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { PriceFilterRange, SortOption } from '../types';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceFilter: PriceFilterRange;
  onPriceFilterChange: (price: PriceFilterRange) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalDealsCount: number;
  onReset: () => void;
}

export function MobileFilterModal({
  isOpen,
  onClose,
  priceFilter,
  onPriceFilterChange,
  sortOption,
  onSortChange,
  totalDealsCount,
  onReset
}: MobileFilterModalProps) {
  if (!isOpen) return null;

  const priceOptions: { id: PriceFilterRange; label: string; desc: string }[] = [
    { id: 'all', label: 'All Budgets', desc: 'Show all deals' },
    { id: 'under1k', label: 'Under Rs. 1,000', desc: 'Pocket-friendly tech' },
    { id: '1k-3k', label: 'Rs. 1,000 - 3,000', desc: 'Best value gadgets' },
    { id: '3k-5k', label: 'Rs. 3,000 - 5,000', desc: 'Mid-range accessories' },
    { id: 'over5k', label: 'Above Rs. 5,000', desc: 'Premium electronics' }
  ];

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'featured', label: 'Featured Deals' },
    { id: 'popular', label: 'Most Upvoted' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newly Discovered' }
  ];

  const isFiltered = priceFilter !== 'all' || sortOption !== 'featured';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-['Hanken_Grotesk']">
      
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div className="relative z-10 bg-[#0B132B] text-[#dae2fd] w-full max-h-[85vh] rounded-t-3xl border-t border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Handle Bar */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-white/20 rounded-sm" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between font-['Outfit']">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-400" />
            <h3 className="font-extrabold text-base text-white">Filter & Sort Deals</h3>
          </div>
          <div className="flex items-center gap-2">
            {isFiltered && (
              <button
                onClick={onReset}
                className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
              aria-label="Close filter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content with scroll */}
        <div className="p-5 overflow-y-auto space-y-6 font-['Outfit']">
          
          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                Price Range (NPR)
              </label>
              <span className="text-[11px] font-semibold text-orange-400">
                {priceOptions.find((p) => p.id === priceFilter)?.label}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-1.5">
              {priceOptions.map((opt) => {
                const active = priceFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onPriceFilterChange(opt.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition active:scale-[0.99] cursor-pointer ${
                      active
                        ? 'border-orange-500 bg-orange-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#131b2e] hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
                    </div>
                    {active && <Check className="w-4 h-4 text-orange-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Option Filter */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-orange-400" />
                <span>Sort Order</span>
              </label>
              <span className="text-[11px] font-semibold text-orange-400">
                {sortOptions.find((s) => s.id === sortOption)?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((opt) => {
                const active = sortOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSortChange(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition text-xs font-bold flex items-center justify-between active:scale-[0.98] cursor-pointer ${
                      active
                        ? 'border-orange-500 bg-orange-500/20 text-white shadow-xs'
                        : 'border-white/10 bg-[#131b2e] hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Apply CTA */}
        <div className="p-4 border-t border-white/10 bg-[#070d1a] pb-[calc(1rem+env(safe-area-inset-bottom))] font-['Outfit']">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-md shadow-orange-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
          >
            <span>Show {totalDealsCount} Matching Deals</span>
          </button>
        </div>

      </div>
    </div>
  );
}
