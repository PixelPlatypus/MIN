'use client'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'
import BrandSpotlightCard from '@/components/public/BrandSpotlightCard'

export default function EventCard({ event, index, fallbackImage }) {
  const { title, slug, start_date, end_date, location, cover_url, event_type } = event
  
  const now = new Date()
  const start = new Date(start_date)
  const end = end_date ? new Date(end_date) : null

  const getStatusBadge = () => {
    if (event_type === 'RECURRING' || event_type === 'EVERGOING') {
      return { text: 'Coming Soon', class: 'bg-secondary text-primary-dark border-secondary-dark/30 shadow-lg shadow-secondary/20 font-black' }
    }
    
    if (start > now) {
      return { text: 'Upcoming', class: 'bg-amber-400/95 text-primary-dark border-amber-300/40 shadow-lg shadow-amber-500/20' }
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const boundary = end || start
    const isPast = boundary && (new Date(boundary).setHours(0, 0, 0, 0) < today.getTime())
    if (isPast) {
      return { text: 'Past Event', class: 'bg-black/40 text-white border-white/40' }
    }
    
    return { text: 'Ongoing', class: 'bg-emerald-500/90 text-white border-emerald-300/30' }
  }

  const badge = getStatusBadge()

  return (
    // CSS entrance: the card (and its LCP cover image) is in the server HTML instead of hidden until hydration
    <div data-rise="" style={{ animationDelay: `${Math.min(index, 5) * 0.08}s` }} className="group relative h-full">
      <Link href={`/events/${slug}`} className="block h-full rounded-[2.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary">
        <BrandSpotlightCard className="!p-0 flex flex-col h-full">
          {/* Cover Image */}
          <div className="aspect-[16/9] relative overflow-hidden">
            <Image
              loading={index < 4 ? 'eager' : 'lazy'}
              fetchPriority={index < 4 ? 'high' : 'auto'}
              src={cover_url || fallbackImage || '/images/logo.png'} 
              alt={title}
              fill
              className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 via-transparent to-transparent pointer-events-none" />

            {/* Status Badge */}
            {event.show_date !== false && (
              <div className="absolute top-4 right-4 z-20">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg ${badge.class}`}>
                  {badge.text}
                </span>
              </div>
            )}

            {/* Event Type Badge */}
            {event_type && event_type !== 'EVENT' && (
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg bg-primary-dark/40 backdrop-blur-xl text-white border border-white/25">
                  {event_type}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 p-7 md:p-8 flex flex-col flex-grow space-y-4">
            <h3 className="text-xl font-bold tracking-tight line-clamp-2 group-hover:text-primary dark:text-white dark:group-hover:text-secondary transition-colors">
              {title}
            </h3>

            <div className="space-y-2">
              {event.show_date !== false && (
                <div className="flex items-center gap-3 text-sm text-auto-secondary font-medium">
                  <Calendar size={16} className="text-primary dark:text-secondary shrink-0" />
                  {event_type === 'EVERGOING' ? 'Ongoing Program' : new Date(start_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              )}
              {location && (
                <div className="flex items-center gap-3 text-sm text-auto-secondary font-medium">
                  <MapPin size={16} className="text-primary dark:text-secondary shrink-0" />
                  {location}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between mt-auto">
              <span className="text-sm font-bold text-primary dark:text-secondary group-hover:gap-3 flex items-center gap-2 transition-all">
                View Details
                <ArrowRight size={16} weight="bold" />
              </span>
            </div>
          </div>
        </BrandSpotlightCard>
      </Link>
    </div>
  )
}
