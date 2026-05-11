'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const fallbackPrograms = [
  { name: 'Road to Olympiad', tagline: 'Structured training pathway for national and international math competitions.' },
  { name: 'ETA Campaigns', tagline: 'Empowering teachers across Nepal with modern mathematics pedagogy.' },
  { name: 'Women in Mathematics', tagline: 'Creating inclusive spaces for girls and women to thrive in math.' },
  { name: 'Digital Content', tagline: 'Building Nepal\'s largest open-access repository of math resources.' },
]

export default function ProgramsGrid({ settings, initialPrograms, programs }) {
  const containerRef = useRef(null)
  const source = initialPrograms || programs
  const items = (source && source.length > 0) ? source : fallbackPrograms

  useEffect(() => {
    let ctx
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (!containerRef.current) return
        gsap.fromTo('.program-row',
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
            },
          }
        )
      })
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative">
      <div aria-hidden className="mx-auto h-px w-[80vw] max-w-6xl bg-border-dynamic" />
      <div className="px-6 md:px-12 lg:px-20 py-24 lg:py-32 max-w-5xl mx-auto">
        <div className="mb-16">
          <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-6">
            Our Initiatives
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-headline">
            {settings?.programs_title || 'Programs that drive change.'}
          </h2>
          <p className="mt-4 text-base text-text-secondary-dynamic max-w-xl">
            {settings?.programs_subtitle || 'Each initiative is designed to address a specific gap in Nepal\'s mathematics education ecosystem.'}
          </p>
        </div>

        <div className="flex flex-col">
          {items.map((item, i) => {
            const href = item.learn_more_link || item.href || '/about'
            const external = /^https?:\/\//i.test(href)
            return (
            <Link
              key={i}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="program-row group flex items-center gap-6 py-6 border-t border-border-dynamic last:border-b hover:border-marigold/30 transition-colors duration-300"
            >
              <span className="text-text-tertiary-dynamic text-xs font-mono font-medium w-8 shrink-0 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-text-primary-dynamic group-hover:text-headline transition-colors duration-200">
                  {item.name}
                </h4>
                <p className="text-sm text-text-tertiary-dynamic mt-1 leading-relaxed line-clamp-2">
                  {item.tagline}
                </p>
              </div>
              <div className="shrink-0 w-10 h-10 rounded-xl border border-border-dynamic flex items-center justify-center text-text-tertiary-dynamic group-hover:border-marigold/40 group-hover:text-marigold transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={18} />
              </div>
            </Link>
          )})}
        </div>
      </div>
    </section>
  )
}
