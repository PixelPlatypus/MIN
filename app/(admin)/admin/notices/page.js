'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Plus, 
  Search, 
  Loader2, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Link as LinkIcon,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    cta_text: '',
    cta_url: '',
    is_active: true,
    starts_at: '',
    ends_at: ''
  })

  useEffect(() => {
    fetchNotices()
  }, [])

  async function fetchNotices() {
    setLoading(true)
    try {
      const res = await fetch('/api/notices')
      const data = await res.json()
      if (res.ok) setNotices(data)
    } catch (err) {
      console.error('Fetch notices error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice)
      setFormData({
        title: notice.title,
        body: notice.body,
        cta_text: notice.cta_text || '',
        cta_url: notice.cta_url || '',
        is_active: notice.is_active,
        starts_at: notice.starts_at ? notice.starts_at.split('T')[0] : '',
        ends_at: notice.ends_at ? notice.ends_at.split('T')[0] : ''
      })
    } else {
      setEditingNotice(null)
      setFormData({
        title: '',
        body: '',
        cta_text: '',
        cta_url: '',
        is_active: true,
        starts_at: '',
        ends_at: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    
    const url = editingNotice ? `/api/notices/${editingNotice.id}` : '/api/notices'
    const method = editingNotice ? 'PATCH' : 'POST'
    
    // Clean data: convert empty dates to null
    const cleanData = {
      ...formData,
      starts_at: formData.starts_at || null,
      ends_at: formData.ends_at || null
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      })
      
      if (res.ok) {
        setIsModalOpen(false)
        fetchNotices()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to save notice')
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setFormLoading(false)
    }
  }

  const toggleActive = async (notice) => {
    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !notice.is_active })
      })
      if (res.ok) {
        setNotices(notices.map(n => n.id === notice.id ? { ...n, is_active: !n.is_active } : n))
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return
    
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotices(notices.filter(n => n.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.body.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-2">Popup Notices</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Manage global alerts, announcements, and modal popups.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-5 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} />
          <span>New Notice</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:ring-2 ring-primary/20 transition-all">
          <Search size={18} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search notices by title or content..." 
            className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-text-tertiary animate-pulse font-medium">Loading notices...</p>
        </div>
      ) : filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <motion.div 
              layout
              key={notice.id}
              className="glass rounded-[2rem] p-6 border border-border dark:border-border-dark flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-2xl ${notice.is_active ? 'bg-green/10 text-green' : 'bg-text-tertiary/10 text-text-tertiary'}`}>
                    <Bell size={20} />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(notice)}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-text-secondary transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(notice.id)}
                      className="p-2 hover:bg-coral/10 rounded-xl text-coral transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold truncate mb-1">{notice.title}</h3>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark line-clamp-3 leading-relaxed">
                    {notice.body}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                  {notice.is_active ? (
                    <span className="px-2.5 py-1 rounded-full bg-green/10 text-green border border-green/20 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-text-tertiary/10 text-text-tertiary border border-text-tertiary/20 flex items-center gap-1">
                      <AlertCircle size={10} /> Inactive
                    </span>
                  )}
                  {notice.cta_text && (
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                      <LinkIcon size={10} /> Link: {notice.cta_text}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border dark:border-border-dark flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Calendar size={14} />
                  <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notice.is_active}
                    onChange={() => toggleActive(notice)}
                  />
                  <div className="w-11 h-6 bg-text-tertiary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-[3rem] border border-dashed border-border dark:border-border-dark">
          <div className="inline-flex p-6 rounded-[2rem] bg-bg-secondary dark:bg-white/5 text-text-tertiary mb-6">
            <Bell size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2">No notices found</h3>
          <p className="text-text-tertiary">Start by creating your first popup announcement.</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] shadow-2xl overflow-hidden border border-border dark:border-border-dark"
            >
              <div className="p-8 sm:p-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black tracking-tight">
                    {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary ml-1">Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Join the JMOC 2026!"
                      className="w-full glass px-5 py-3 rounded-2xl border border-border dark:border-border-dark focus:ring-2 ring-primary/20 outline-none transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary ml-1">Content / Message</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="What should the announcement say?"
                      className="w-full glass px-5 py-4 rounded-2xl border border-border dark:border-border-dark focus:ring-2 ring-primary/20 outline-none transition-all resize-none"
                      value={formData.body}
                      onChange={(e) => setFormData({...formData, body: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary ml-1">CTA Button Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Register Now"
                        className="w-full glass px-5 py-3 rounded-2xl border border-border dark:border-border-dark focus:ring-2 ring-primary/20 outline-none transition-all"
                        value={formData.cta_text}
                        onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary ml-1">CTA URL</label>
                      <input 
                        type="url" 
                        placeholder="https://..."
                        className="w-full glass px-5 py-3 rounded-2xl border border-border dark:border-border-dark focus:ring-2 ring-primary/20 outline-none transition-all"
                        value={formData.cta_url}
                        onChange={(e) => setFormData({...formData, cta_url: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary ml-1">Starts At</label>
                      <input 
                        type="date" 
                        className="w-full glass px-5 py-3 rounded-2xl border border-border dark:border-border-dark focus:ring-2 ring-primary/20 outline-none transition-all"
                        value={formData.starts_at}
                        onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary ml-1">Ends At</label>
                      <input 
                        type="date" 
                        className="w-full glass px-5 py-3 rounded-2xl border border-border dark:border-border-dark focus:ring-2 ring-primary/20 outline-none transition-all"
                        value={formData.ends_at}
                        onChange={(e) => setFormData({...formData, ends_at: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="is_active"
                      className="w-5 h-5 rounded-lg accent-primary"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    <label htmlFor="is_active" className="text-sm font-bold cursor-pointer">Set as active immediately</label>
                  </div>

                  <div className="flex justify-end gap-3 pt-6">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 rounded-2xl font-bold text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={formLoading}
                      className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {formLoading && <Loader2 size={18} className="animate-spin" />}
                      {editingNotice ? 'Update Notice' : 'Post Notice'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
