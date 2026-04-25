'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Hero() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Hero settings load error', err)
        setIsLoading(false)
      })
  }, [])

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-transparent border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 glass px-6 py-2.5 rounded-full text-xs font-bold mb-6 shadow-xl will-change-transform"
          >
            <Sparkles size={16} className="text-secondary-dark" />
            <span className="uppercase tracking-[0.2em]">
              {isLoading ? (
                <Skeleton className="w-48 h-3" />
              ) : (
                settings?.hero_badge
              )}
            </span>
          </motion.div>

          <div className="mb-8">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-full max-w-2xl h-16 md:h-20" />
                <Skeleton className="w-3/4 max-w-xl h-16 md:h-20" />
              </div>
            ) : (
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-[90px] font-black tracking-tighter leading-[1.1] text-gradient pb-2 will-change-transform"
              >
                {settings?.hero_title}
              </motion.h1>
            )}
          </div>

          <div className="mb-10 max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-2/3 h-4 mx-auto" />
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl md:text-2xl text-text-secondary dark:text-text-secondary-dark leading-relaxed font-medium will-change-transform"
              >
                {settings?.hero_subtitle}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 will-change-transform"
          >
            {isLoading ? (
              <Skeleton className="w-56 h-16 rounded-2xl" />
            ) : settings?.hero_cta_link && (
              <Link 
                href={settings.hero_cta_link}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 active:scale-[0.98] group"
              >
                {settings.hero_cta_text}
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-2" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mouse scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-primary/20 rounded-full flex justify-center p-2">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
