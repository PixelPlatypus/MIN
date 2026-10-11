import { Skeleton } from '@/components/ui/Skeleton'

// Shared hero for every public page below the home page: eyebrow pill,
// gradient headline, lead paragraph and optional actions, over the brand
// graph-paper backdrop and glow.
export default function PageHero({ eyebrow, icon, title, description, children, loading = false, animate = true, align = 'center', className = '' }) {
  const centered = align === 'center'
  // CSS entrance (not framer `initial`) so the headline is in the server HTML and paints before hydration
  const fade = (delay) => (animate ? { 'data-rise': '', style: { animationDelay: `${delay}s` } } : {})

  return (
    <section className={`relative isolate pt-36 md:pt-40 pb-16 md:pb-20 overflow-hidden ${className}`}>
      <div aria-hidden className="absolute inset-0 -z-10 hero-glow pointer-events-none" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-graph pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className={`max-w-4xl space-y-6 ${centered ? 'mx-auto text-center' : ''}`}>
          {(eyebrow || loading) && (
            <div {...fade(0)} className={centered ? 'flex justify-center' : ''}>
              <span className="eyebrow">
                {icon}
                {loading ? <Skeleton className="w-24 h-4" /> : eyebrow}
              </span>
            </div>
          )}

          {loading ? (
            <Skeleton className={`w-[80%] h-16 md:h-20 ${centered ? 'mx-auto' : ''}`} />
          ) : (
            <h1 {...fade(0.08)} className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] text-gradient-brand pb-2">
              {title}
            </h1>
          )}

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className={`w-5/6 h-4 ${centered ? 'mx-auto' : ''}`} />
            </div>
          ) : description ? (
            <p {...fade(0.16)} className={`text-lg md:text-xl text-auto-secondary leading-relaxed max-w-3xl ${centered ? 'mx-auto' : ''}`}>
              {description}
            </p>
          ) : null}

          {children && (
            <div {...fade(0.24)} className={`flex flex-col sm:flex-row gap-4 pt-2 ${centered ? 'items-center justify-center' : ''}`}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
