'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_EVENT_COVER = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'

export default function EventCard({ event, index, fallbackImage }) {
  const { title, slug, start_date, end_date, location, cover_url, event_type } = event
  
  const now = new Date()
  const start = new Date(start_date)
  const end = end_date ? new Date(end_date) : null

  const getStatusBadge = () => {
    if (event_type === 'RECURRING' || event_type === 'EVERGOING') {
      return { text: 'Coming Soon', class: 'bg-secondary text-slate-900 border-secondary-dark/30 shadow-lg shadow-secondary/20 font-black' }
    }
    
    if (start > now) {
      return { text: 'Upcoming', class: 'bg-primary text-white border-primary/20 shadow-lg shadow-primary/20' }
    }
    
    // Past logic: if end date exists and is past, or if no end date but start date is 24h+ old
    const isPast = end ? end < now : (now.getTime() - start.getTime() > 86400000)
    if (isPast) {
      return { text: 'Past Event', class: 'bg-black/40 text-white border-white/40' }
    }
    
    return { text: 'Ongoing', class: 'bg-green/90 text-white border-green/20' }
  }

  const badge = getStatusBadge()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <Link href={`/events/${slug}`} className="block h-full">
        <div className="relative glass rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          <div className="relative z-10 flex flex-col h-full w-full">
            {/* Cover Image */}
            <div className="aspect-[16/9] relative overflow-hidden">
              <Image 
                src={cover_url || fallbackImage || DEFAULT_EVENT_COVER} 
                alt={title}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg ${badge.class}`}>
                  {badge.text}
                </span>
              </div>

              {/* Event Type Badge */}
              {event_type && event_type !== 'EVENT' && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xl text-white border border-white/20">
                    {event_type}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow space-y-4 bg-white/40 dark:bg-black/20">
              <h3 className="text-xl font-bold tracking-tight line-clamp-2 text-text dark:text-white group-hover:text-primary transition-colors">
                {title}
              </h3>

              <div className="space-y-2 z-10">
                <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-text-secondary-dark font-medium">
                  <Calendar size={16} className="text-primary" />
                  {event_type === 'EVERGOING' ? 'Ongoing Program' : new Date(start_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                {location && (
                  <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-text-secondary-dark font-medium">
                    <MapPin size={16} className="text-primary" />
                    {location}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between mt-auto z-10">
                <span className="text-sm font-bold text-primary group-hover:gap-4 flex items-center gap-2 transition-all">
                  View Details
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
