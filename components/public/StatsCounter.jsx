'use client'
import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
// GSAP and ScrollTrigger are dynamically loaded inside useEffect
import { Users, Trophy, BookOpen, Clock } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/Skeleton'
import BrandSpotlightCard from '@/components/public/BrandSpotlightCard'

export default function StatsCounter({ settings: initialSettings = null }) {
  const [settings, setSettings] = useState(initialSettings)
  const [isLoading, setIsLoading] = useState(!initialSettings)
  const containerRef = useRef(null)

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
      setIsLoading(false)
      return
    }

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Stats settings load error', err)
        setIsLoading(false)
      })
  }, [initialSettings])

  const dynamicStats = [
    { label: 'Students Reached', value: settings?.stat_students_count, suffix: '', icon: <Users size={28} />, theme: 'primary' },
    { label: 'Volunteers', value: settings?.stat_volunteers_count, suffix: '', icon: <Clock size={28} />, theme: 'cyan' },
    { label: 'Programs', value: settings?.stat_programs_count, suffix: '', icon: <BookOpen size={28} />, theme: 'purple' },
    { label: 'Years of Impact', value: settings?.stat_years_count, suffix: '', icon: <Trophy size={28} />, theme: 'coral' },
  ]

  useEffect(() => {
    if (!settings) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let ctx;

    // Load GSAP dynamically to improve TBT and main-thread work
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      
      ctx = gsap.context(() => {
        if (!containerRef.current) return
        const counts = containerRef.current.querySelectorAll('.stat-value')
        
        counts.forEach((count, i) => {
          const rawValue = (dynamicStats[i].value || '').toString().trim()
          if (!rawValue) {
            count.innerText = "0"
            return
          }
          
          // Extract numeric part and unit (e.g., "20.5" and "K+")
          const match = rawValue.match(/^([0-9,.]+)\s*(.*)$/)
          
          if (prefersReducedMotion || !match) {
            count.innerText = rawValue
          } else {
            const numValue = parseFloat(match[1].replace(/,/g, ''))
            const unit = match[2] || ""
            
            const obj = { val: 0 }
            gsap.to(obj, {
              val: numValue,
              duration: 2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: count,
                start: 'top 85%',
              },
              onUpdate: () => {
                // Formatting back with comma if needed, or just floor
                const current = Math.floor(obj.val)
                count.innerText = current.toLocaleString() + unit
              }
            })
          }
        })
      })
    })

    return () => ctx?.revert()
  }, [settings])

  return (
    <section ref={containerRef} className="container mx-auto px-6 py-24 relative overflow-hidden">
      <div className="text-center mb-16 space-y-4">
        <span className="eyebrow">Key Metrics</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          {isLoading ? <Skeleton className="w-64 h-12 mx-auto" /> : settings?.stats_title}
        </h2>
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4 mx-auto" />
            </div>
          ) : (
            <p className="text-lg text-auto-secondary">
              {settings?.stats_subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-[2.5rem] p-8 h-48 space-y-6">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="w-24 h-8" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
          ))
        ) : (
          dynamicStats.map((stat, i) => (
            <m.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group h-full"
            >
              <BrandSpotlightCard className="h-full">
              <div className="relative z-10 flex flex-col h-full w-full">
                <div className={`w-16 h-16 bg-${stat.theme}/10 text-${stat.theme} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-5xl font-black tracking-tighter text-gradient-brand pb-1">
                    <span className="stat-value">0</span>{stat.suffix}
                  </h3>
                  <p className="text-sm font-semibold text-auto-tertiary uppercase tracking-widest group-hover:text-auto-secondary transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
              </BrandSpotlightCard>
            </m.div>
          ))
        )}
      </div>
    </section>
  )
}
