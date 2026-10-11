'use client'
import { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { ArrowRight, BookOpen, GraduationCap, Monitor as Laptop, Megaphone, Lightbulb, Trophy, Users, Stack as Layers } from '@phosphor-icons/react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'
import BrandSpotlightCard from '@/components/public/BrandSpotlightCard'

export default function ProgramsGrid({ initialPrograms = [], settings: initialSettings = null }) {
  const [settings, setSettings] = useState(initialSettings)
  const [programs, setPrograms] = useState(initialPrograms || [])
  const [loading, setLoading] = useState(!(initialPrograms && initialPrograms.length > 0) || !initialSettings)

  useEffect(() => {
    if (initialPrograms?.length && initialSettings) {
      setPrograms(initialPrograms)
      setSettings(initialSettings)
      setLoading(false)
      return
    }

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
  }, [initialPrograms, initialSettings])

  const getIcon = (slug) => {
    const icons = {
      'eta-campaigns': <Megaphone size={30} weight="duotone" className="text-primary" />,
      'jmoc': <Trophy size={30} weight="duotone" className="text-cyan" />,
      'm3-bootcamp': <Laptop size={30} weight="duotone" className="text-purple" />,
      'm³-bootcamp': <Laptop size={30} weight="duotone" className="text-purple" />, // slug in the DB uses a superscript 3
      'women-in-mathematics': <GraduationCap size={30} weight="duotone" className="text-coral" />,
      'road-to-olympiad': <BookOpen size={30} weight="duotone" className="text-orange" />,
      'digital-content': <Users size={30} weight="duotone" className="text-green" />,
      'minspire': <Lightbulb size={30} weight="duotone" className="text-primary" />,
    }
    return icons[slug] || <Layers size={30} weight="duotone" className="text-primary" />
  }

  const getColor = (slug) => {
    const colors = {
      'eta-campaigns': 'bg-primary/10',
      'jmoc': 'bg-cyan/10',
      'm3-bootcamp': 'bg-purple/10',
      'm³-bootcamp': 'bg-purple/10',
      'women-in-mathematics': 'bg-coral/10',
      'road-to-olympiad': 'bg-orange/10',
      'digital-content': 'bg-green/10',
    }
    return colors[slug] || 'bg-primary/10'
  }

  // Full class names so Tailwind compiles them
  const getBar = (slug) => ({
    'jmoc': 'bg-cyan',
    'm3-bootcamp': 'bg-purple',
    'm³-bootcamp': 'bg-purple',
    'women-in-mathematics': 'bg-coral',
    'road-to-olympiad': 'bg-orange',
    'digital-content': 'bg-green',
  })[slug] || 'bg-primary dark:bg-secondary'

  return (
    <section id="programs" className="container mx-auto px-6 py-24 relative overflow-hidden scroll-mt-24">
      <div className="text-center mb-16 space-y-4">
        <span className="eyebrow">Our Initiatives</span>
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
            <p className="text-lg text-auto-secondary">
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
            <m.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group h-full"
            >
              <BrandSpotlightCard className="flex flex-col items-center text-center h-full">
                <div className={`absolute top-0 inset-x-12 h-1.5 rounded-b-full ${getBar(program.slug)} transition-all duration-500 group-hover:inset-x-6`} />
                <div className="relative z-10 flex flex-col items-center h-full w-full">
                  <div className={`w-16 h-16 ${getColor(program.slug)} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    {getIcon(program.slug)}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text-primary dark:text-white group-hover:text-primary-dark dark:duration-75 transition-colors">{program.name}</h3>
                  <p className="text-sm text-auto-secondary leading-relaxed mb-6 flex-grow">
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
              </BrandSpotlightCard>
            </m.div>
          ))
        )}
      </div>
    </section>
  )
}
