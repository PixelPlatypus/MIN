'use client'
import { useEffect, useRef } from 'react'

const fallbackEvents = [
  { year: '2020', title: 'The Beginning', description: 'MIN was founded by a group of passionate students and educators determined to transform mathematics education in Nepal.' },
  { year: '2021', title: 'First ETA Campaign', description: 'Launched our Empowered Teachers Alliance program, reaching 50+ teachers across Kathmandu Valley.' },
  { year: '2022', title: 'National Expansion', description: 'Expanded programs to all 7 provinces. Launched the Road to Olympiad training pipeline.' },
  { year: '2023', title: 'Women in Mathematics', description: 'Established dedicated programs to support and mentor women in mathematics at all levels.' },
  { year: '2024', title: 'HundrED Top 100', description: 'Recognized as one of the top 100 global education innovations by HundrED, Finland.' },
]

export default function Timeline({ settings, events, initialEvents }) {
  const containerRef = useRef(null)
  const source = initialEvents || events
  const items = (source && source.length > 0) ? source : fallbackEvents

  useEffect(() => {
    let ctx
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (!containerRef.current) return

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isMobile = window.matchMedia('(max-width: 767px)').matches

        const timelineItems = containerRef.current.querySelectorAll('.timeline-item')

        if (prefersReducedMotion) {
          gsap.set(timelineItems, { opacity: 1, x: 0 })
          gsap.set('.timeline-line', { scaleY: 1 })
        } else {
          timelineItems.forEach((item, i) => {
            const xFrom = isMobile ? 0 : (i % 2 === 0 ? -40 : 40)
            gsap.fromTo(item,
              { opacity: 0, x: xFrom },
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 82%',
                  toggleActions: 'play none none none',
                },
              }
            )
          })

          gsap.fromTo('.timeline-line',
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 2,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 60%',
                end: 'bottom 60%',
                scrub: true,
              },
            }
          )
        }
      })
    })

    return () => ctx?.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative bg-bg-secondary/30 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-20 py-24 lg:py-32 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-6">
            Our Journey
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-headline">
            {settings?.timeline_title || 'Timeline of Impact'}
          </h2>
          <p className="mt-4 text-base text-text-secondary-dynamic max-w-xl mx-auto">
            From humble beginnings to global recognition.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border-dynamic -translate-x-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-marigold -translate-x-1/2 origin-top timeline-line" />

          <div className="flex flex-col gap-12 md:gap-24">
            {items.map((event, i) => (
              <div key={i} className={`timeline-item flex flex-col md:flex-row items-center gap-6 md:gap-0 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`w-full md:w-[42%] ${i % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="card rounded-2xl p-6 md:p-7">
                    <span className="text-5xl md:text-7xl font-bold tracking-tighter text-headline leading-none">{event.year}</span>
                    <h3 className="text-lg font-bold text-text-primary-dynamic mt-4">{event.title}</h3>
                    <p className="text-sm text-text-tertiary-dynamic mt-2 leading-relaxed">
                      {event.description || event.desc}
                    </p>
                  </div>
                </div>

                <div className="w-4 h-4 rounded-full bg-marigold border-4 border-bg shrink-0 z-10 relative">
                  <div className="absolute inset-0 rounded-full bg-marigold/30 blur-sm" />
                </div>

                <div className="hidden md:block w-[42%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
