'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, MoreVertical, Edit2, Trash2, Filter, Loader2, Layers } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true)
      const res = await fetch('/api/programs')
      const data = await res.json()
      setPrograms(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchPrograms()
  }, [])

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(search.toLowerCase()) || 
                         program.tagline?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || program.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Programs Management</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Manage your core programs, descriptions, and tags.
          </p>
        </div>
        <div className="bg-bg-secondary dark:bg-white/5 px-4 py-2 rounded-xl text-xs font-semibold text-text-tertiary flex items-center gap-2 border border-border dark:border-border-dark">
          <Layers size={14} />
          {programs.length} Programs Seeded
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-4 py-2 rounded-xl flex items-center gap-3 border border-border dark:border-border-dark group-focus-within:border-primary transition-all">
          <Search size={18} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search programs..." 
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
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Programs Table */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-sm border border-border dark:border-border-dark">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary dark:bg-white/5 text-text-tertiary dark:text-text-tertiary-dark text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Tagline</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-bg-secondary/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 border border-primary/20">
                          <img 
                            src={program.cover_url || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop'} 
                            alt={program.name} 
                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold truncate">{program.name}</span>
                          <span className="text-xs text-text-tertiary truncate">{program.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary dark:text-text-secondary-dark line-clamp-1">{program.tagline || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-text-tertiary">{program.display_order}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        program.status === 'ACTIVE' 
                          ? 'bg-green/10 text-green border-green/10' 
                          : 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/10'
                      }`}>
                        {program.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/programs/${program.id}`}
                        className="inline-flex p-2 rounded-xl text-text-tertiary hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Edit2 size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-text-tertiary">No programs found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
