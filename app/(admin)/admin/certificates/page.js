// app/(admin)/admin/certificates/page.js
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MagnifyingGlass as Search, Trash as Trash2, PencilSimple as Edit2, Funnel as Filter, Trophy, UploadSimple, ShieldWarning, CheckCircle, Warning, X, ToggleLeft, ToggleRight, ArrowSquareOut } from '@phosphor-icons/react'
import { TableSkeleton } from '@/components/shared/Skeletons'
import Link from 'next/link'
import BulkUploadModal from '@/components/admin/BulkUploadModal'

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterEvent, setFilterEvent] = useState('all')
  
  // Bulk upload modal state
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  
  // Active tab: 'certificates' or 'event_controls'
  const [activeTab, setActiveTab] = useState('certificates')

  const fetchData = async () => {
    setLoading(true)
    try {
      const url = new URL('/api/admin/certificates', window.location.origin)
      if (search) url.searchParams.set('search', search)
      if (filterEvent !== 'all') url.searchParams.set('eventId', filterEvent)
      if (filterStatus !== 'all') url.searchParams.set('status', filterStatus)

      const [resCerts, resEvents] = await Promise.all([
        fetch(url.toString()),
        fetch('/api/events')
      ])

      if (resCerts.ok) {
        const certData = await resCerts.json()
        setCerts(Array.isArray(certData) ? certData : [])
      }
      if (resEvents.ok) {
        const eventData = await resEvents.json()
        setEvents(Array.isArray(eventData) ? eventData : [])
      }
    } catch (err) {
      console.error('Error fetching certificates data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 300) // Debounce search
    return () => clearTimeout(timer)
  }, [search, filterStatus, filterEvent])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this certificate? This action cannot be undone.')) return
    
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCerts(prev => prev.filter(c => c.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete certificate')
      }
    } catch (err) {
      alert('Network error deleting certificate')
    }
  }

  const handleToggleValid = async (cert) => {
    const nextValid = !cert.is_valid
    const actionText = nextValid ? 'restore (re-validate)' : 'revoke'
    if (!confirm(`Are you sure you want to ${actionText} this certificate?`)) return

    try {
      const res = await fetch(`/api/admin/certificates/${cert.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_valid: nextValid })
      })

      if (res.ok) {
        const updated = await res.json()
        setCerts(prev => prev.map(c => c.id === cert.id ? updated : c))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update validity')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const handleToggleEventVerification = async (event) => {
    const nextEnabled = !event.certificates_enabled
    const actionText = nextEnabled ? 'enable' : 'disable'
    if (!confirm(`Are you sure you want to ${actionText} certificate verification for event "${event.title}"?`)) return

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates_enabled: nextEnabled })
      })

      if (res.ok) {
        const updated = await res.json()
        setEvents(prev => prev.map(e => e.id === event.id ? { ...e, certificates_enabled: updated.certificates_enabled } : e))
        // Re-fetch certs to sync statuses
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update event settings')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mathsinitiatives.org.np'

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Certificates Management</h2>
          <p className="text-auto-secondary text-sm">
            Issue, verify, revoke, and manage credentials and events certificates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsBulkOpen(true)}
            className="glass hover:bg-bg-secondary dark:hover:bg-white/5 border border-border text-auto-secondary px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
          >
            <UploadSimple size={18} />
            Bulk CSV Upload
          </button>
          <Link 
            href="/admin/certificates/new" 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Issue Certificate
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border dark:border-border-dark">
        <button 
          onClick={() => setActiveTab('certificates')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'certificates' ? 'border-primary text-primary' : 'border-transparent text-auto-tertiary hover:text-auto-secondary'}`}
        >
          Roster Certificates
        </button>
        <button 
          onClick={() => setActiveTab('event_controls')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'event_controls' ? 'border-primary text-primary' : 'border-transparent text-auto-tertiary hover:text-auto-secondary'}`}
        >
          Event Controls
        </button>
      </div>

      {activeTab === 'certificates' ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 glass px-4 py-2 rounded-xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:border-primary transition-all">
              <Search size={18} className="text-auto-tertiary" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-auto-tertiary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-auto-tertiary" />
                <select 
                  className="glass px-4 py-2 rounded-xl text-sm font-medium border border-border dark:border-border-dark focus:outline-none focus:border-primary transition-all bg-transparent"
                  value={filterEvent}
                  onChange={(e) => setFilterEvent(e.target.value)}
                >
                  <option value="all">All Events</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>

              <select 
                className="glass px-4 py-2 rounded-xl text-sm font-medium border border-border dark:border-border-dark focus:outline-none focus:border-primary transition-all bg-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="valid">Valid / Active</option>
                <option value="revoked">Revoked</option>
                <option value="published">Published / Visible</option>
                <option value="draft">Draft / Hidden</option>
              </select>
            </div>
          </div>

          {/* Roster Table */}
          <div className="glass rounded-[2rem] overflow-hidden shadow-sm border border-border dark:border-border-dark">
            {loading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : certs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg-secondary dark:bg-white/5 text-auto-tertiary text-[10px] uppercase tracking-widest font-bold">
                      <th className="px-6 py-4">Recipient</th>
                      <th className="px-6 py-4">Event Name</th>
                      <th className="px-6 py-4">Issued Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Distribution</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {certs.map((cert) => {
                      // Check if parent event is disabled
                      const parentEventDisabled = cert.event_id && cert.events && !cert.events.certificates_enabled

                      return (
                        <tr key={cert.id} className="hover:bg-bg-secondary/50 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold truncate">{cert.recipient_name}</span>
                              <span className="text-xs text-auto-tertiary truncate">{cert.recipient_email || 'No Email'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-auto-secondary">{cert.event_name || 'N/A'}</span>
                              <span className="text-[10px] text-auto-tertiary font-mono">{cert.program_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-auto-secondary font-medium">
                              {new Date(cert.issued_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            {cert.expiry_date && (
                              <div className="text-[10px] text-auto-tertiary">
                                Expires: {new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {parentEventDisabled ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-amber-500/10 text-amber-500 border-amber-500/10" title="Suspended because event certificates are disabled">
                                <Warning size={12} />
                                Event Suspended
                              </span>
                            ) : cert.is_valid ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-green/10 text-green border-green/10">
                                <CheckCircle size={12} />
                                Valid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-coral/10 text-coral border-coral/10">
                                <ShieldWarning size={12} />
                                Revoked
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`text-[9px] font-bold uppercase tracking-widest w-fit px-2 py-0.5 rounded ${cert.is_visible ? 'bg-primary/10 text-primary' : 'bg-text-tertiary/10 text-auto-tertiary'}`}>
                                {cert.is_visible ? 'Visible' : 'Hidden'}
                              </span>
                              <span className={`text-[9px] font-semibold tracking-wide w-fit ${cert.email_sent ? 'text-green' : 'text-auto-tertiary'}`}>
                                {cert.email_sent ? '✓ Email Sent' : '✗ Not Emailed'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {cert.cert_uuid && (
                                <a 
                                  href={`/verify/${cert.cert_uuid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl text-auto-tertiary hover:text-primary hover:bg-primary/10 transition-all"
                                  title="View Public Verification Link"
                                >
                                  <ArrowSquareOut size={18} />
                                </a>
                              )}
                              <Link 
                                href={`/admin/certificates/${cert.id}`}
                                className="p-2 rounded-xl text-auto-tertiary hover:text-primary-dark dark:duration-75 hover:bg-primary/10 transition-all"
                                title="Edit Certificate"
                              >
                                <Edit2 size={18} />
                              </Link>
                              <button 
                                onClick={() => handleToggleValid(cert)}
                                className={`p-2 rounded-xl transition-all ${cert.is_valid ? 'text-auto-tertiary hover:text-coral hover:bg-coral/10' : 'text-green hover:bg-green/10'}`}
                                title={cert.is_valid ? 'Revoke Certificate' : 'Re-Validate Certificate'}
                              >
                                <ShieldWarning size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(cert.id)}
                                className="p-2 rounded-xl text-auto-tertiary hover:text-coral hover:bg-coral/10 transition-all"
                                title="Delete Certificate"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-24">
                <Trophy size={48} className="mx-auto text-auto-tertiary mb-3 opacity-30" />
                <p className="text-auto-tertiary">No certificates found.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Event Controls Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="glass rounded-[2rem] p-6 border border-border dark:border-border-dark space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    event.status === 'PUBLISHED' 
                      ? 'bg-green/10 text-green border-green/10' 
                      : 'bg-primary/10 text-primary border-primary/10'
                  }`}>
                    {event.status}
                  </span>
                  <span className="text-xs font-mono text-auto-tertiary">{event.slug}</span>
                </div>
                <h4 className="text-base font-bold text-auto-primary line-clamp-1">{event.title}</h4>
                <p className="text-xs text-auto-tertiary mt-1">
                  Location: {event.location || 'N/A'} • {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="pt-4 border-t border-border dark:border-border-dark flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">Verify Certificates</span>
                  <span className="text-[10px] text-auto-tertiary">Allow public searches for this event</span>
                </div>
                <button
                  onClick={() => handleToggleEventVerification(event)}
                  className="text-primary hover:scale-105 transition-transform"
                >
                  {event.certificates_enabled ? (
                    <ToggleRight size={40} weight="fill" />
                  ) : (
                    <ToggleLeft size={40} className="opacity-50" />
                  )}
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="col-span-full text-center py-24 glass rounded-[2rem]">
              <p className="text-auto-tertiary">No events found to configure.</p>
            </div>
          )}
        </div>
      )}

      {/* CSV Bulk Upload Modal */}
      <BulkUploadModal 
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onSuccess={() => {
          fetchData()
        }}
      />
    </div>
  )
}
