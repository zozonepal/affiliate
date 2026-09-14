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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-2 border-b border-slate-200">
      
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Category:</span>
        </div>
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs scale-102'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Result Count Indicator */}
      <div className="text-xs font-medium text-slate-500 whitespace-nowrap self-end sm:self-center">
        Showing <span className="font-bold text-slate-800">{productCount}</span> deals
      </div>

    </div>
  );
}
