export default function TeamProfileLoading() {
  return (
    <div className="relative min-h-screen bg-bg-main dark:bg-bg-main-dark">
      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-24 items-start">
          
          {/* Left Column Skeleton */}
          <div className="lg:sticky lg:top-24 space-y-8">
            <div className="relative w-full aspect-[4/5] rounded-[3rem] bg-bg-secondary dark:bg-white/5 animate-pulse border border-white/10" />
            
            <div className="space-y-4">
              <div className="h-12 w-3/4 bg-bg-secondary dark:bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-6 w-1/2 bg-bg-secondary dark:bg-white/5 rounded-xl animate-pulse opacity-60" />
            </div>

            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-bg-secondary dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-16 py-12 lg:py-0">
            {/* Bio Section */}
            <div className="space-y-4">
              <div className="h-4 w-24 bg-primary/20 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-bg-secondary dark:bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-full bg-bg-secondary dark:bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-bg-secondary dark:bg-white/5 rounded animate-pulse" />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="h-32 rounded-[2rem] bg-bg-secondary dark:bg-white/5 animate-pulse border border-white/5" />
              <div className="h-32 rounded-[2rem] bg-bg-secondary dark:bg-white/5 animate-pulse border border-white/5" />
            </div>

            {/* Role History */}
            <div className="space-y-6">
              <div className="h-6 w-32 bg-bg-secondary dark:bg-white/5 rounded animate-pulse" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 rounded-[2rem] bg-bg-secondary dark:bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            </div>

            {/* Certificate */}
            <div className="space-y-6">
              <div className="h-6 w-32 bg-bg-secondary dark:bg-white/5 rounded animate-pulse" />
              <div className="h-96 rounded-[3rem] bg-bg-secondary dark:bg-white/5 animate-pulse border border-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
