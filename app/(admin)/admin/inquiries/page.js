'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Envelope as Mail, 
  MagnifyingGlass as Search, 
  Phone, 
  Calendar, 
  CheckCircle as CheckCircle2, 
  XCircle, 
  Clock, 
  CaretRight as ChevronRight,
  Funnel as Filter,
  ChatTeardropText as MessageSquare,
  FileText,
  PaperPlaneTilt as Send,
  Trash as Trash2,
  CircleNotch as Loader2,
  Archive,
  ArrowSquareOut as ExternalLink,
  Sparkle
} from '@phosphor-icons/react'
import { TableSkeleton } from '@/components/shared/Skeletons'

const STATUS_TABS = [
  { id: 'PENDING', label: 'New', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { id: 'RESPONDED', label: 'Responded', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { id: 'ARCHIVED', label: 'Archived', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  { id: 'ALL', label: 'All Inquiries', color: 'bg-primary/10 text-primary border-primary/20' }
]

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    setLoading(true)
    try {
      const res = await fetch('/api/inquiries')
      if (res.ok) {
        const data = await res.json()
        setInquiries(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = inquiries.filter(item => {
    const term = search.toLowerCase()
    const matchesSearch = 
      (item.name || '').toLowerCase().includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.subject || '').toLowerCase().includes(term) ||
      (item.message || '').toLowerCase().includes(term)
    
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (id, newStatus) => {
    setIsProcessing(true)
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNote }),
      })

      if (res.ok) {
        const updated = await res.json()
        setInquiries(inquiries.map(a => a.id === id ? { ...a, ...updated } : a))
        if (selectedInquiry?.id === id) setSelectedInquiry({ ...selectedInquiry, ...updated })
        setAdminNote('')
        if (newStatus === 'RESPONDED') setStatusFilter('RESPONDED')
      }
    } catch (err) {
      console.error('Update inquiry status error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry permanently?')) return
    
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setInquiries(inquiries.filter(i => i.id !== id))
        if (selectedInquiry?.id === id) setSelectedInquiry(null)
      }
    } catch (err) {
      console.error('Delete inquiry error:', err)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest mb-2">
            <Sparkle size={12} weight="fill" />
            Contact & Inquiries Hub
          </div>
          <h2 className="text-3xl font-black tracking-tight text-dynamic">Public Inquiries</h2>
          <p className="text-auto-secondary text-sm">
            Review, reply, and track messages received from the website contact form.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Inquiries List */}
        <div className="flex-grow space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:border-primary transition-all shadow-sm">
              <Search size={18} className="text-auto-tertiary" />
              <input 
                type="text" 
                placeholder="Search by sender, email, subject or message..." 
                className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-auto-tertiary font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 bg-bg-secondary dark:bg-white/5 p-1.5 rounded-2xl border border-border dark:border-border-dark shadow-inner overflow-x-auto">
              {STATUS_TABS.map(s => {
                const count = inquiries.filter(i => s.id === 'ALL' || i.status === s.id).length
                const isActive = statusFilter === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                        : 'text-auto-tertiary hover:text-dynamic hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                      s.id === 'PENDING' && count > 0
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/40 animate-pulse'
                        : isActive ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-auto-tertiary'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Inquiries Stream */}
          <div className="glass rounded-[2.5rem] overflow-hidden border border-border dark:border-border-dark shadow-sm">
            {loading ? (
              <TableSkeleton rows={8} cols={4} />
            ) : filtered.length > 0 ? (
              <div className="divide-y divide-border dark:divide-border-dark">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedInquiry(item)}
                    className={`w-full flex items-center justify-between p-6 transition-all hover:bg-bg-secondary/50 dark:hover:bg-white/5 text-left border-l-4 ${
                      selectedInquiry?.id === item.id ? 'bg-bg-secondary dark:bg-white/5 border-primary' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
                        item.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                        item.status === 'RESPONDED' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-zinc-500/10 text-zinc-400'
                      }`}>
                        <MessageSquare size={22} weight={item.status === 'PENDING' ? 'fill' : 'regular'} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-base tracking-tight truncate text-dynamic">{item.name}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                            item.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            item.status === 'RESPONDED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-dynamic truncate max-w-md">
                          {item.subject || 'General Inquiry'}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-auto-tertiary font-medium">
                          <span className="truncate">{item.email}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className={`text-auto-tertiary opacity-40 transition-transform ${selectedInquiry?.id === item.id ? 'translate-x-1 opacity-100 text-primary' : ''}`} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-auto-tertiary space-y-4">
                <Filter size={48} className="mx-auto opacity-20" />
                <p className="font-bold text-sm">No inquiries found in this view.</p>
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Detail Inspector */}
        <AnimatePresence mode="wait">
          {selectedInquiry ? (
            <motion.div 
              key={selectedInquiry.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[460px] shrink-0"
            >
              <div className="glass rounded-[2.5rem] p-8 border border-border dark:border-border-dark sticky top-8 space-y-8 shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary">
                      Inquiry Details
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-dynamic pt-2">{selectedInquiry.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      onClick={() => setSelectedInquiry(null)}
                      className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all text-auto-tertiary hover:rotate-90"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>

                {/* Sender Contact Strip */}
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Mail size={18} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-auto-tertiary block">Email Address</span>
                        <p className="text-xs font-bold truncate text-dynamic">{selectedInquiry.email}</p>
                      </div>
                    </div>
                    <a 
                      href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'MIN Inquiry')}`}
                      className="px-3 py-1.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-primary/20 hover:scale-105 transition-all"
                    >
                      <Send size={12} weight="bold" /> Reply
                    </a>
                  </div>

                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-auto-tertiary block">Phone Number</span>
                        <p className="text-xs font-bold text-dynamic">{selectedInquiry.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div className="space-y-3 relative z-10">
                  <div className="p-5 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary block">Subject</span>
                    <p className="text-sm font-bold text-dynamic">{selectedInquiry.subject || 'General Inquiry'}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary block">Message Body</span>
                    <p className="text-xs text-dynamic font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                {/* Status Update & Notes */}
                <div className="pt-6 border-t border-border dark:border-border-dark space-y-4 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary block">
                      Internal Staff Notes
                    </label>
                    <textarea 
                      placeholder="Add notes on reply status, follow-up person, or decision..."
                      className="w-full bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                      rows={3}
                      value={adminNote || selectedInquiry.admin_notes || ''}
                      onChange={(e) => setAdminNote(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {selectedInquiry.status !== 'RESPONDED' && (
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(selectedInquiry.id, 'RESPONDED')}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} weight="bold" />}
                        Mark Responded
                      </button>
                    )}

                    {selectedInquiry.status !== 'ARCHIVED' && (
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(selectedInquiry.id, 'ARCHIVED')}
                        className="flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-800 text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
                      >
                        <Archive size={16} weight="bold" />
                        Archive
                      </button>
                    )}

                    {selectedInquiry.status !== 'PENDING' && (
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(selectedInquiry.id, 'PENDING')}
                        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50"
                      >
                        <Clock size={16} weight="bold" />
                        Move to New
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="hidden lg:flex w-[460px] shrink-0 h-full items-center justify-center glass rounded-[2.5rem] border border-dashed border-border dark:border-border-dark text-auto-tertiary italic text-sm">
              <div className="text-center space-y-4 opacity-30 py-32">
                <MessageSquare size={48} className="mx-auto" />
                <p className="font-bold">Select an inquiry to view details and reply</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
