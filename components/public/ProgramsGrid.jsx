'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, GraduationCap, Laptop, Sparkles, Trophy, Users, Layers } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ProgramsGrid() {
  const [settings, setSettings] = useState(null)
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/programs?status=ACTIVE').then(res => res.json())
    ]).then(([settingsData, programsData]) => {
      setSettings(settingsData)
      setPrograms(Array.isArray(programsData) ? programsData : [])
      setLoading(false)
    }).catch(err => {
      console.error('Programs data load error', err)
      setLoading(false)
    })
  }, [])

  const getIcon = (slug) => {
    const icons = {
      'eta-campaigns': <Sparkles className="text-primary" />,
      'jmoc': <Trophy className="text-cyan" />,
      'm3-bootcamp': <Laptop className="text-purple" />,
      'women-in-mathematics': <GraduationCap className="text-coral" />,
      'road-to-olympiad': <BookOpen className="text-orange" />,
      'digital-content': <Users className="text-green" />,
    }
    return icons[slug] || <Layers className="text-primary" />
  }

  const getColor = (slug) => {
    const colors = {
      'eta-campaigns': 'bg-primary/10',
      'jmoc': 'bg-cyan/10',
      'm3-bootcamp': 'bg-purple/10',
      'women-in-mathematics': 'bg-coral/10',
      'road-to-olympiad': 'bg-orange/10',
      'digital-content': 'bg-green/10',
    }
    return colors[slug] || 'bg-primary/10'
  }

  return (
    <section className="container mx-auto px-6 py-24 relative overflow-hidden">
      <div className="text-center mb-16 space-y-4">
        <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Initiatives</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          {loading ? <Skeleton className="w-64 h-12 mx-auto" /> : settings?.programs_title}
        </h2>
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4 mx-auto" />
            </div>
          ) : (
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark">
              {settings?.programs_subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-[2.5rem] p-8 h-64 space-y-6">
              <Skeleton className="w-16 h-16 rounded-2xl mx-auto" />
              <div className="space-y-3">
                <Skeleton className="w-32 h-6 mx-auto" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-2/3 h-4 mx-auto" />
              </div>
            </div>
          ))
        ) : (
          programs.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative block glass bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 flex flex-col items-center text-center h-full border border-white/40 dark:border-white/10 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${getColor(program.slug)} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`} />
                <div className="relative z-10 flex flex-col items-center h-full w-full">
                  <div className={`w-16 h-16 ${getColor(program.slug)} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    {getIcon(program.slug)}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text dark:text-white group-hover:text-primary transition-colors">{program.name}</h3>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed mb-6 flex-grow">
                    {program.tagline}
                  </p>
                  {program.learn_more_link && (
                    <Link 
                      href={program.learn_more_link}
                      className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:gap-4 transition-all"
                    >
                      {program.learn_more_text || 'Learn More'}
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  )
}
