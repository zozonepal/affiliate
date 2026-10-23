import { LayoutGrid, Trophy, Scale, Zap } from 'lucide-react';
import { ActiveViewMode } from '../types';

interface ViewSwitcherTabsProps {
  activeView: ActiveViewMode;
  onViewChange: (view: ActiveViewMode) => void;
  totalProductsCount: number;
  compareCount: number;
}

export function ViewSwitcherTabs({
  activeView,
  onViewChange,
  totalProductsCount,
  compareCount
}: ViewSwitcherTabsProps) {
  const tabs: {
    id: ActiveViewMode;
    label: string;
    mobileLabel: string;
    icon: typeof LayoutGrid;
    badge?: string | number;
  }[] = [
    {
      id: 'grid',
      label: 'All Deals',
      mobileLabel: 'All Deals',
      icon: LayoutGrid,
      badge: totalProductsCount > 0 ? `${totalProductsCount}` : undefined
    },
    {
      id: 'best-of',
      label: 'Top 10 Rankings',
      mobileLabel: 'Top 10',
      icon: Trophy,
      badge: '10'
    },
    {
      id: 'megadeals',
      label: 'Megadeals Hub',
      mobileLabel: 'Megadeals',
      icon: Zap,
      badge: 'Flash'
    }
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/80 p-1.5 shadow-2xs mb-4">
      <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-center sm:gap-2 w-full">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onViewChange(tab.id)}
              className={`w-full sm:w-auto sm:flex-1 min-h-[40px] px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-between sm:justify-center gap-2 transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/60'
              }`}
              aria-pressed={isActive}
            >
              {/* Left Side: Icon & Title */}
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-orange-400' : 'text-orange-600'
                  }`}
                />
                <span className="tracking-tight truncate text-left">
                  <span className="sm:hidden">{tab.mobileLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </div>

              {/* Right Side: Minimalist Badge */}
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 tabular-nums ${
                    isActive
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
