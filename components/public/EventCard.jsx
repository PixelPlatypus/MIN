'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

export default function EventCard({ event, index }) {
  const { title, slug, start_date, location, cover_url, status } = event
  const isPast = new Date(start_date) < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <Link href={`/events/${slug}`} className="block h-full">
        <div className="relative glass bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-full border border-white/40 dark:border-white/10 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          <div className="relative z-10 flex flex-col h-full w-full">
            {/* Cover Image */}
            <div className="aspect-[16/9] relative overflow-hidden">
              <Image 
                src={cover_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'} 
                alt={title}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-4 right-4 z-20">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border ${
                  isPast 
                    ? 'bg-black/40 text-white border-white/20' 
                    : 'bg-primary/90 text-white border-primary/20'
                }`}>
                  {isPast ? 'Past Event' : 'Upcoming'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow space-y-4 bg-white/40 dark:bg-black/20">
              <h3 className="text-xl font-bold tracking-tight line-clamp-2 text-text dark:text-white group-hover:text-primary transition-colors">
                {title}
              </h3>

              <div className="space-y-2 z-10">
                <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-text-secondary-dark font-medium">
                  <Calendar size={16} className="text-primary" />
                  {new Date(start_date).toLocaleDateString('en-US', {
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
