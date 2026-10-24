import { useState, useMemo, type ChangeEvent } from 'react';
import { 
  Headphones, 
  Watch, 
  Flame, 
  Smartphone, 
  Speaker, 
  Search, 
  X, 
  Check, 
  Rocket, 
  ArrowRight, 
  Sparkles, 
  SlidersHorizontal, 
  Zap, 
  ShieldCheck, 
  ArrowLeft,
  User as UserIcon,
  ChevronRight,
  Mic,
  Tag
} from 'lucide-react';
import { UserAccount, ProductDeal } from '../types';

export interface CategoryCardData {
  id: string;
  name: string;
  subTitle: string;
  dealsCount: number;
  dealCountText: string;
  badge: string;
  badgeColor: 'flame' | 'trending' | 'day' | 'highDemand' | 'topRated' | 'clearance' | 'newDrop';
  icon: typeof Headphones;
  imageUrl: string;
  searchTags: string[];
  filterTags: Array<'popular' | 'tech' | 'new'>;
  mappedCategory: string; // connects to catalog categories
}

export const GATEWAY_CATEGORIES: CategoryCardData[] = [
  {
    id: 'earbuds',
    name: 'Earbuds',
    subTitle: 'boAt, Ultima, Asta Wolf ANC & ENC earbuds',
    dealsCount: 5,
    dealCountText: '5 Curated Drops',
    badge: '🔥 Top Selling',
    badgeColor: 'flame',
    icon: Headphones,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNVVd7j0kXrHG_npCkBqw4KyqsMh6zyErQCHKK5puBKkKTDMUnQI-nGophVAmnJDJ6-limO2wl3Da4QpDIu87KSxgmB1Nc2TjpASPEYJNMamFey4O6tW0C-9OkqDYkRgnypmSNpLCa5Fb-q2BPdPjvo2-7Yzo3LaDA7k3f1I3qyMsD1A64laLXchVfS6meVQeWbw-ewL3SUhfVrDRb2--tSbG9l5idPuaIvZ3fm5A',
    searchTags: ['Earbuds', 'Wireless Earbuds', 'boAt', 'Ultima', 'Asta Wolf', 'ANC', 'TWS', 'Bluetooth'],
    filterTags: ['popular', 'tech'],
    mappedCategory: 'Earbuds'
  },
  {
    id: 'headphones',
    name: 'Headphones',
    subTitle: 'Fantech gaming headsets, Soundcore ANC over-ear',
    dealsCount: 9,
    dealCountText: '9 Curated Drops',
    badge: '⚡ Hi-Res Audio',
    badgeColor: 'flame',
    icon: Headphones,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAo1hlbrsHOg49xbpKJPdOIJWbrIaHDsXYu7ODPNpocDX5H3AweO4VCHVKMMDfmOOu3yQe8gMctl8dFcpnivp99WIeonxORDECqdLPk4mNKeuyqoLoXdLlyRfaU_UTJJd2MpWmj3Mmo2HJNXQ_EMkcWdUs0aQ4JnZLmja8_ngux9IShkpNTU7F1Y7fJSUD13DTcH0L6wzlqDC_Tey8cvdz8UN4JIEE6_qeRRO8B4sQ',
    searchTags: ['Headphones', 'Fantech', 'Soundcore', 'Gaming Headset', 'Over Ear', 'ANC', 'Surround Sound'],
    filterTags: ['popular', 'tech'],
    mappedCategory: 'Headphones'
  },
  {
    id: 'smartwatch',
    name: 'Smartwatch',
    subTitle: 'Ultima AMOLED, Alewa metallic, BT calling',
    dealsCount: 5,
    dealCountText: '5 Curated Drops',
    badge: 'Deal of the Day',
    badgeColor: 'day',
    icon: Watch,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQyWd1FAe3Ekg4jATM3sU7ARoqx59mKgJ8mJFkV2Lx2470Ri3BmqqLwt6xEA3gZBT03MBUlhkzPVyO6lcHJ2mnYaNx0HvYYXBkk4ZeE5RiUdgNYsMSynDUXbG0MAjnIxaevkMUPZCFrvjx4tqyI9DKHadP6KKg8o0PnAJdVk-1Vvl5vqyMn45cbNApeVj7pbXwKOd6nd9khDb3R6f7SIzbS_HmijtPciMmaXTGCt8',
    searchTags: ['Smartwatch', 'Ultima Watch', 'Alewa', 'AMOLED', 'BT Calling', 'Health', 'Fitness', 'Kids Watch'],
    filterTags: ['popular', 'tech', 'new'],
    mappedCategory: 'Smartwatch'
  },
  {
    id: 'power',
    name: 'Power & Cables',
    subTitle: 'MagSafe powerbanks 10K–50K mAh, 22.5W fast charge',
    dealsCount: 6,
    dealCountText: '6 Curated Drops',
    badge: 'High Demand',
    badgeColor: 'highDemand',
    icon: Zap,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiia0vVGTchKG2bDSx5ntZstKAevxyHcpe0RYQ2bXEuG-2rOkblT4z2dHbGC8tL7efn3DdDzFfhhLJ-KGzTPG6JbrCRl66vn_yADZrSdWUPLyvfuCo9riTrCyIvjWl4xUTgBxOxyGPbBaOib9_ue8aP_IMnY2bdOKFF9DAGq1j50AdcfkHEINAOoT4yv3JI14QIWq_cM3z0cDvDbuKfePpNJbVqKtyjQ1pozJewGg',
    searchTags: ['Power & Cables', 'Powerbank', 'Ultima Boost', 'Mypower', 'MagSafe', 'Fast Charging', 'Type-C'],
    filterTags: ['popular', 'tech'],
    mappedCategory: 'Power & Cables'
  },
  {
    id: 'speakers',
    name: 'Speakers',
    subTitle: 'Soundcore portable audio, TCL Dolby soundbars',
    dealsCount: 3,
    dealCountText: '3 Curated Drops',
    badge: 'Top Rated',
    badgeColor: 'topRated',
    icon: Speaker,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoA3TkGbKWi4pzNSDKqKOR95VIZgev8F62L41GMe2q40D1xPBiZYO0m0zAFQKG07XD4KAdYz12Iy1C6dozh6KOGNWMXLo9Uo5v_p6US67lubhmahJxCeHiFhLsar3iCqCZaSR0MVWccJwVFQ5aZtzwIbvFmnqhkzGUrLdjtlcMAM3eMP_vUo4RXg-x3Ab6-oPX00y8cXZgY95TU422Ei0IUe8lno8EruW1TBz5050',
    searchTags: ['Speakers', 'Bluetooth Speaker', 'Soundbar', 'TCL', 'Soundcore', 'Subwoofer', 'Osaka'],
    filterTags: ['popular', 'tech'],
    mappedCategory: 'Speakers'
  },
  {
    id: 'mic',
    name: 'Mic',
    subTitle: 'Green Vocal Core Pro wireless ENC studio mics',
    dealsCount: 1,
    dealCountText: '1 Studio Drop',
    badge: 'Pro Grade',
    badgeColor: 'newDrop',
    icon: Mic,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3UsMF8QR5cZODFaQgNUWRASUSLtUX45Ppz19fG9YoN2kW40o9aX5K4aA1VCEFYNC87Wo0MIjlPtSYnm_caTz601ZlipL6pgdGpoWrpc-eLAYtWv7plBpsBhp4o8U9rznX6Cnw6NEdivq0xaI7n7zEyNvkE1ULSTieVVgoxVUx4mXUWuiwVyBMW0MryX2__685cOEYgMduAm2yHEqeLzlNzRzUtHz4tOaiavECo8',
    searchTags: ['Mic', 'Microphone', 'Wireless Mic', 'ENC', 'Green Vocal Core', 'Audio Recording'],
    filterTags: ['tech', 'new'],
    mappedCategory: 'Mic'
  },
  {
    id: 'appliances',
    name: 'Appliances',
    subTitle: 'M8 Retro game console with 20,000+ classic games',
    dealsCount: 1,
    dealCountText: '1 Retro Drop',
    badge: 'Retro Special',
    badgeColor: 'trending',
    icon: Sparkles,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Cwnmgv3N5Y9vIFk2fSQuRwoT3gJVbY3wUE6EnNGEsee-StDVV2cFNT-u8gXRmEtjixhHQ3ES_bZ6uhwaW7PyoE4IKq0QYfvDUc71R1h1LsFoNRnASPmjCH4cVOialHnfMksJCB78UithkoJrGWuI-GWWMuSAOU19RUFFCYq4fgbePUiBAU5PDpbNRC-4VKIEZOFcc5pf71QciKyBs27V_nv-xbFckzIJYuXZbw4',
    searchTags: ['Appliances', 'M8 Retro Game Console', 'Wireless Controllers', 'Video Games'],
    filterTags: ['popular'],
    mappedCategory: 'Appliances'
  },
  {
    id: 'all',
    name: 'All Tech Deals',
    subTitle: 'Explore all 30 handpicked Daraz Nepal deals',
    dealsCount: 30,
    dealCountText: '30 Verified Drops',
    badge: 'Full Access',
    badgeColor: 'flame',
    icon: Flame,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD-TRNe39shErlCL9sa1FGvfekuimI9wLDU55hB3FGlaQy2WJkbzrx-W2sgGjcstKLsjDTNvJ33murMo_-4-uMCHwTCwIX3jMia5FMl0QwyupzKt7_n-pmrOd0gB-UNvow57IvNslvJIRWMChdno5et7ds3TpZVZohgxatDeeQIg-m_fwn-ghcowFVoIFz30LDCS5eIjVq7OutAxbZdDb04u22pSbqRHTrJRM3oWY',
    searchTags: ['All', 'Full Catalog', 'Best Deals', 'Daraz Nepal'],
    filterTags: ['popular'],
    mappedCategory: 'All'
  }
];

