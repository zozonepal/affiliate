export function LoadingScreen() {
  return (
    <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4 w-full font-['Outfit']">
      {/* Brand Icon with theme glow and smooth spinner ring */}
      <div className="relative mb-5 flex items-center justify-center">
        {/* Soft orange halo backdrop */}
        <div className="absolute inset-0 rounded-3xl bg-orange-500/25 blur-xl animate-pulse" />
        
        {/* Rounded logo card */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0B132B] border border-white/10 shadow-lg p-2.5 flex items-center justify-center z-10">
          <img
            src="/logo.png"
            alt="Daraz Deals Nepal Logo"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>

        {/* Orbiting theme spinner ring */}
        <div className="absolute -inset-2 rounded-3xl border-2 border-orange-500/30 border-t-orange-400 animate-spin" />
      </div>

      {/* Primary Loading Text matching website theme */}
      <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black text-white tracking-tight">
        <span>Loading Daraz Deals</span>
        <span className="text-orange-400">Nepal</span>
        <span className="inline-flex gap-1 ml-1 items-center">
          <span className="w-1.5 h-1.5 rounded-xs bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-xs bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-xs bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>

      {/* Supporting subtitle */}
      <p className="text-xs sm:text-sm font-medium text-slate-400 mt-2 max-w-sm">
        Curating verified deals and exclusive discounts across Nepal
      </p>

      {/* Animated theme gradient loader bar */}
      <div className="w-48 sm:w-64 h-1.5 bg-[#131b2e] rounded-sm overflow-hidden mt-5 relative border border-white/5">
        <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 rounded-sm w-1/2 animate-[pulse_1s_ease-in-out_infinite]" />
      </div>

      {/* Grid of Skeleton Placeholders matching ProductCard style */}
      <div className="w-full mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 opacity-40">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0B132B] rounded-2xl border border-white/10 p-3 flex flex-col justify-between h-64 animate-pulse shadow-sm"
          >
            <div className="w-full h-36 bg-[#131b2e] rounded-xl mb-3 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-white/5" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/10 rounded-md w-3/4" />
              <div className="h-2.5 bg-white/5 rounded-md w-1/2" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-4 bg-orange-500/20 rounded-md w-1/3" />
                <div className="h-6 w-14 bg-white/10 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
