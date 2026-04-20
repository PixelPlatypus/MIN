'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Search, 
  Loader2, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight,
  Filter,
  MessageSquare,
  User,
  ExternalLink,
  FileText,
  Incite,
  Send
} from 'lucide-react'

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selectedInquiry, setSelectedInquiry] = useState(null)

  useEffect(() => {
    async function fetchInquiries() {
      setLoading(true)
      try {
        const res = await fetch('/api/applications/admin?type=INQUIRY')
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
    fetchInquiries()
  }, [])

  const filtered = inquiries.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.form_data?.subject || '').toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (id, newStatus) => {
    const res = await fetch(`/api/applications/admin/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      setInquiries(inquiries.map(a => a.id === id ? { ...a, status: newStatus } : a))
      if (selectedInquiry?.id === id) setSelectedInquiry({ ...selectedInquiry, status: newStatus })
      // Auto-switch to Responded tab so the item remains visible
      if (newStatus === 'ACCEPTED') setStatusFilter('ACCEPTED')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-1 uppercase">Contact Inquiries</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Manage general questions and feedback from the contact form.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main List */}
        <div className="flex-grow space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:border-primary transition-all shadow-sm">
              <Search size={18} className="text-text-tertiary" />
              <input 
                suppressHydrationWarning
                type="text" 
                placeholder="Search by name, email or subject..." 
                className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-bg-secondary dark:bg-white/5 p-1 rounded-2xl border border-border dark:border-border-dark shadow-inner">
              {[{ id: 'PENDING', label: 'New' }, { id: 'ACCEPTED', label: 'Responded' }, { id: 'ALL', label: 'All' }].map(s => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === s.id
                      ? s.id === 'ACCEPTED'
                        ? 'bg-green dark:bg-green text-white shadow-xl'
                        : 'bg-white dark:bg-primary text-primary dark:text-white shadow-xl'
                      : 'text-text-tertiary hover:scale-105 active:scale-95'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2.5rem] overflow-hidden border border-border dark:border-border-dark shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={48} className="animate-spin text-primary" />
              </div>
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
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner bg-purple-500/10 text-purple-500`}>
                        <MessageSquare size={24} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-black text-lg tracking-tight truncate">{item.name}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                            item.status === 'PENDING' ? 'bg-orange/10 text-orange border-orange/20' : 'bg-green/10 text-green border-green/20'
                          }`}>
                            {item.status === 'PENDING' ? 'New Inquiry' : 'Responded'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-text-tertiary font-bold">
                          <span className="flex items-center gap-1.5 truncate max-w-[200px]"><FileText size={14} /> {item.form_data?.subject || 'No Subject'}</span>
                          <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className={`text-text-tertiary opacity-40 transition-transform ${selectedInquiry?.id === item.id ? 'translate-x-1 opacity-100 text-primary' : ''}`} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-text-tertiary space-y-4">
                <Filter size={48} className="mx-auto opacity-20" />
                <p className="font-bold">No inquiries found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Details Sidebar */}
        <AnimatePresence mode="wait">
          {selectedInquiry ? (
            <motion.div 
              key={selectedInquiry.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[450px] shrink-0"
            >
              <div className="glass rounded-[2.5rem] p-10 border border-border dark:border-border-dark sticky top-8 space-y-10 shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-500">
                      General Inquiry
                    </span>
                    <h3 className="text-3xl font-black tracking-tight leading-none pt-2">{selectedInquiry.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedInquiry(null)}
                    className="p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all text-text-tertiary hover:rotate-90"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4 bg-bg-secondary dark:bg-white/5 p-4 rounded-2xl border border-border dark:border-border-dark group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Sender Email</p>
                      <p className="text-sm font-bold truncate">{selectedInquiry.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-border dark:border-border-dark space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Subject</p>
                      <p className="text-lg font-bold tracking-tight">{selectedInquiry.form_data?.subject}</p>
                    </div>

                    <div className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-border dark:border-border-dark space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Message</p>
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{selectedInquiry.form_data?.message}</p>
                    </div>
                  </div>
                </div>

                {selectedInquiry.status === 'PENDING' ? (
                  <div className="pt-10 border-t border-border dark:border-border-dark space-y-6 relative z-10">
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                      <p className="text-xs font-bold text-text-secondary leading-relaxed">
                        Mark this inquiry as responded once you have replied to the user via email.
                      </p>
                    </div>
                    <button 
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'ACCEPTED')}
                      className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95"
                    >
                      <CheckCircle2 size={20} />
                      Mark as Responded
                    </button>
                  </div>
                ) : (
                  <div className="pt-10 border-t border-border dark:border-border-dark text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-green/10 text-green px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest">
                       <CheckCircle2 size={16} /> Already Responded
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="hidden lg:flex w-[450px] shrink-0 h-full items-center justify-center glass rounded-[2.5rem] border border-dashed border-border dark:border-border-dark text-text-tertiary italic text-sm">
              <div className="text-center space-y-4 opacity-30">
                <MessageSquare size={48} className="mx-auto" />
                <p>Select an inquiry to read the full message</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
