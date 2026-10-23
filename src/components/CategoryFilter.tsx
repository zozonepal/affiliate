import { 
  Sparkles, 
  Headphones, 
  Zap, 
  Watch, 
  Gamepad2, 
  Smartphone, 
  Laptop, 
  ShoppingBag, 
  Tag, 
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  productCount: number;
}

export function getCategoryIcon(cat: string) {
  const lower = cat.toLowerCase();
  if (lower === 'all') return Sparkles;
  if (lower.includes('audio') || lower.includes('earbud') || lower.includes('headphone') || lower.includes('sound') || lower.includes('speaker')) return Headphones;
  if (lower.includes('power') || lower.includes('charger') || lower.includes('battery')) return Zap;
  if (lower.includes('watch') || lower.includes('wearable') || lower.includes('fitness')) return Watch;
  if (lower.includes('game') || lower.includes('gaming') || lower.includes('console')) return Gamepad2;
  if (lower.includes('phone') || lower.includes('mobile')) return Smartphone;
  if (lower.includes('laptop') || lower.includes('pc') || lower.includes('computer')) return Laptop;
  if (lower.includes('lifestyle') || lower.includes('fashion') || lower.includes('home')) return ShoppingBag;
  return Tag;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  productCount
}: CategoryFilterProps) {
  const isFiltered = selectedCategory.toLowerCase() !== 'all';

  return (
    <section 
      aria-label="Category Selection"
      className="w-full bg-white rounded-2xl border border-slate-200/80 p-2 sm:p-3 shadow-2xs mb-3.5 sm:mb-4 relative overflow-hidden"
    >
      {/* Category Section Header */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div className="flex items-baseline gap-1.5 min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight whitespace-nowrap">
              Categories
            </h3>
            {isFiltered && (
              <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500 truncate">
                • Showing <strong className="text-orange-600 font-semibold">{selectedCategory}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Right Status / Reset Action */}
        <div className="flex items-center gap-2 shrink-0">
          {isFiltered ? (
            <button
              type="button"
              onClick={() => onSelectCategory('All')}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/80 border border-orange-200 px-2 py-0.5 rounded-lg transition cursor-pointer"
              title="Reset to All Categories"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show All</span>
            </button>
          ) : (
            <div className="text-[11px] font-medium text-slate-600 tabular-nums bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/70">
              <span className="text-orange-600 font-bold">{productCount}</span> deals
            </div>
          )}
        </div>
      </div>

      {/* Horizontally scrollable category chips */}
      <div className="relative group/scroll">
        <div 
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full p-0.5 pb-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const Icon = getCategoryIcon(cat);

            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[38px] flex items-center justify-center gap-1.5 transition-all shrink-0 select-none cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-2xs border border-orange-600 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
                }`}
                aria-pressed={isSelected}
              >
                <Icon 
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-white' : 'text-orange-600'
                  }`} 
                />
                <span className="tracking-tight">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll cue hint for mobile devices */}
        <div className="sm:hidden flex items-center justify-end pr-1 pt-1 text-[10px] text-slate-400 font-medium">
          <span className="inline-flex items-center gap-0.5">
            Swipe for more <ChevronRight className="w-3 h-3 text-slate-400" />
          </span>
        </div>
      </div>
    </section>
  );
}
