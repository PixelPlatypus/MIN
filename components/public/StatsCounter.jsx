'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
// GSAP and ScrollTrigger are dynamically loaded inside useEffect
import { Users, Trophy, BookOpen, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function StatsCounter() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
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
  }, [])

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
        <span className="text-primary font-bold uppercase tracking-widest text-sm">Key Metrics</span>
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
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark">
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
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative glass rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 overflow-hidden will-change-transform"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.theme}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`} />
              <div className="relative z-10 flex flex-col h-full w-full">
                <div className={`w-16 h-16 bg-${stat.theme}/10 text-${stat.theme} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-4xl font-bold tracking-tight text-text dark:text-white group-hover:text-primary transition-colors">
                    <span className="stat-value">0</span>{stat.suffix}
                  </h3>
                  <p className="text-sm font-semibold text-text-tertiary dark:text-text-tertiary-dark uppercase tracking-widest group-hover:text-text-secondary transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  )
}
