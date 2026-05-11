'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function EventCard({ event, index, fallbackImage }) {
  const { title, slug, start_date, end_date, location, cover_url, event_type } = event
  const now = new Date()
  const start = new Date(start_date)
  const end = end_date ? new Date(end_date) : null

  const getStatusBadge = () => {
    if (event_type === 'RECURRING' || event_type === 'EVERGOING') return null
    if (start > now) return { text: 'Upcoming', class: 'bg-marigold/10 text-marigold' }
    if (end && end < now) return { text: 'Past Event', class: 'bg-text-tertiary-dynamic/10 text-text-tertiary-dynamic' }
    if (!end && start < now && start > new Date(now - 86400000 * 30)) return { text: 'Happening Now', class: 'bg-sari-red/10 text-sari-red' }
    return { text: 'Past Event', class: 'bg-text-tertiary-dynamic/10 text-text-tertiary-dynamic' }
  }

  const getTypeLabel = () => {
    if (event_type === 'SPECIAL') return { text: 'Special', class: 'text-marigold' }
    return null
  }

  const status = getStatusBadge()
  const typeLabel = getTypeLabel()

  const formatDate = () => {
    if (event_type === 'EVERGOING') return 'Ongoing Program'
    const opts = { month: 'short', day: 'numeric', year: 'numeric' }
    if (!end || start_date === end_date) return start.toLocaleDateString('en-US', opts)
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', opts)}`
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="group">
      <Link href={`/events/${slug}`} className="block">
        <div className="rounded-2xl overflow-hidden border border-border hover:border-headline/20 transition-all duration-300">
          <div className="relative aspect-[21/9] overflow-hidden">
            <Image src={cover_url || fallbackImage || '/images/logo.png'} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {status && <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide ${status.class}`}>{status.text}</span>}
              {typeLabel && <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide bg-black/20 ${typeLabel.class}`}>{typeLabel.text}</span>}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-headline mb-2 group-hover:text-accent transition-colors">{title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary-dynamic mb-3">
              {event.show_date !== false && <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate()}</span>}
              {location && <span className="flex items-center gap-1.5"><MapPin size={13} />{location}</span>}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-headline/60 group-hover:text-headline transition-colors">View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
