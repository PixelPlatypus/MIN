'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, MoreVertical, Edit2, Trash2, Filter, CalendarPlus } from 'lucide-react'
import { TableSkeleton } from '@/components/shared/Skeletons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                         event.location?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || event.status === filter
    return matchesSearch && matchesFilter
  })

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this event?')) return

    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setEvents(events.filter(e => e.id !== id))
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Events Management</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Manage your events, schedules, and locations.
          </p>
        </div>
        <Link 
          href="/admin/events/new" 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 w-fit"
        >
          <CalendarPlus size={18} />
          Create Event
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-4 py-2 rounded-xl flex items-center gap-3 border border-border dark:border-border-dark group-focus-within:border-primary transition-all">
          <Search size={18} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-text-tertiary" />
          <select 
            className="glass px-4 py-2 rounded-xl text-sm font-medium border border-border dark:border-border-dark focus:outline-none focus:border-primary transition-all bg-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-sm border border-border dark:border-border-dark">
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary dark:bg-white/5 text-text-tertiary dark:text-text-tertiary-dark text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-bg-secondary/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark flex items-center justify-center">
                          {event.cover_url ? (
                            <img 
                              src={event.cover_url} 
                              alt={event.title} 
                              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                            />
                          ) : (
                            <CalendarPlus size={18} className="text-text-tertiary opacity-50" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold truncate">{event.title}</span>
                          <span className="text-xs text-text-tertiary truncate">{event.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary dark:text-text-secondary-dark font-medium">
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary dark:text-text-secondary-dark">{event.location || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        event.status === 'PUBLISHED' 
                          ? 'bg-green/10 text-green border-green/10' 
                          : event.status === 'DRAFT'
                            ? 'bg-primary/10 text-primary border-primary/10'
                            : 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/10'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/events/${event.id}`}
                          className="p-2 rounded-xl text-text-tertiary hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="p-2 rounded-xl text-text-tertiary hover:text-coral hover:bg-coral/10 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-text-tertiary">No events found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
