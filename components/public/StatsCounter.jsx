'use client'
import { useEffect, useRef } from 'react'
import { Users, BookOpen, Clock, Trophy } from 'lucide-react'
import GridPaper from '@/components/shared/GridPaper'

const statItems = [
  { icon: <Users size={28} />, value: 15000, suffix: '', label: 'Students Reached' },
  { icon: <BookOpen size={28} />, value: 120, suffix: '', label: 'Workshops Conducted' },
  { icon: <Clock size={28} />, value: 20000, suffix: '', label: 'Volunteer Hours' },
  { icon: <Trophy size={28} />, value: 5, suffix: '', label: 'Years of Impact' },
]

export default function StatsCounter({ settings }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ctx

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (!containerRef.current) return
        const counts = containerRef.current.querySelectorAll('.stat-value')

        counts.forEach((el) => {
          const target = parseFloat(el.dataset.value)
          if (isNaN(target)) return

          if (prefersReducedMotion) {
            el.textContent = target.toLocaleString()
            return
          }

          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
            onUpdate: () => {
              el.textContent = Math.floor(obj.val).toLocaleString()
            },
          })
        })
      })
    })

    return () => ctx?.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative py-20 lg:py-24 overflow-hidden">
      <GridPaper className="opacity-[0.08]" spacing={50} />

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto text-center">
        <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-6">
          Impact at Scale
        </span>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-headline max-w-3xl mx-auto">
          {settings?.stats_title || 'Our Growing Impact'}
        </h2>

        <p className="mt-4 text-base text-text-secondary-dynamic max-w-xl mx-auto">
          {settings?.stats_subtitle || 'Numbers that drive our mission forward.'}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 mt-12 lg:divide-x divide-border-dynamic">
          {statItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 px-4 lg:px-8 py-6">
              <div className="w-11 h-11 rounded-xl bg-marigold/10 border border-marigold/15 flex items-center justify-center text-marigold">
                {item.icon}
              </div>
              <div className="stat-value text-5xl md:text-6xl font-black tracking-tight text-headline tabular-nums leading-none"
                data-value={item.value}>
                0
              </div>
              <p className="text-[11px] text-text-tertiary-dynamic tracking-[0.2em] uppercase font-institutional text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
