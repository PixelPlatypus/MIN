'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Bell, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Link as LinkIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'
import { TableSkeleton } from '@/components/shared/Skeletons'
import ImageUploader from '@/components/admin/ImageUploader'

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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
  const toggleActive = async (notice) => {
    const nextValue = !notice.is_active
    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: nextValue })
      })
      
      if (res.ok) {
        setNotices(notices.map(n => {
          if (n.id === notice.id) return { ...n, is_active: nextValue }
          // If we just activated one, all others must be deactivated
          if (nextValue && n.is_active) return { ...n, is_active: false }
          return n
        }))
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to toggle notice status')
      }
    } catch (err) {
      console.error('Toggle error:', err)
      alert('An error occurred while toggling notice status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return
    
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotices(notices.filter(n => n.id !== id))
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to delete notice')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('An error occurred while deleting notice')
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
        <Link 
          href="/admin/notices/new"
          className="bg-primary text-white px-5 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} />
          <span>New Notice</span>
        </Link>
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
        <TableSkeleton rows={5} cols={4} />
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
                  {notice.image_url ? (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-primary/10">
                       <img src={notice.image_url} alt="Notice" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`p-2.5 rounded-2xl ${notice.is_active ? 'bg-green/10 text-green' : 'bg-text-tertiary/10 text-text-tertiary'}`}>
                      <Bell size={20} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/admin/notices/${notice.id}`}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-text-secondary transition-colors"
                    >
                      <Edit3 size={16} />
                    </Link>
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
    </div>
  )
}
