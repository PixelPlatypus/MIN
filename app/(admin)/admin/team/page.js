'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, MoreVertical, Edit2, Trash2, Filter, Loader2, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminTeamPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true)
      try {
        const res = await fetch('/api/team')
        const data = await res.json()
        setMembers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch team:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(search.toLowerCase()) || 
                          member.position?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'current' && !member.farewell_date) ||
                         (filter === 'alumni' && member.farewell_date)
    return matchesSearch && matchesFilter
  })

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete ${name} from the team? This action cannot be undone.`)) return

    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMembers(members.filter(m => m.id !== id))
      } else {
        const err = await res.json()
        alert(`Delete failed: ${err.error || 'Unknown error'}`)
      }
    } catch (err) {
      alert(`Network error: ${err.message}`)
    }
  }

  const handleEdit = (id) => {
    console.log(`Navigating to edit team member: ${id}`)
    router.push(`/admin/team/${id}`)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1 text-text-main dark:text-white">Team Management</h2>
          <p className="text-text-secondary dark:text-text-tertiary text-sm">
            Manage your team members, their roles, and tenures.
          </p>
        </div>
        <button 
          onClick={() => router.push('/admin/team/new')}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 w-fit active:scale-95"
        >
          <UserPlus size={18} />
          Add Member
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-white/10 group-focus-within:border-primary transition-all shadow-sm">
          <Search size={18} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by name or position..." 
            className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-2xl border border-border dark:border-white/10">
            <Filter size={18} className="text-text-tertiary" />
            <select 
              className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Members</option>
              <option value="current">Current Only</option>
              <option value="alumni">Alumni Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Table */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-sm border border-border dark:border-white/10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-bg-secondary dark:bg-white/5 text-text-tertiary dark:text-text-tertiary-dark text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-5 border-b border-border dark:border-white/10">Member</th>
                  <th className="px-8 py-5 border-b border-border dark:border-white/10">Position</th>
                  <th className="px-8 py-5 border-b border-border dark:border-white/10">Tenure</th>
                  <th className="px-8 py-5 border-b border-border dark:border-white/10">Status</th>
                  <th className="px-8 py-5 border-b border-border dark:border-white/10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-white/5">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="group hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05] transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20 shadow-inner">
                          <img 
                            src={member.photo_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop'} 
                            alt={member.name} 
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black truncate text-text-main dark:text-white">{member.name}</span>
                          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Joined {new Date(member.joined_date).getFullYear()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-text-secondary dark:text-text-tertiary">{member.position}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center justify-center text-xs font-black text-primary px-4 py-1.5 rounded-full bg-primary/10 border border-primary/10 shadow-sm">
                        {member.tenure}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {member.farewell_date ? (
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-coral/10 text-coral border border-coral/20">
                          Alumni
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(member.id)}
                          title="Edit Member"
                          className="p-2.5 rounded-xl text-text-tertiary hover:text-primary hover:bg-primary/10 transition-all active:scale-95"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id, member.name)}
                          title="Delete Member"
                          className="p-2.5 rounded-xl text-text-tertiary hover:text-coral hover:bg-coral/10 transition-all active:scale-95"
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
          <div className="text-center py-32 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-bg-secondary dark:bg-white/5 rounded-3xl flex items-center justify-center text-text-tertiary">
              <Search size={32} />
            </div>
            <p className="text-sm font-bold text-text-tertiary">No team members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
