'use client'
import { useState } from 'react'
import EventCard from '@/components/public/EventCard'
import { Funnel as Filter, MagnifyingGlass as Search, CaretDown as ChevronDown } from '@phosphor-icons/react'

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
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-5xl mx-auto mb-16">
        <div className="flex-1 card-brand rounded-2xl px-5 py-3.5 flex items-center gap-3 transition-colors focus-within:border-primary/40 dark:focus-within:border-secondary/50">
          <Search size={20} className="text-primary dark:text-secondary shrink-0" />
          <input 
            type="text" 
            placeholder="Search events by title or location..." 
            className="bg-transparent border-none text-base focus:outline-none w-full min-w-0 placeholder:text-auto-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-primary dark:text-secondary shrink-0" />
          <div className="relative group flex-1 md:flex-none">
            <select 
              className="card-brand rounded-2xl w-full pl-5 pr-12 py-3.5 text-base font-semibold focus:outline-none focus:border-primary/40 dark:focus:border-secondary/50 transition-colors cursor-pointer appearance-none min-w-[180px] dark:[&>option]:text-black"
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
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-auto-tertiary pointer-events-none group-focus-within:text-primary dark:group-focus-within:text-secondary transition-colors" />
          </div>
        </div>
      </div>

      <div className="space-y-24">
        {sortedEvents.length > 0 ? (
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Events</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent dark:from-secondary/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} fallbackImage={fallbackImage} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24 px-6 card-brand rounded-[2.5rem]">
            <p className="text-xl text-auto-tertiary">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
