'use client'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function EventsHero({ settings, loading }) {
  return (
    <section className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
        >
          <Calendar size={16} />
          {loading ? <Skeleton className="w-24 h-4" /> : settings?.events_title}
        </motion.div>
        <div className="flex justify-center">
          {loading ? (
            <Skeleton className="w-[80%] h-16 md:h-20" />
          ) : (
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              {settings?.events_subtitle}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed"
            >
              {settings?.events_description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
