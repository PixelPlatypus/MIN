'use client'
import { useState } from 'react'
import EventCard from '@/components/public/EventCard'
import { Search, ChevronDown } from 'lucide-react'

export default function EventsView({ initialEvents, fallbackImage }) {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const filtered = initialEvents.filter(event => {
    const ms = (event.title || '').toLowerCase().includes(search.toLowerCase()) || (event.location || '').toLowerCase().includes(search.toLowerCase())
    if (!ms) return false; if (filter === 'ALL') return true
    const start = event.start_date ? new Date(event.start_date) : null; if (start) start.setHours(0, 0, 0, 0)
    const end = new Date(event.end_date || event.start_date); end.setHours(0, 0, 0, 0)
    if (filter === 'ONGOING') { if (event.event_type === 'RECURRING' || event.event_type === 'EVERGOING') return true; return start && start <= today && end >= today }
    if (filter === 'UPCOMING') { if (event.event_type === 'RECURRING' || event.event_type === 'EVERGOING') return false; return start && start > today }
    if (filter === 'PAST') { if (event.event_type === 'RECURRING' || event.event_type === 'EVERGOING') return false; return end < today }
    if (filter === 'RECURRING') return event.event_type === 'RECURRING'; if (filter === 'EVERGOING') return event.event_type === 'EVERGOING'
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const p = (e) => { if (e.event_type === 'RECURRING') return 3; if (e.event_type === 'EVERGOING') return 4; if (!e.start_date) return 2; const s = new Date(e.start_date); s.setHours(0, 0, 0, 0); const ed = new Date(e.end_date || e.start_date); ed.setHours(0, 0, 0, 0); if (ed < today) return 5; if (s <= today && ed >= today) return 1; if (s > today) return 2; return 2 }
    return p(a) - p(b) || (a.start_date && b.start_date ? new Date(a.start_date) - new Date(b.start_date) : 0)
  })

  return (
    <section className="px-6 md:px-12 lg:px-20">
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-12">
        <div className="flex-1 rounded-xl border border-border bg-bg-secondary flex items-center gap-3 px-5 py-3.5"><Search size={18} className="text-text-tertiary-dynamic" /><input type="text" placeholder="Search events..." className="bg-transparent border-none text-sm focus:outline-none w-full text-text-primary-dynamic placeholder:text-text-tertiary-dynamic" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="relative"><select className="rounded-xl border border-border bg-bg-secondary pl-4 pr-10 py-3.5 text-sm font-medium text-text-primary-dynamic focus:outline-none focus:border-headline/50 transition-colors appearance-none cursor-pointer" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="ALL">All Events</option><option value="ONGOING">Ongoing</option><option value="UPCOMING">Upcoming</option><option value="PAST">Past</option><option value="RECURRING">Recurring</option><option value="EVERGOING">Evergoing</option></select><ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary-dynamic pointer-events-none" /></div>
      </div>
      {sorted.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{sorted.map((event, i) => <EventCard key={event.id} event={event} index={i} fallbackImage={fallbackImage} />)}</div> : <div className="text-center py-24 rounded-2xl border border-border bg-surface"><p className="text-lg text-text-secondary-dynamic">No events found matching your criteria.</p></div>}
    </section>
  )
}
