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
  RotateCcw,
  Wrench,
  Speaker,
  Compass,
  Car,
  Mic
} from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  productCount: number;
  userPreferredCount?: number;
}

export function getCategoryIcon(cat: string) {
  const lower = cat.toLowerCase();
  if (lower === 'all' || lower.includes('personal')) return Sparkles;
  if (lower.includes('mic')) return Mic;
  if (lower.includes('tech') || lower.includes('audio') || lower.includes('earbud') || lower.includes('headphone')) return Headphones;
  if (lower.includes('watch') || lower.includes('wearable')) return Watch;
  if (lower.includes('speaker') || lower.includes('sound')) return Speaker;
  if (lower.includes('power') || lower.includes('battery') || lower.includes('cable')) return Zap;
  if (lower.includes('tool') || lower.includes('drill') || lower.includes('hardware')) return Wrench;
  if (lower.includes('home') || lower.includes('appliance') || lower.includes('kitchen')) return Sparkles;
  if (lower.includes('mobile') || lower.includes('phone') || lower.includes('charger') || lower.includes('gear')) return Smartphone;
  if (lower.includes('game') || lower.includes('gaming') || lower.includes('keyboard') || lower.includes('pc')) return Gamepad2;
  if (lower.includes('outdoor') || lower.includes('edc') || lower.includes('torch') || lower.includes('camp')) return Compass;
  if (lower.includes('auto') || lower.includes('car')) return Car;
  return Tag;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  productCount,
  userPreferredCount = 0
}: CategoryFilterProps) {
  const isFiltered = selectedCategory.toLowerCase() !== 'all';

  return (
    <section 
      aria-label="Category Selection"
      className="w-full bg-[#0B132B]/90 backdrop-blur-md rounded-2xl border border-white/10 p-2.5 sm:p-3.5 shadow-sm mb-3.5 sm:mb-4 relative overflow-hidden"
    >
      {/* Category Section Header */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-1.5 min-w-0">
            <h3 className="font-['Outfit'] font-bold text-xs sm:text-sm text-white tracking-tight whitespace-nowrap">
              Categories
            </h3>
            {isFiltered && (
              <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 truncate font-['Outfit']">
                • Showing <strong className="text-orange-400 font-bold">{selectedCategory}</strong>
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
              className="inline-flex items-center gap-1 text-[11px] font-['Outfit'] font-bold text-orange-400 hover:text-orange-300 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 px-2.5 py-1 rounded-xl transition cursor-pointer"
              title="Reset to All Categories"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show All</span>
            </button>
          ) : (
            <div className="text-[11px] font-['Outfit'] font-semibold text-slate-300 tabular-nums bg-[#131b2e] px-2.5 py-0.5 rounded-xl border border-white/10">
              <span className="text-orange-400 font-bold">{productCount}</span> drops
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
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-['Outfit'] whitespace-nowrap min-h-[30px] sm:min-h-[34px] flex items-center justify-center gap-1 sm:gap-1.5 transition-all shrink-0 select-none cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-slate-950 font-black shadow-md shadow-orange-500/30'
                    : 'bg-[#131b2e] hover:bg-[#1E293B] text-slate-200 hover:text-white border border-white/8 font-semibold'
                }`}
                aria-pressed={isSelected}
              >
                <Icon 
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
                    isSelected ? 'text-slate-950 stroke-[2.5]' : 'text-orange-400'
                  }`} 
                />
                <span className="tracking-tight">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll cue hint for mobile devices */}
        <div className="sm:hidden flex items-center justify-end pr-1 pt-1 text-[10px] text-slate-500 font-['Outfit']">
          <span className="inline-flex items-center gap-0.5">
            Swipe for categories <ChevronRight className="w-3 h-3 text-slate-500" />
          </span>
        </div>
      </div>
    </section>
  );
}
