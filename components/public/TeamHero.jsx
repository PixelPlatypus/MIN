'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function TeamHero({ settings: initialSettings }) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(!initialSettings)
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('min_team_hero_seen')
    if (seen) {
      setHasSeenAnimation(true)
    } else {
      sessionStorage.setItem('min_team_hero_seen', 'true')
    }

    if (!initialSettings) {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          setSettings(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Team settings load error', err)
          setLoading(false)
        })
    }
  }, [initialSettings])

  return (
    <section className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={hasSeenAnimation ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
        >
          <Sparkles size={16} />
          {loading ? <Skeleton className="w-24 h-4" /> : settings?.team_title}
        </motion.div>
        <div className="flex justify-center">
          {loading ? (
            <Skeleton className="w-96 h-16 md:h-20" />
          ) : (
            <motion.h1 
              initial={hasSeenAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              {settings?.team_subtitle}
            </motion.h1>
          )}
        </div>
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4 mx-auto" />
            </div>
          ) : (
            <motion.p 
              initial={hasSeenAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed"
            >
              {settings?.team_description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