type QuickFilterType = 'all' | 'popular' | 'tech' | 'new';

interface CategorySelectionGatewayProps {
  user?: UserAccount | null;
  deals?: ProductDeal[];
  onComplete: (selectedCategories: string[]) => void;
  onSkip: () => void;
  initialSelected?: string[];
}

export function CategorySelectionGateway({
  user,
  deals = [],
  onComplete,
  onSkip,
  initialSelected = ['earbuds', 'headphones', 'smartwatch']
}: CategorySelectionGatewayProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(initialSelected));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<QuickFilterType>('all');

  // Compute live deal counts for each card dynamically if live deals are available
  const getLiveCount = (mappedCat: string): number => {
    if (!deals || deals.length === 0) return 0;
    if (mappedCat === 'All') return deals.length;
    return deals.filter(
      (d) => (d.category || '').toLowerCase().trim() === mappedCat.toLowerCase().trim()
    ).length;
  };

  // Toggle single card
  const toggleCategory = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all or deselect all
  const toggleSelectAll = () => {
    if (selectedIds.size === GATEWAY_CATEGORIES.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(GATEWAY_CATEGORIES.map((c) => c.id)));
    }
  };

  // Filtered categories based on search query and quick filter chips
  const filteredCategories = useMemo(() => {
    return GATEWAY_CATEGORIES.filter((category) => {
      // 1. Quick filter chip check
      if (activeFilter !== 'all' && !category.filterTags.includes(activeFilter)) {
        return false;
      }
      // 2. Search query check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = category.name.toLowerCase().includes(q);
      const matchSub = category.subTitle.toLowerCase().includes(q);
      const matchTags = category.searchTags.some((tag) => tag.toLowerCase().includes(q));
      return matchName || matchSub || matchTags;
    });
  }, [searchQuery, activeFilter]);

  const selectedCount = selectedIds.size;
  const isAllSelected = selectedCount === GATEWAY_CATEGORIES.length;

  const handleContinue = () => {
    // If 'all' is chosen or all categories selected, show all deals
    if (selectedIds.has('all') || selectedIds.size === GATEWAY_CATEGORIES.length) {
      onComplete(['All']);
      return;
    }

    // Map selected gateway category IDs to the actual catalog categories
    const mapped: string[] = Array.from<string>(selectedIds)
      .map((id: string): string => {
        const item = GATEWAY_CATEGORIES.find((c) => c.id === id);
        return item ? item.mappedCategory : id;
      })
      .filter((cat) => cat !== 'All');

    if (mapped.length === 0) {
      onComplete(['All']);
    } else {
      onComplete(mapped);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0b1326] text-[#dae2fd] font-['Hanken_Grotesk'] antialiased selection:bg-orange-500 selection:text-white pb-32 sm:pb-36 overflow-x-hidden">
      
      {/* Dynamic Ambient Glow Backdrops */}
      <div 
        aria-hidden="true" 
        className="fixed top-20 right-0 -mr-24 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-orange-500/10 blur-[100px] pointer-events-none -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="fixed top-96 left-0 -ml-28 w-64 sm:w-72 h-64 sm:h-72 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none -z-10" 
      />

      {/* 1. STICKY TOP APP BAR */}
      <header className="sticky top-0 w-full z-40 bg-[#0b1326]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_1px_12px_rgba(0,0,0,0.35)]">
        <div className="max-w-4xl mx-auto h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2.5">
          
          {/* Brand Logo & Back to Deals */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSkip}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-slate-300 hover:text-orange-400 hover:bg-white/5 transition active:scale-95 cursor-pointer"
              aria-label="Skip to deals"
              title="Skip to all deals"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200/90 p-0.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                <img src="/logo.png" alt="Daraz Deals Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-['Outfit'] font-black text-sm sm:text-base text-white tracking-tight">
                Daraz Deals<span className="text-orange-500">NP</span>
              </span>
            </div>
          </div>

          {/* Right Status / User Avatar */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-['Outfit'] text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              Personalize
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5 text-slate-950" />}
            </div>
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 flex flex-col gap-4 sm:gap-5">
        
        {/* Onboarding Progress Tracker */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-['Outfit'] font-bold text-orange-400 tracking-wider uppercase text-[10px] sm:text-[11px]">
              Personalize Feed • Step 1 of 2
            </span>
            <span className="font-['Outfit'] font-medium text-slate-400 flex items-center gap-1.5 text-[10px] sm:text-[11px]">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              {deals.length > 0 ? `${deals.length} Live Drops` : 'Live Drops Ready'}
            </span>
          </div>

          {/* Progress Segment Bars */}
          <div className="grid grid-cols-2 gap-2 w-full h-1 sm:h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
            <div className="h-full bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Title & Intro Context */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          <div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-400">
            <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span className="font-['Outfit'] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Curated Onboarding</span>
          </div>

          <h1 className="font-['Outfit'] font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-tight">
            What deals are you hunting for today?
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Choose categories to personalize your daily flash discounts, verified drops, and price-tracked deals.
          </p>
        </div>

        {/* Search Input Container */}
        <div className="relative flex items-center w-full h-10 sm:h-11 bg-[#131b2e] rounded-xl sm:rounded-full px-3.5 border border-white/10 focus-within:border-orange-400/80 focus-within:ring-2 focus-within:ring-orange-400/20 shadow-xs transition">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search earbuds, smartwatch, powerbanks, audio..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips Horizontal Scroller */}
        <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-1.5 pt-0.5 pb-0.5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-1 px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-['Outfit'] font-semibold shrink-0 transition active:scale-95 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black shadow-xs'
                : 'bg-[#171f33] text-slate-200 hover:bg-[#222a3d] border border-white/5'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>All ({GATEWAY_CATEGORIES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('popular')}
            className={`flex items-center gap-1 px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-['Outfit'] font-semibold shrink-0 transition active:scale-95 cursor-pointer ${
              activeFilter === 'popular'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black shadow-xs'
                : 'bg-[#171f33] text-slate-200 hover:bg-[#222a3d] border border-white/5'
            }`}
          >
            <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
            <span>Popular</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('tech')}
            className={`flex items-center gap-1 px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-['Outfit'] font-semibold shrink-0 transition active:scale-95 cursor-pointer ${
              activeFilter === 'tech'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black shadow-xs'
                : 'bg-[#171f33] text-slate-200 hover:bg-[#222a3d] border border-white/5'
            }`}
          >
            <Smartphone className="w-3 h-3 text-indigo-400" />
            <span>Tech Audio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('new')}
            className={`flex items-center gap-1 px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-['Outfit'] font-semibold shrink-0 transition active:scale-95 cursor-pointer ${
              activeFilter === 'new'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black shadow-xs'
                : 'bg-[#171f33] text-slate-200 hover:bg-[#222a3d] border border-white/5'
            }`}
          >
            <Tag className="w-3 h-3 text-orange-400" />
            <span>New Drops</span>
          </button>
        </div>

        {/* Live Counter Status Line */}
        <div className="flex items-center justify-between text-xs px-0.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-['Outfit'] text-[11px]">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>Tap cards to select your personalized feed</span>
          </div>

          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-orange-400 hover:text-orange-300 font-['Outfit'] font-bold text-xs tracking-tight cursor-pointer active:scale-95 transition"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* 3. CATEGORY GRID (2 columns on mobile, 3-4 columns on desktop) */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 w-full">
            {filteredCategories.map((card) => {
              const isSelected = selectedIds.has(card.id);
              const Icon = card.icon;
              const liveCount = deals && deals.length > 0 ? getLiveCount(card.mappedCategory) : card.dealsCount;
              const countText = liveCount > 0 ? `${liveCount} Curated Drops` : card.dealCountText;

              return (
                <article
                  key={card.id}
                  onClick={() => toggleCategory(card.id)}
                  className={`group relative flex flex-col justify-between p-2.5 sm:p-3.5 rounded-2xl transition-all duration-200 cursor-pointer select-none active:scale-[0.98] min-h-[160px] sm:min-h-[185px] overflow-hidden ${
                    isSelected
                      ? 'bg-[#1E293B] border-2 border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.25)]'
                      : 'bg-[#0B132B] border border-white/8 hover:border-white/20 hover:bg-[#131b2e] shadow-xs'
                  }`}
                >
                  {/* Active Ambient Overlay */}
                  {isSelected && (
                    <div 
                      aria-hidden="true" 
                      className="absolute inset-0 bg-orange-400/10 pointer-events-none" 
                    />
                  )}

                  {/* Top Badges & Selector Checkbox */}
                  <div className="flex items-start justify-between relative z-10 gap-1">
                    <span 
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-['Outfit'] text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs ${
                        card.badgeColor === 'flame'
                          ? 'bg-orange-600 text-white'
                          : card.badgeColor === 'flash'
                          ? 'bg-indigo-600 text-white'
                          : card.badgeColor === 'day'
                          ? 'bg-sky-600/90 text-white'
                          : card.badgeColor === 'highDemand'
                          ? 'bg-amber-600 text-white'
                          : card.badgeColor === 'clearance'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-orange-300 border border-white/10'
                      }`}
                    >
                      {card.badge}
                    </span>

                    <div 
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isSelected
                          ? 'bg-orange-400 text-slate-950 shadow-[0_0_10px_rgba(251,146,60,0.8)]'
                          : 'bg-slate-800/90 text-transparent border border-white/20'
                      }`}
                    >
                      <Check className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] ${isSelected ? 'text-slate-950' : 'text-transparent'}`} />
                    </div>
                  </div>

                  {/* Icon & Preview Image Group */}
                  <div className="flex items-center gap-2 pt-2 relative z-10">
                    <div 
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${
                        isSelected 
                          ? 'bg-orange-400/20 text-orange-400' 
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>

                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                      <img 
                        src={card.imageUrl} 
                        alt={card.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Content Meta */}
                  <div className="flex flex-col pt-1.5 relative z-10">
                    <h2 className="font-['Outfit'] font-bold text-xs sm:text-sm text-white tracking-tight leading-snug truncate">
                      {card.name}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {card.subTitle}
                    </p>
                    <span 
                      className={`font-['Outfit'] text-[10px] sm:text-[11px] font-semibold pt-0.5 ${
                        isSelected ? 'text-orange-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {countText}
                    </span>
                  </div>

                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Search Feedback */
          <div className="py-10 flex flex-col items-center justify-center text-center bg-[#0B132B]/60 rounded-2xl border border-white/8 p-5">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-base text-white">No matching categories found</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Try searching for &quot;earbuds&quot;, &quot;smartwatch&quot;, &quot;powerbanks&quot;, or &quot;audio&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-3 px-3.5 py-1.5 rounded-full bg-orange-500 text-slate-950 font-['Outfit'] font-bold text-xs hover:bg-orange-400 transition active:scale-95 cursor-pointer"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}

        {/* 4. VALUE PERKS FOOTNOTE BANNER */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#131b2e] border border-white/8 flex items-center justify-between gap-2.5 shadow-inner mt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Outfit'] font-bold text-xs sm:text-sm text-white">
                100% Authentic Daraz Nepal Drops
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400">
                Direct verified seller links with Cash on Delivery (COD)
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
        </div>

      </main>

      {/* 5. BOTTOM STICKY ACTION DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B132B]/95 backdrop-blur-xl border-t border-white/10 px-3 sm:px-4 pt-2.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-md mx-auto flex flex-col gap-1.5">
          
          {/* Selection Counter Strip */}
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              <span className="font-['Outfit'] font-bold text-white text-xs">
                {selectedCount === 1 ? '1 category selected' : `${selectedCount} categories selected`}
              </span>
            </div>
            <span className="font-['Outfit'] font-semibold text-orange-400 text-[11px] tracking-tight">
              Live Feed Configured
            </span>
          </div>

          {/* Primary High-Impact CTA Button */}
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={handleContinue}
            className={`w-full h-11 sm:h-12 rounded-xl sm:rounded-full font-['Outfit'] font-black text-xs sm:text-sm flex items-center justify-between px-4 sm:px-5 transition-all duration-200 transform cursor-pointer ${
              selectedCount > 0
                ? 'bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-slate-950 shadow-[0_4px_20px_rgba(251,146,60,0.35)] hover:brightness-105 active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <Rocket className="w-4 h-4 fill-slate-950 text-slate-950 shrink-0" />
              <span className="truncate">
                {selectedCount > 0
                  ? `Continue to Daraz Deals (${selectedCount})`
                  : 'Select at least 1 category'}
              </span>
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <span className="px-1.5 py-0.5 rounded-md bg-slate-950 text-orange-400 font-['Outfit'] text-[9px] font-black uppercase tracking-wider">
                Up to 70%
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>

          {/* Skip Button and Assurance Footnote */}
          <div className="flex flex-col items-center gap-0.5 pt-0.5">
            <button
              type="button"
              onClick={onSkip}
              className="font-['Outfit'] text-[11px] font-bold text-slate-400 hover:text-white transition py-0.5 active:scale-95 cursor-pointer underline underline-offset-2"
            >
              Skip and explore all deals
            </button>
            <p className="text-[9px] text-slate-400 text-center tracking-tight">
              You can change or reset your category preferences anytime in the header.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
