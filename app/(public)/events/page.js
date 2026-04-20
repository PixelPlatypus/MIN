'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCard from '@/components/public/EventCard'
import { Sparkles, Loader2, Calendar, Filter, Search } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PUBLISHED')
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
      const res = await fetch(`/api/events?status=${filter}`)
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchEvents()
  }, [filter])

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.location?.toLowerCase().includes(search.toLowerCase())
  )

  const upcomingEvents = filteredEvents.filter(e => 
    new Date(e.start_date) >= new Date() || 
    e.event_type === 'RECURRING' || 
    e.event_type === 'EVERGOING'
  )
  
  const pastEvents = filteredEvents.filter(e => 
    new Date(e.start_date) < new Date() && 
    e.event_type !== 'RECURRING' && 
    e.event_type !== 'EVERGOING'
  )

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
            <select 
              className="glass px-6 py-3 rounded-2xl text-base font-semibold border border-primary/10 focus:outline-none focus:border-primary transition-all bg-transparent cursor-pointer shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Past / Archived</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-24">
            {upcomingEvents.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
                  <div className="h-px flex-1 bg-border dark:bg-border-dark" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} fallbackImage={settings?.default_event_cover} />
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold tracking-tight text-text-secondary">Past Events</h2>
                  <div className="h-px flex-1 bg-border dark:bg-border-dark" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} fallbackImage={settings?.default_event_cover} />
                  ))}
                </div>
              </div>
            )}

            {upcomingEvents.length === 0 && pastEvents.length === 0 && (
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
