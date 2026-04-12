'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Timeline() {
  const [events, setEvents] = useState([])
  const containerRef = useRef(null)

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => setEvents(data || []))
      .catch(err => console.error('Timeline load error', err))
  }, [])

  useEffect(() => {
    if (events.length === 0) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const items = containerRef.current.querySelectorAll('.timeline-item')
      
      if (prefersReducedMotion) {
        items.forEach(item => gsap.set(item, { opacity: 1, x: 0 }))
        const line = containerRef.current.querySelector('.timeline-line')
        gsap.set(line, { scaleY: 1 })
      } else {
        items.forEach((item, i) => {
          gsap.fromTo(item, 
            { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
            { 
              opacity: 1, 
              x: 0, 
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        })

        // Line animation
        const line = containerRef.current.querySelector('.timeline-line')
        gsap.fromTo(line, 
          { scaleY: 0 },
          { 
            scaleY: 1,
            duration: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 50%',
              end: 'bottom 50%',
              scrub: true
            }
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="container mx-auto px-6 pt-12 pb-16 relative overflow-hidden">
      <div className="text-center mb-12 space-y-4">
        <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Journey</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Timeline of Impact</h2>
        <p className="text-lg text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto">
          From humble beginnings to global recognition, here's how we've grown.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto py-12">
        {/* Central Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black/10 dark:bg-white/10 -translate-x-1/2 hidden md:block" />
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary -translate-x-1/2 origin-top timeline-line hidden md:block" />

        <div className="space-y-12 md:space-y-24 relative">
          {events.map((event, i) => (
            <div 
              key={event.year} 
              className={`timeline-item flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 ${
                i % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="w-full md:w-[45%]">
                <div className={`glass rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative ${
                  i % 2 !== 0 ? 'text-left md:text-right' : 'text-left'
                }`}>
                  <span className="text-primary font-bold text-2xl mb-2 block tracking-tight">{event.year}</span>
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                    {event.description || event.desc}
                  </p>
                  
                  {/* Pointer arrow for desktop */}
                  <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 glass border-none rotate-45 -z-10 ${
                    i % 2 !== 0 ? '-right-2' : '-left-2'
                  }`} />
                </div>
              </div>

              {/* Dot */}
              <div className="w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-black shadow-xl z-10 relative shrink-0" />

              {/* Empty space for desktop layout */}
              <div className="hidden md:block w-[45%]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
