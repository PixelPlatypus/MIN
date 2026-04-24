'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCard from '@/components/public/EventCard'
import { Sparkles, Loader2, Calendar, Filter, Search, ChevronDown } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Events settings load error', err))
  }, [])

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      // Fetch all published events and filter locally
      const res = await fetch(`/api/events?status=PUBLISHED`)
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.location?.toLowerCase().includes(search.toLowerCase())
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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const getPriority = (e) => {
      // Priority 1: Ongoing (Standard events that have started and not ended)
      // Priority 2: Upcoming (Standard events that haven't started)
      // Priority 3: Recurring
      // Priority 4: Evergoing
      // Priority 5: Past (Standard events that have ended)
      
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

    // Secondary sort: By date (closest first)
    if (a.start_date && b.start_date) {
      return new Date(a.start_date) - new Date(b.start_date)
    }
    return 0
  })

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
          >
            <Calendar size={16} />
            {settings?.events_title || "Events"}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            {settings?.events_subtitle || "Our Events & Activities"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed max-w-3xl mx-auto"
          >
            {settings?.events_description || "Join us in our journey to make mathematics engaging through camps, bootcamps, workshops, and more."}
          </motion.p>
        </div>
      </section>

      {/* Filters & Search */}
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

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-24">
            {sortedEvents.length > 0 ? (
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold tracking-tight text-primary">Events</h2>
                  <div className="h-px flex-1 bg-primary/20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} fallbackImage={settings?.default_event_cover} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-24 glass rounded-[3rem]">
                <p className="text-xl text-text-tertiary">No events found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
