'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Award } from 'lucide-react'

export default function Recognition({ settings }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    let ctx
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (!sectionRef.current) return
        gsap.fromTo('.recognition-fade-in',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
            },
          }
        )
      })
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden border-t border-border-dynamic">
      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="recognition-fade-in">
              <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional">
                <Award size={14} />
                Global Recognition
              </span>
            </div>

            <h2 className="recognition-fade-in text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              <span className="block text-accent">HundrED Top 100</span>
              <span className="block text-headline mt-2">Global Education</span>
              <span className="block text-text-primary-dynamic mt-2">Innovation 2024</span>
            </h2>

            <p className="recognition-fade-in text-base md:text-lg text-text-secondary-dynamic leading-relaxed max-w-xl">
              {settings?.about_rec_description || 'MIN was selected from 3,000+ innovations across 100+ countries as one of the HundrED Top 100 Global Education Innovations of 2024 — the only organization from Nepal to receive this honor.'}
            </p>

            <div className="recognition-fade-in flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href={settings?.about_rec_link || '/about'}
                className="inline-flex items-center gap-2 bg-headline text-bg px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Recognition
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-border-dynamic px-8 py-4 rounded-xl font-medium text-base text-text-secondary-dynamic transition-all hover:border-marigold/40 hover:text-text-primary-dynamic"
              >
                Our Journey
              </Link>
            </div>
          </div>

          <div className="recognition-fade-in space-y-8">
            {settings?.recognition_image_url ? (
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-border-dynamic">
                <Image
                  src={settings.recognition_image_url}
                  alt="Recognition Award"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
            ) : (
              <div className="relative aspect-[16/10] w-full rounded-3xl border border-border-dynamic bg-surface flex items-center justify-center">
                <Award size={56} className="text-marigold/40" />
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border-dynamic p-4 text-center">
                <div className="text-2xl font-black tracking-tighter text-headline leading-none">5,000+</div>
                <div className="text-[10px] mt-2 text-text-tertiary-dynamic tracking-[0.18em] uppercase font-institutional">Reviewed</div>
              </div>
              <div className="rounded-2xl border border-border-dynamic p-4 text-center">
                <div className="text-2xl font-black tracking-tighter text-headline leading-none">100+</div>
                <div className="text-[10px] mt-2 text-text-tertiary-dynamic tracking-[0.18em] uppercase font-institutional">Countries</div>
              </div>
              <div className="rounded-2xl border border-marigold/30 bg-marigold/5 p-4 text-center">
                <div className="text-2xl font-black tracking-tighter text-marigold leading-none">1</div>
                <div className="text-[10px] mt-2 text-text-tertiary-dynamic tracking-[0.18em] uppercase font-institutional">From Nepal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
