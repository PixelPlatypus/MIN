'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserPlus, 
  Search, 
  Loader2, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  Filter,
  Trash2,
  ExternalLink,
  Wrench,
  FileText
} from 'lucide-react'

const typeColors = {
  VOLUNTEER: 'bg-primary/10 text-primary border-primary/20',
  ORGANIZATION: 'bg-secondary/20 text-secondary-dark border-secondary/20',
  PARTNERSHIP: 'bg-coral/10 text-coral border-coral/20',
}

const statusColors = {
  PENDING: 'bg-orange/10 text-orange border-orange/20',
  REVIEWED: 'bg-cyan/10 text-cyan border-cyan/20',
  ACCEPTED: 'bg-green/10 text-green border-green/20',
  REJECTED: 'bg-coral/10 text-coral border-coral/20',
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    async function fetchApps() {
      setLoading(true)
      try {
        const res = await fetch('/api/applications/admin')
        if (res.ok) {
          const data = await res.json()
          setApps(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to fetch apps:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [])

  const filteredApps = apps.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase())
    
    const matchesFilter = filterType === 'ALL' || app.type === filterType
    
    return matchesSearch && matchesFilter
  })

  const handleUpdateStatus = async (id, newStatus) => {
    const res = await fetch(`/api/applications/admin/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      setApps(apps.map(a => a.id === id ? { ...a, status: newStatus } : a))
      if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, status: newStatus })
    }
  }

  const handleClearAll = async () => {
    try {
      const res = await fetch('/api/applications/admin', { method: 'DELETE' })
      if (res.ok) {
        setApps([])
        setSelectedApp(null)
      } else {
        const err = await res.json()
        alert(`Error: ${err.error || 'Failed to clear applications'}`)
      }
    } catch (err) {
      console.error('Clear All error:', err)
      alert('A network error occurred while clearing applications.')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-1 uppercase">Join Inquiries</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Manage Volunteers, Institutions, and Strategic Partnerships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {apps.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to clear ALL applications? This cannot be undone.')) {
                    handleClearAll()
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-coral/10 text-coral hover:bg-coral hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-xl hover:shadow-coral/20 group"
              >
                <Trash2 size={16} className="transition-transform group-hover:rotate-12" />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main List */}
        <div className="flex-grow space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow glass px-4 py-2 rounded-xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:border-primary transition-all">
              <Search size={18} className="text-text-tertiary" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-bg-secondary dark:bg-white/5 p-1 rounded-xl border border-border dark:border-border-dark">
              {['ALL', 'VOLUNTEER', 'ORGANIZATION', 'PARTNERSHIP'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    filterType === t 
                      ? 'bg-white dark:bg-white/10 shadow-sm text-primary ring-1 ring-border border-transparent' 
                      : 'text-text-tertiary hover:text-text-secondary opacity-60'
                  }`}
                >
                  {t === 'ALL' ? 'Everything' : t.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2.5rem] overflow-hidden border border-border dark:border-border-dark shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={48} className="animate-spin text-primary" />
              </div>
            ) : filteredApps.length > 0 ? (
              <div className="divide-y divide-border dark:divide-border-dark">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`w-full flex items-center justify-between p-6 transition-all hover:bg-bg-secondary/50 dark:hover:bg-white/5 text-left border-l-4 ${
                      selectedApp?.id === app.id ? 'bg-bg-secondary dark:bg-white/5 border-primary' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${typeColors[app.type] || typeColors.VOLUNTEER}`}>
                        {(app.name || 'A')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-black text-lg tracking-tight truncate">{app.name}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusColors[app.status]}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-text-tertiary font-bold">
                          <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(app.created_at).toLocaleDateString()}</span>
                          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${typeColors[app.type]}`}>
                            {app.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className={`text-text-tertiary opacity-40 transition-transform ${selectedApp?.id === app.id ? 'translate-x-1 opacity-100 text-primary' : ''}`} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-text-tertiary space-y-4">
                <Filter size={48} className="mx-auto opacity-20" />
                <p className="font-bold">No matching inquiries found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Details Sidebar */}
        <AnimatePresence mode="wait">
          {selectedApp ? (
            <motion.div 
              key={selectedApp.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[450px] shrink-0"
            >
              <div className="glass rounded-[2.5rem] p-10 border border-border dark:border-border-dark sticky top-8 space-y-10 shadow-2xl overflow-hidden relative">
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-20 rounded-full ${(typeColors[selectedApp.type] || typeColors.VOLUNTEER).split(' ')[1]}`} />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${typeColors[selectedApp.type]}`}>
                      {selectedApp.type}
                    </span>
                    <h3 className="text-3xl font-black tracking-tight leading-none pt-2">{selectedApp.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all text-text-tertiary hover:rotate-90"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 bg-bg-secondary dark:bg-white/5 p-4 rounded-2xl border border-border dark:border-border-dark group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Mail size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Email Address</p>
                        <p className="text-sm font-bold truncate">{selectedApp.email}</p>
                      </div>
                    </div>
                    {selectedApp.phone && (
                      <div className="flex items-center gap-4 bg-bg-secondary dark:bg-white/5 p-4 rounded-2xl border border-border dark:border-border-dark">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary-dark font-bold">
                          <Phone size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Phone Number</p>
                          <p className="text-sm font-bold">{selectedApp.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8 pt-6 relative z-10">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-5 border-b border-primary/10 pb-2">
                      <FileText size={14} /> Submission Details
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      {Object.entries(selectedApp.form_data || {}).map(([key, val]) => (
                        <div key={key} className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{key.replace(/([A-Z])/g, ' $1')}</label>
                          {typeof val === 'string' && val.startsWith('http') ? (
                            <a 
                              href={val} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
                            >
                              <ExternalLink size={14} /> View Document
                            </a>
                          ) : (
                            <p className="text-sm font-medium leading-relaxed bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-border dark:border-border-dark whitespace-pre-wrap">
                              {val}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-border dark:border-border-dark space-y-4 relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-2">Update Disposition</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(selectedApp.id, 'ACCEPTED')}
                      className={`flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
                        selectedApp.status === 'ACCEPTED' 
                          ? 'bg-green text-white shadow-xl shadow-green/20' 
                          : 'bg-green/10 text-green hover:bg-green/100 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 size={16} /> Accept
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}
                      className={`flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
                        selectedApp.status === 'REJECTED' 
                          ? 'bg-coral text-white shadow-xl shadow-coral/20' 
                          : 'bg-coral/10 text-coral hover:bg-coral/100 hover:text-white'
                      }`}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="hidden lg:flex w-[450px] shrink-0 h-full items-center justify-center glass rounded-[2.5rem] border border-dashed border-border dark:border-border-dark text-text-tertiary italic text-sm">
              <div className="text-center space-y-4 opacity-30">
                <Wrench size={48} className="mx-auto" />
                <p>Select a submission for full audit</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
