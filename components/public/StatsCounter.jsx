'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
// GSAP and ScrollTrigger are dynamically loaded inside useEffect
import { Users, Trophy, BookOpen, Clock } from 'lucide-react'

const stats = [
  { label: 'Students Reached', value: 1400, suffix: '+', icon: <Users size={28} />, theme: 'primary' },
  { label: 'Volunteers', value: 50, suffix: '+', icon: <Clock size={28} />, theme: 'cyan' },
  { label: 'Programs', value: 15, suffix: '+', icon: <BookOpen size={28} />, theme: 'purple' },
  { label: 'Years of Impact', value: 5, suffix: '+', icon: <Trophy size={28} />, theme: 'coral' },
]

export default function StatsCounter() {
  const [settings, setSettings] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Stats settings load error', err))
  }, [])

  const dynamicStats = [
    { label: 'Students Reached', value: settings?.stat_students_count || 1400, suffix: '+', icon: <Users size={28} />, theme: 'primary' },
    { label: 'Volunteers', value: settings?.stat_volunteers_count || 50, suffix: '+', icon: <Clock size={28} />, theme: 'cyan' },
    { label: 'Programs', value: settings?.stat_programs_count || 15, suffix: '+', icon: <BookOpen size={28} />, theme: 'purple' },
    { label: 'Years of Impact', value: settings?.stat_years_count || 5, suffix: '+', icon: <Trophy size={28} />, theme: 'coral' },
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
          const target = dynamicStats[i].value
          if (prefersReducedMotion) {
            count.innerText = target
          } else {
            gsap.fromTo(count, 
              { innerText: 0 },
              { 
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: count,
                  start: 'top 85%',
                }
              }
            )
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
          {settings?.stats_title || "Our Growing Impact"}
        </h2>
        <p className="text-lg text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto">
          {settings?.stats_subtitle || "Quantifying the difference we make in mathematics education across Nepal."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {dynamicStats.map((stat, i) => (
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
        ))}
      </div>
    </section>
  )
}
