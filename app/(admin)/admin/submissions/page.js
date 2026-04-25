'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Inbox, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Clock, 
  User, 
  Mail, 
  FileText, 
  FileDown, 
  ChevronRight,
  Check,
  X,
  MessageSquare
} from 'lucide-react'
import { TableSkeleton } from '@/components/shared/Skeletons'

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true)
      try {
        const res = await fetch('/api/submissions')
        const data = await res.json()
        setSubmissions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

  const filtered = submissions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                         s.submitter_name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAction = async (id, status) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: adminNote })
      })
      
      if (res.ok) {
        setSubmissions(submissions.map(s => s.id === id ? { ...s, status } : s))
        setSelectedSubmission(null)
        setAdminNote('')
      } else {
        const err = await res.json()
        alert(err.error || 'Action failed')
      }
    } catch (err) {
      alert('An error occurred')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Content Submissions</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Review and approve user-contributed articles, problems, and resources.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:ring-2 ring-primary/20 transition-all">
          <Search size={18} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-text-tertiary" />
          <select 
            className="glass px-5 py-3 rounded-2xl text-sm font-bold border border-border dark:border-border-dark outline-none bg-transparent cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All Submissions</option>
          </select>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={10} cols={5} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((sub) => (
            <motion.div
              key={sub.id}
              layout
              className={`glass rounded-3xl p-6 border transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                selectedSubmission?.id === sub.id ? 'border-primary ring-1 ring-primary/20' : 'border-border dark:border-border-dark hover:border-primary/50'
              }`}
              onClick={() => setSelectedSubmission(sub)}
            >
              <div className="flex items-center gap-6 flex-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  sub.status === 'APPROVED' ? 'bg-green/10 text-green' : 
                  sub.status === 'REJECTED' ? 'bg-coral/10 text-coral' : 'bg-primary/10 text-primary'
                }`}>
                  {sub.content_type === 'RICHTEXT' ? <FileText size={24} /> : <FileDown size={24} />}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{sub.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1.5"><User size={12} /> {sub.submitter_name}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(sub.created_at).toLocaleDateString()}</span>
                    <span className={`font-black uppercase tracking-widest text-[8px] px-2 py-0.5 rounded-full ${
                      sub.status === 'APPROVED' ? 'bg-green/10 text-green' : 
                      sub.status === 'REJECTED' ? 'bg-coral/10 text-coral' : 'bg-primary/10 text-primary'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-text-tertiary group-hover:translate-x-1 transition-transform" />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-[3rem] border border-dashed border-border dark:border-border-dark">
          <div className="inline-flex p-6 rounded-[2rem] bg-bg-secondary dark:bg-white/5 text-text-tertiary mb-6">
            <Inbox size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2">No Submissions Found</h3>
          <p className="text-text-tertiary">All caught up! There are no new submissions to review.</p>
        </div>
      )}

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl" 
              onClick={() => setSelectedSubmission(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="w-full max-w-4xl glass rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border border-border dark:border-border-dark flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tight">{selectedSubmission.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-text-tertiary font-medium">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {selectedSubmission.submitter_email}</span>
                      <span>•</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedSubmission.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSubmission(null)}
                    className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-text-tertiary hover:bg-coral/20 hover:text-coral transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-10">
                  {selectedSubmission.content_type === 'RICHTEXT' ? (
                    <div className="prose dark:prose-invert max-w-none bg-white/50 dark:bg-white/5 p-8 rounded-[2rem] border border-border dark:border-border-dark" dangerouslySetInnerHTML={{ __html: selectedSubmission.body }} />
                  ) : (
                    <div className="bg-white/50 dark:bg-white/5 p-12 rounded-[2rem] border border-border dark:border-border-dark text-center space-y-6">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                        <FileDown size={32} />
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-bold text-xl">{selectedSubmission.pdf_filename || 'PDF Document'}</h5>
                        <p className="text-sm text-text-tertiary">External link or uploaded file provided by the submitter.</p>
                      </div>
                      <a 
                        href={selectedSubmission.pdf_url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                      >
                        <ExternalLink size={18} />
                        View / Download Document
                      </a>
                    </div>
                  )}

                  {selectedSubmission.status === 'PENDING' && (
                    <div className="space-y-6 pt-10 border-t border-border dark:border-border-dark">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-text-tertiary ml-1">
                          <MessageSquare size={14} />
                          <label className="text-[10px] font-black uppercase tracking-widest">Internal Review Notes (Optional)</label>
                        </div>
                        <textarea 
                          placeholder="Why are you approving/rejecting this? (Internal only)"
                          className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                          rows={3}
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          disabled={processingId === selectedSubmission.id}
                          onClick={() => handleAction(selectedSubmission.id, 'APPROVED')}
                          className="flex-1 bg-green hover:bg-green-dark text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-green/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                          {processingId === selectedSubmission.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                          Approve & Publish
                        </button>
                        <button
                          disabled={processingId === selectedSubmission.id}
                          onClick={() => handleAction(selectedSubmission.id, 'REJECTED')}
                          className="flex-1 bg-coral hover:bg-coral-dark text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-coral/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                          {processingId === selectedSubmission.id ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                          Reject Submission
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
