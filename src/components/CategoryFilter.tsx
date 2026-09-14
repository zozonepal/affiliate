import { Layers } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  productCount: number;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  productCount
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-5 pb-2.5 border-b border-slate-200">
      
      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1.5 sm:pb-0 scrollbar-none touch-pan-x -mx-1 px-1">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mr-0.5 shrink-0">
          <Layers className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">Category:</span>
        </div>
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[38px] flex items-center justify-center transition-all duration-150 active:scale-95 shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs scale-102 font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Result Count Indicator */}
      <div className="text-xs font-medium text-slate-500 whitespace-nowrap self-end sm:self-center text-[11px] sm:text-xs">
        Showing <span className="font-bold text-slate-800">{productCount}</span> deals
      </div>

    </div>
  );
}
