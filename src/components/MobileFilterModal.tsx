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

  const sortOptions: { id: SortOption; label: string; icon: string }[] = [
    { id: 'featured', label: 'Featured Deals', icon: '✨' },
    { id: 'popular', label: 'Most Upvoted 🔥', icon: '👍' },
    { id: 'price-asc', label: 'Price: Low to High', icon: '↗️' },
    { id: 'price-desc', label: 'Price: High to Low', icon: '↘️' },
    { id: 'newest', label: 'Newly Discovered', icon: '⚡' }
  ];

  const isFiltered = priceFilter !== 'all' || sortOption !== 'featured';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div className="relative z-10 bg-white w-full max-h-[85vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Handle Bar */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
            <h3 className="font-extrabold text-base text-slate-900">Filter & Sort Deals</h3>
          </div>
          <div className="flex items-center gap-2">
            {isFiltered && (
              <button
                onClick={onReset}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 px-2 py-1 rounded-lg active:bg-orange-50 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full active:bg-slate-100 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Close filter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content with scroll */}
        <div className="p-5 overflow-y-auto space-y-6">
          
          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                Price Range (NPR)
              </label>
              <span className="text-[11px] font-semibold text-orange-600">
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
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition active:scale-[0.99] ${
                      active
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
                    </div>
                    {active && <Check className="w-4 h-4 text-orange-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Option Filter */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort Order</span>
              </label>
              <span className="text-[11px] font-semibold text-orange-600">
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
                    className={`p-2.5 rounded-xl border text-left transition text-xs font-bold flex items-center justify-between active:scale-[0.98] ${
                      active
                        ? 'border-orange-500 bg-orange-50/70 text-orange-900 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Apply CTA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-md shadow-orange-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Show {totalDealsCount} Matching Deals</span>
          </button>
        </div>

      </div>
    </div>
  );
}
