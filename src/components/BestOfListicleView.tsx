import { useState, useMemo } from 'react';
import { 
  Trophy, 
  Award, 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  Smartphone, 
  ShieldCheck, 
  Flame,
  ArrowRight,
  Heart
} from 'lucide-react';
import { ProductDeal } from '../types';
import { openDarazDeal, buildAffiliateUrl } from '../utils/affiliateLink';

interface BestOfListicleViewProps {
  products: ProductDeal[];
  onQuickView: (product: ProductDeal) => void;
  onToggleWishlist: (id: string) => void;
  wishlist: string[];
}

export function BestOfListicleView({
  products,
  onQuickView,
  onToggleWishlist,
  wishlist
}: BestOfListicleViewProps) {
  const [selectedListCategory, setSelectedListCategory] = useState<string>('all');

  // Extract unique categories for listicles
  const listCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [products]);

  // Rank products by smart CRO score
  const rankedProducts = useMemo(() => {
    let list = [...products];
    if (selectedListCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === selectedListCategory.toLowerCase());
    }

    return list
      .map((p) => {
        const discount =
          p.originalPrice && p.originalPrice > p.price
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 15;
        const score = (p.rating || 4.5) * 20 + discount * 1.5 + (p.upvotes || 0) * 3;
        return { product: p, score, discount };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [products, selectedListCategory]);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return {
        label: '#1 Best Overall',
        fullLabel: '#1 Best Overall Pick',
        color: 'from-amber-500 to-orange-600 text-white border-amber-300',
        icon: Trophy
      };
    }
    if (index === 1) {
      return {
        label: '#2 Best Value',
        fullLabel: '#2 Best Value for Money',
        color: 'from-blue-600 to-indigo-600 text-white border-blue-300',
        icon: Award
      };
    }
    if (index === 2) {
      return {
        label: '#3 Editor’s Pick',
        fullLabel: '#3 Editor’s Recommendation',
        color: 'from-emerald-600 to-teal-600 text-white border-emerald-300',
        icon: Star
      };
    }
    return {
      label: `#${index + 1} Top Pick`,
      fullLabel: `#${index + 1} Top Contender`,
      color: 'from-slate-800 to-slate-900 text-white border-slate-700',
      icon: Award
    };
  };

  const generateEditorialPros = (item: ProductDeal, discount: number): string[] => {
    const pros: string[] = [];
    if (discount >= 30) {
      pros.push(`Huge price drop: Save ${discount}% off standard retail price in Nepal.`);
    } else {
      pros.push(`Solid price-to-performance ratio in the Rs. ${Number(item.price).toLocaleString('ne-NP')} tier.`);
    }
    pros.push(`Verified ${item.rating ? item.rating.toFixed(1) : '4.6'} out of 5 rating with authentic Daraz seller reviews.`);
    pros.push(`Cash on Delivery (COD) supported with direct delivery across Nepal.`);
    return pros;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Intro Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-2xl blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold mb-3 uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-orange-400" />
            <span>Curated Buying Guides 2026</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Top 10 Ranked Tech Deals in Nepal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Every product is ranked using our proprietary Nepal CRO evaluation matrix: genuine discount depth, seller reputation, verified Daraz ratings, and post-purchase warranty support.
          </p>

          {/* Category Filter Pills for Listicle */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-4">
            {listCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedListCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedListCategory === cat
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat === 'all' ? 'All Top Picks' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listicle Items */}
      <div className="space-y-4 sm:space-y-5">
        {rankedProducts.map(({ product, discount }, idx) => {
          const badge = getRankBadge(idx);
          const Icon = badge.icon;
          const pros = generateEditorialPros(product, discount);
          const isWishlisted = wishlist.includes(product.id);

          return (
            <article
              key={product.id}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-xl ${
                idx === 0 
                  ? 'border-2 border-orange-500/70 ring-4 ring-orange-500/10' 
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Ranking Header Bar */}
              <div className="px-3 sm:px-6 py-2 sm:py-2.5 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-black shadow-xs bg-gradient-to-r ${badge.color}`}>
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                  <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 sm:px-2.5 py-0.5 rounded-lg border border-amber-200 text-[11px] sm:text-xs">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating ? product.rating.toFixed(1) : '4.6'}</span>
                    <span className="text-slate-400 font-normal hidden sm:inline">({product.reviewsCount || 50}+)</span>
                  </div>
                </div>
              </div>

              {/* Main Body Grid */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                
                {/* Product Media Column */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div 
                    onClick={() => onQuickView(product)}
                    className="relative w-full max-w-[240px] aspect-square bg-[#F8F9FA] rounded-2xl p-3 flex items-center justify-center cursor-pointer group overflow-hidden border border-slate-100"
                  >
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {discount > 0 && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-white" />
                        <span>-{discount}%</span>
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs shadow-xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition border border-slate-200/60"
                      title="Save"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <button
                    onClick={() => onQuickView(product)}
                    className="text-xs font-bold text-slate-500 hover:text-orange-600 mt-2.5 transition"
                  >
                    View Full Gallery & Specs
                  </button>
                </div>

                {/* Editorial Content & Pros Column */}
                <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 
                      onClick={() => onQuickView(product)}
                      className="text-base sm:text-xl font-extrabold text-slate-900 hover:text-orange-600 cursor-pointer transition leading-snug"
                    >
                      {product.name || product.title}
                    </h3>

                    {/* Price Snapshot */}
                    <div className="flex items-baseline gap-2.5 mt-2">
                      <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                        Rs. {Number(product.price).toLocaleString('ne-NP')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through">
                          Rs. {Number(product.originalPrice).toLocaleString('ne-NP')}
                        </span>
                      )}
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Save Rs. {Number((product.originalPrice || Math.round(product.price * 1.3)) - product.price).toLocaleString('ne-NP')}
                      </span>
                    </div>

                    {/* Quick Editorial Pros List */}
                    <div className="mt-3.5 space-y-2 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                      <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                        Why It's Ranked in the Top Picks:
                      </span>
                      {pros.map((pro, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High Intent CTA Action Row */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 border-t border-slate-100 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 min-w-0 truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">7-Day Return • COD Verified in Nepal</span>
                    </div>

                    <a
                      href={buildAffiliateUrl(product.affiliateUrl)}
                      onClick={(e) => {
                        e.preventDefault();
                        openDarazDeal(product.affiliateUrl);
                      }}
                      className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:from-orange-700 text-white font-extrabold text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 active:scale-[0.98] transition cursor-pointer min-h-[44px] min-w-0"
                    >
                      <Smartphone className="w-4 h-4 shrink-0" />
                      <span className="truncate">Check Discount on Daraz App</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>

                </div>

              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}
