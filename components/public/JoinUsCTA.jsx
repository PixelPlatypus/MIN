'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function JoinUsCTA({ settings }) {
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
        gsap.fromTo('.cta-fade-in',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        )
      })
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-bg-secondary/30 border-y border-border-dynamic overflow-hidden">
      <div className="absolute inset-0 math-grid opacity-[0.06]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-marigold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-24 lg:py-32 max-w-3xl mx-auto text-center">
        <div className="cta-fade-in">
          <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-6">
            Join the Community
          </span>
        </div>

        <h2 className="cta-fade-in text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-headline">
          {settings?.join_cta_title || 'Be part of the movement.'}
        </h2>

        <p className="cta-fade-in mt-6 text-base md:text-lg text-text-secondary-dynamic leading-relaxed">
          {settings?.join_cta_description || 'Whether you are a student, teacher, or volunteer — there is a place for you in Nepal\'s mathematics renaissance. Together, we can build a future where every student has access to world-class mathematical thinking.'}
        </p>

        <div className="cta-fade-in mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={settings?.join_cta_link || '/join'}
            className="inline-flex items-center gap-2 bg-headline text-bg px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            {settings?.join_cta_btn_text || 'Join Us'}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/join#contact"
            className="inline-flex items-center gap-2 border border-border-dynamic px-8 py-4 rounded-xl font-medium text-base text-text-secondary-dynamic transition-all hover:border-marigold/40 hover:text-text-primary-dynamic"
          >
            Contact Us
          </Link>
        </div>

        <p className="cta-fade-in mt-8 text-xs text-text-tertiary-dynamic">
          Already 15,000+ students and 500+ teachers strong across all 7 provinces.
        </p>
      </div>
    </section>
  )
}
