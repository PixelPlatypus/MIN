'use client'
import { useState } from 'react'
import EventCard from '@/components/public/EventCard'
import { Filter, Search, ChevronDown } from 'lucide-react'

export default function EventsView({ initialEvents, fallbackImage }) {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredEvents = initialEvents.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (event.location || '').toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false

    if (filter === 'ALL') return true
    
    const start = event.start_date ? new Date(event.start_date) : null
    if (start) start.setHours(0, 0, 0, 0)
    const end = new Date(event.end_date || event.start_date)
    end.setHours(0, 0, 0, 0)

    if (filter === 'ONGOING') {
      if (event.event_type === 'RECURRING' || event.event_type === 'EVERGOING') return true
      return start && start <= today && end >= today
    }
    if (filter === 'UPCOMING') {
      if (event.event_type === 'RECURRING' || event.event_type === 'EVERGOING') return false
      return start && start > today
    }
    if (filter === 'PAST') {
      if (event.event_type === 'RECURRING' || event.event_type === 'EVERGOING') return false
      return end < today
    }
    if (filter === 'RECURRING') return event.event_type === 'RECURRING'
    if (filter === 'EVERGOING') return event.event_type === 'EVERGOING'
    
    return true
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const getPriority = (e) => {
      if (e.event_type === 'RECURRING') return 3
      if (e.event_type === 'EVERGOING') return 4
      
      if (!e.start_date) return 2
      const start = new Date(e.start_date); start.setHours(0, 0, 0, 0)
      const end = new Date(e.end_date || e.start_date); end.setHours(0, 0, 0, 0)
      
      if (end < today) return 5
      if (start <= today && end >= today) return 1
      if (start > today) return 2
      return 2
    }

    const priorityA = getPriority(a)
    const priorityB = getPriority(b)

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    if (a.start_date && b.start_date) {
      return new Date(a.start_date) - new Date(b.start_date)
    }
    return 0
  })

  return (
    <section className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto mb-16">
        <div className="flex-1 glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-primary/10 group-focus-within:border-primary transition-all shadow-sm">
          <Search size={20} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search events by title or location..." 
            className="bg-transparent border-none text-base focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-text-tertiary" />
          <div className="relative group">
            <select 
              className="glass pl-6 pr-12 py-3 rounded-2xl text-base font-semibold border border-primary/10 focus:outline-none focus:border-primary transition-all bg-transparent cursor-pointer shadow-sm appearance-none min-w-[160px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Events</option>
              <option value="ONGOING">Ongoing Events</option>
              <option value="UPCOMING">Upcoming Events</option>
              <option value="PAST">Past Events</option>
              <option value="RECURRING">Recurring Events</option>
              <option value="EVERGOING">Evergoing Events</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>
      </div>

      <div className="space-y-24">
        {sortedEvents.length > 0 ? (
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight text-primary">Events</h2>
              <div className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} fallbackImage={fallbackImage} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-[3rem]">
            <p className="text-xl text-text-tertiary">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
