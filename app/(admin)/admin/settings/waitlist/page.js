'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Trash2, 
  Search, 
  Loader2, 
  Bell, 
  Filter, 
  UserPlus,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function WaitlistPage() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  useEffect(() => {
    async function fetchWaitlist() {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/waitlist')
        if (res.ok) {
          const data = await res.json()
          setEmails(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error('Failed to fetch waitlist:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchWaitlist()
  }, [])

  const filtered = emails.filter(item => {
    const matchesSearch = item.email.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this email from the alert list?')) return
    
    try {
      const res = await fetch(`/api/admin/waitlist?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEmails(emails.filter(e => e.id !== id))
      }
    } catch (err) {
      console.error('Delete waitlist error:', err)
    }
  }

  const categories = ['ALL', ...new Set(emails.map(e => e.category).filter(Boolean))]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-1 uppercase">Intake Alert List</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Manage users who are waiting for admission programs to reopen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:border-primary transition-all shadow-sm">
              <Search size={18} className="text-text-tertiary" />
              <input 
                type="text" 
                placeholder="Search by email..." 
                className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    categoryFilter === c 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'bg-bg-secondary dark:bg-white/5 text-text-tertiary border-border dark:border-white/5 hover:border-primary/50'
                  }`}
                >
                  {c}
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
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border dark:border-border-dark">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary">Email Address</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary">Category</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary">Signed Up</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {filtered.map((item) => (
                      <tr key={item.id} className="group hover:bg-bg-secondary/50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <Mail size={16} />
                            </div>
                            <span className="font-bold text-sm">{item.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 rounded-full bg-bg-secondary dark:bg-white/5 text-[10px] font-black uppercase tracking-widest border border-border dark:border-white/5">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs text-text-tertiary font-medium">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-text-tertiary hover:text-coral transition-all"
                            title="Remove from list"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-24 text-text-tertiary space-y-4">
                <Bell size={48} className="mx-auto opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">No active alerts for this criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
