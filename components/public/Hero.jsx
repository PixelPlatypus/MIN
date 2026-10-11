'use client'
import { ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'
import HeroAurora from '@/components/public/HeroAurora'

// Decorative maths symbols floating behind the headline
const GLYPHS = [
  { c: '∑', cls: 'top-[18%] left-[7%] text-7xl text-primary/15', d: '0s' },
  { c: '√x', cls: 'bottom-[15%] right-[13%] text-6xl text-primary/15 hidden md:block', d: '0.6s' },
  { c: '∞', cls: 'top-[13%] right-[30%] text-5xl text-primary/15 hidden lg:block', d: '1.8s' },
  { c: 'Δ', cls: 'top-[56%] left-[4%] text-5xl text-primary/15 hidden lg:block', d: '3s' },
  { c: 'θ', cls: 'top-[60%] right-[4%] text-5xl text-primary/15 hidden lg:block', d: '2s' },
]

export default function Hero({ settings }) {

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-32 md:pt-24 pb-12 overflow-hidden bg-transparent border-b border-black/10 dark:border-white/10">
      <HeroAurora />
      <div aria-hidden className="absolute inset-0 bg-graph pointer-events-none" />
      <div aria-hidden className="absolute inset-0 pointer-events-none select-none font-serif">
        {GLYPHS.map(g => (
          <span key={g.c} className={`absolute animate-float-glyph ${g.cls}`} style={{ animationDelay: g.d }}>{g.c}</span>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-rise inline-flex items-center gap-2 glass px-6 py-2.5 rounded-full text-xs font-bold mb-6 shadow-xl">
            {/* CSS loops run on the compositor; framer's infinite loops ran JS every frame forever */}
            <div className="w-2.5 h-2.5 rounded-full bg-secondary-dark animate-soft-pulse" />
            <span className="uppercase tracking-[0.2em]">
              {settings?.hero_badge}
            </span>
          </div>

          <div className="mb-8">
            <h1 className="animate-rise text-5xl md:text-7xl lg:text-[90px] font-black tracking-tighter leading-[1.1] text-gradient-brand pb-2"
            >
              {settings?.hero_title}
            </h1>
          </div>

          <div className="mb-10 max-w-4xl mx-auto">
            <p className="animate-rise text-xl md:text-2xl text-auto-secondary leading-relaxed font-medium" style={{ animationDelay: '0.1s' }}>
              {settings?.hero_subtitle}
            </p>
          </div>

          <div className="animate-rise flex flex-col sm:flex-row items-center justify-center gap-6" style={{ animationDelay: '0.2s' }}>
            {settings?.hero_cta_link && (
              <Link 
                href={settings.hero_cta_link}
                className="btn-brand w-full sm:w-auto px-12 py-5 text-lg gap-3 group"
              >
                {settings.hero_cta_text}
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-2" />
              </Link>
            )}
            <a
              href="#programs"
              className="btn-brand-outline w-full sm:w-auto px-10 py-5 text-lg gap-3"
            >
              See our programs
            </a>
          </div>
        </div>
      </div>

      {/* Mouse scroll indicator */}
      <div
        className="animate-page-in absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        style={{ animationDelay: '2s' }}
      >
        <div className="w-6 h-10 border-2 scroll-dot-border rounded-full flex justify-center p-2">
          <div className="w-1.5 h-1.5 scroll-dot rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  )
}
