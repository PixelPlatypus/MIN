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
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Nepal flag motif */}
      <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[350px] opacity-[0.05] pointer-events-none" viewBox="0 0 500 350">
        <polygon points="80,320 250,30 250,320" fill="white" />
        <polygon points="80,320 420,320 420,140" fill="white" />
        <polygon points="120,280 250,70 250,280" fill="white" stroke="currentColor" strokeWidth="0.5" />
        <polygon points="120,280 380,280 380,160" fill="white" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto text-center">
        <div className="recognition-fade-in">
          <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-6">
            <Award size={14} />
            Global Recognition
          </span>
        </div>

        <h2 className="recognition-fade-in text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
          <span className="block text-accent">HundrED Top 100</span>
          <span className="block text-headline mt-2">Global Education</span>
          <span className="block text-text-primary-dynamic mt-2">Innovation 2024</span>
        </h2>

        <p className="recognition-fade-in mt-8 text-base md:text-lg text-text-secondary-dynamic leading-relaxed max-w-2xl mx-auto">
          {settings?.about_rec_description || 'MIN was selected from 3,000+ innovations across 100+ countries as one of the HundrED Top 100 Global Education Innovations of 2024 — the only organization from Nepal to receive this honor.'}
        </p>

        <div className="recognition-fade-in mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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

        {settings?.recognition_image_url && (
          <div className="recognition-fade-in mt-16">
            <div className="relative aspect-[16/9] max-w-lg mx-auto rounded-3xl overflow-hidden border border-border-dynamic">
              <Image
                src={settings.recognition_image_url}
                alt="Recognition Award"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        )}

        <div className="recognition-fade-in mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-text-tertiary-dynamic tracking-wide">
          <span>5,000+ reviewed</span>
          <span className="w-1 h-1 rounded-full bg-marigold" />
          <span>100+ countries</span>
          <span className="w-1 h-1 rounded-full bg-marigold" />
          <span>1 from Nepal</span>
        </div>
      </div>
    </section>
  )
}
