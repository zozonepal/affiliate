export function LoadingScreen() {
  return (
    <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center px-4 w-full">
      {/* Brand Icon with theme glow and smooth spinner ring */}
      <div className="relative mb-5 flex items-center justify-center">
        {/* Soft orange halo backdrop */}
        <div className="absolute inset-0 rounded-3xl bg-orange-500/15 blur-xl animate-pulse" />
        
        {/* White rounded logo card */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/90 shadow-md p-2.5 flex items-center justify-center z-10">
          <img
            src="/logo.png"
            alt="DealFinder NP Logo"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>

        {/* Orbiting theme spinner ring */}
        <div className="absolute -inset-2 rounded-3xl border-2 border-orange-200 border-t-orange-600 animate-spin" />
      </div>

      {/* Primary Loading Text matching website theme */}
      <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
        <span>Loading DealFinder</span>
        <span className="text-orange-600">NP</span>
        <span className="inline-flex gap-1 ml-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>

      {/* Supporting subtitle */}
      <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 max-w-sm">
        Curating verified tech deals & exclusive Daraz discounts
      </p>

      {/* Animated theme gradient loader bar */}
      <div className="w-48 sm:w-64 h-1.5 bg-slate-200/80 rounded-full overflow-hidden mt-5 relative">
        <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-full w-1/2 animate-[pulse_1s_ease-in-out_infinite]" />
      </div>

      {/* Grid of Skeleton Placeholders matching ProductCard style */}
      <div className="w-full mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 opacity-60">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/70 p-3 flex flex-col justify-between h-64 animate-pulse shadow-2xs"
          >
            <div className="w-full h-36 bg-slate-100 rounded-xl mb-3 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-slate-200/60" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded-md w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded-md w-1/2" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-4 bg-orange-100 rounded-md w-1/3" />
                <div className="h-6 w-14 bg-slate-100 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
