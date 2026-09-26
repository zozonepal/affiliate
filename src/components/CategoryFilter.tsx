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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/80">
      
      {/* Category Segmented Slider */}
      <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100/80 rounded-2xl no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap min-h-[34px] flex items-center justify-center transition-all duration-150 active:scale-95 shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Result Count */}
      <div className="text-xs font-medium text-slate-500 whitespace-nowrap self-end sm:self-center tabular-nums">
        <span className="font-extrabold text-slate-900">{productCount}</span> deals available
      </div>

    </div>
  );
}
