'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Heart, Users, Globe } from 'lucide-react'
import VoronoiCanvas from '@/components/shared/VoronoiCanvas'

const features = [
  { icon: Target, title: 'Discover Talent', desc: 'Identify mathematically gifted students across all seven provinces through district and national olympiads.' },
  { icon: Heart, title: 'Train Champions', desc: 'Intensive camps, mentorship, and world-class resources to prepare students for international competition.' },
  { icon: Users, title: 'Build Community', desc: 'A growing network of educators, alumni, and volunteers passionate about mathematics in Nepal.' },
  { icon: Globe, title: 'Bridge the Gap', desc: 'Making world-class mathematics education accessible regardless of geography or economic background.' },
]

export default function Hero({ settings }) {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)
  const flagRef = useRef(null)

  useEffect(() => { setVisible(true) }, [])

  useEffect(() => {
    let ctx
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (sectionRef.current) {
          gsap.to(sectionRef.current, { y: -30, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true } })
        }
        if (flagRef.current) {
          gsap.to(flagRef.current, {
            rotate: 3, y: -20, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
          })
        }
      })
    })
    return () => ctx?.revert()
  }, [])

  const subtitle = settings?.hero_subtitle || 'Igniting curiosity and fostering excellence across Nepal. We\'re building a future where every student views mathematics as a tool for innovation.'

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      <VoronoiCanvas className="opacity-35" />
      <div className="absolute inset-0 math-grid opacity-[0.06]" />

      {/* Nepal flag — visual centroid at 63.7% height (not 50%) accounts for double-pennant shape */}
      <div
        ref={flagRef}
        className="hidden lg:block absolute right-[11%] xl:right-[15%] top-1/2 -translate-y-[80%] w-56 xl:w-64 z-0 pointer-events-none will-change-transform"
        aria-hidden="true"
      >
        <div className="animate-flag-wave origin-bottom-right">
          <svg viewBox="0 0 384 491" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto opacity-55 drop-shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
            <path d="M6.22 484.57L369.32 484.56L131.66 243.55L378.27 243.84L6.24 6.22L6.22 484.57Z" fill="#D4253E" stroke="#000063" strokeWidth="12.43" />
            <path d="M142.12 179.34L131.26 187.38L136.61 191.80C149.61 181.75 158.86 172.57 166.09 157.33C167.78 177.67 149.14 223.33 100.21 223.84C47.84 223.79 29.66 175.34 31.68 156.47C41.31 173.92 47.18 182.44 62.28 191.52L66.90 187.28L56.67 178.76L69.84 175.34L62.76 163.41L76.55 164.42L74.82 150.53L86.91 157.61L90.69 144.68L99.38 155.09L107.52 145.22L111.95 158.63L123.26 150.77L121.81 164.41L135.35 162.82L129.00 175.43L142.12 179.34Z" fill="white" />
            <polygon points="296.98,523.24 275.95,530.38 292.40,546.25 270.24,544.79 279.37,565.75 259.46,555.93 259.87,578.78 245.23,562.08 236.86,583.36 229.73,562.33 213.86,578.78 215.31,556.62 194.36,565.75 204.18,545.84 181.32,546.25 198.02,531.61 176.75,523.24 197.78,516.11 181.32,500.24 203.48,501.69 204.18,545.84 181.32,546.25 198.02,531.61 176.75,523.24 197.78,516.11 181.32,500.24 203.48,501.69 213.86,467.70 228.50,484.40 236.86,463.13 244.00,484.16 259.87,467.70 258.41,489.86 279.37,480.74 269.55,500.65 292.40,500.24 275.70,514.88" fill="white" transform="matrix(1.2301,0,0,1.1997,-192.12,-271.36)" />
          </svg>
        </div>
        {/* Math symbols fading in/out from flag center */}
        <span className="absolute top-1/2 left-1/2 emit-glyph emit-glyph-1 font-identity text-headline text-xl pointer-events-none select-none" aria-hidden="true">∫</span>
        <span className="absolute top-1/2 left-1/2 emit-glyph emit-glyph-2 font-identity text-headline text-xl pointer-events-none select-none" aria-hidden="true">∑</span>
        <span className="absolute top-1/2 left-1/2 emit-glyph emit-glyph-3 font-identity text-headline text-xl pointer-events-none select-none" aria-hidden="true">π</span>
        <span className="absolute top-1/2 left-1/2 emit-glyph emit-glyph-4 font-identity text-headline text-xl pointer-events-none select-none" aria-hidden="true">∞</span>
        <span className="absolute top-1/2 left-1/2 emit-glyph emit-glyph-5 font-identity text-headline text-xl pointer-events-none select-none" aria-hidden="true">√</span>
        <span className="absolute top-1/2 left-1/2 emit-glyph emit-glyph-6 font-identity text-headline text-xl pointer-events-none select-none" aria-hidden="true">Δ</span>
        <span className="absolute top-1/2 left-1/2 emit-glyph emit-glyph-7 font-identity text-headline text-xl pointer-events-none select-none" aria-hidden="true">∂</span>
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <div className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold animate-pulse" />
              {settings?.hero_badge || 'Mathematics Initiatives in Nepal'}
            </span>
          </div>

          <h1 className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-text-primary-dynamic">Elevating</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-accent">Nepal</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-headline">Through Mathematics.</span>
          </h1>

          <div className={`transition-all duration-700 delay-[600ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="mt-8 text-lg md:text-xl text-text-secondary-dynamic leading-relaxed max-w-2xl">{subtitle}</p>
          </div>

          <div className={`transition-all duration-700 delay-[800ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link href={settings?.hero_cta_link || '/join'}
                className="inline-flex items-center gap-2 bg-headline text-bg px-8 py-4 rounded-xl font-bold text-base transition-all hover:bg-accent hover:shadow-xl hover:shadow-accent/25 group">
                Join the Movement
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-sm text-text-tertiary-dynamic flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-marigold" />
                Founded 2020 &middot; HundrED Top 100 &middot; 7 Provinces
              </span>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-[1000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="bg-surface border border-border-dynamic rounded-xl p-5 hover:border-marigold/30 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-xl bg-marigold/5 border border-marigold/10 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-marigold" />
                  </div>
                  <h4 className="font-bold text-sm text-headline mb-1">{f.title}</h4>
                  <p className="text-xs text-text-secondary-dynamic leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
