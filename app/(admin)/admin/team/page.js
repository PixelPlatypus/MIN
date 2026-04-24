'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, MoreVertical, Edit2, Trash2, Filter, Loader2, UserPlus, Clock, Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const statusColors = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  ALUMNI: 'bg-orange/10 text-orange border-orange/20',
  INACTIVE: 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20',
  REMOVED: 'bg-coral/10 text-coral border-coral/20',
}

const statusOrder = {
  ACTIVE: 1,
  ALUMNI: 2,
  INACTIVE: 3,
  REMOVED: 4
}

const roleOrder = {
  President: 1,
  Manager: 2,
  MINion: 3
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [tenureFilter, setTenureFilter] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [settings, setSettings] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchInitialData()
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
  }, [])

  async function fetchInitialData() {
    setLoading(true)
    try {
      const res = await fetch('/api/team?all=true')
      if (res.ok) {
        const data = await res.json()
        setMembers(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Failed to fetch initial data:', err)
    } finally {
      setLoading(false)
    }
  }

  const uniqueTenures = [...new Set(members.map(m => m.tenure).filter(Boolean))].sort((a, b) => b.localeCompare(a))

  const filteredMembers = members
    .filter(member => {
      const matchesSearch = member.name?.toLowerCase().includes(search.toLowerCase()) || 
                            member.position?.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = filter === 'all' || member.status === filter.toUpperCase()
      
      // Intelligent Tenure Logic:
      // 1. If 'Every Tenure' is selected, show all.
      // 2. If a specific year is selected:
      //    - Show if they joined in that exact year.
      //    - Show if (Still ACTIVE OR No Farewell Date) AND Joined BEFORE/IN that year.
      let matchesTenure = tenureFilter === 'all'
      if (!matchesTenure) {
        const filterYear = parseInt(tenureFilter)
        const joinedYear = parseInt(member.tenure)
        let leftYear = joinedYear
        if (member.farewell_date) {
          const farewellDate = new Date(member.farewell_date)
          const year = farewellDate.getFullYear()
          const month = farewellDate.getMonth()
          leftYear = month >= 6 ? year : year - 1
          if (leftYear < joinedYear) leftYear = joinedYear
        } else if (member.status === 'ACTIVE') {
          leftYear = new Date().getFullYear()
        }
        
        matchesTenure = filterYear >= joinedYear && filterYear <= leftYear
      }
      
      return matchesSearch && matchesStatus && matchesTenure
    })
    .sort((a, b) => {
      // 1. Sort by position priority first
      const priRoleA = roleOrder[a.position] || 99
      const priRoleB = roleOrder[b.position] || 99
      if (priRoleA !== priRoleB) return priRoleA - priRoleB
      
      // 2. Seniority in that group (by Year)
      const yearA = new Date(a.joined_date || 0).getFullYear()
      const yearB = new Date(b.joined_date || 0).getFullYear()
      if (yearA !== yearB) return yearA - yearB

      // 3. Sort by status priority (within same year)
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status]
      }

      // 4. Alphabetical priority (within same status)
      return (a.name || '').localeCompare(b.name || '')
    })

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        const [headers, ...rows] = lines.map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')))

        const newMembers = rows.map(row => {
          const obj = {}
          headers.forEach((header, index) => {
            const h = header.toLowerCase().replace(' ', '_')
            obj[h] = row[index]
          })
          
          let photo = obj.photo_url || null
          // Fun Randomized Identity Asset selection
          if (!photo && settings?.team_identity_assets?.length > 0) {
            const assets = settings.team_identity_assets
            photo = assets[Math.floor(Math.random() * assets.length)]
          }

          return {
            name: obj.name || 'New Member',
            position: obj.position || 'MINion',
            tenure: obj.tenure || new Date().getFullYear().toString(),
            joined_date: obj.joined_date || new Date().toISOString().split('T')[0],
            farewell_date: obj.farewell_date || null,
            status: (obj.status || 'ACTIVE').toUpperCase(),
            photo_url: photo,
            bio: obj.bio || '',
            display_order: parseInt(obj.display_order) || 0
          }
        })

        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMembers)
        })

        if (res.ok) {
          alert(`Successfully imported ${newMembers.length} members.`)
          fetchInitialData()
        } else {
          const err = await res.json()
          alert(`Import failed: ${err.error}`)
        }
      } catch (err) {
        alert('Failed to parse CSV. Please ensure it follows "name,position,tenure,joined_date" format.')
        console.error(err)
      } finally {
        setUploading(false)
        event.target.value = ''
      }
    }
    reader.readAsText(file)
  }

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
    router.push(`/admin/team/${id}`)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tighter mb-1 text-dynamic uppercase">Team Management</h2>
          <div className="flex flex-col gap-1">
            <p className="text-text-secondary dark:text-text-tertiary text-sm font-bold opacity-60">
              Orchestrate your human capital, roles, and historical tenures.
            </p>
            <details className="text-[9px] text-text-tertiary font-bold group cursor-pointer">
              <summary className="hover:text-primary transition-colors uppercase tracking-widest list-none flex items-center gap-1">
                <Info size={10} /> View CSV Import Format
              </summary>
              <div className="mt-2 p-4 glass rounded-xl border border-border dark:border-white/10 space-y-1 font-mono leading-relaxed bg-white/50 dark:bg-black/20">
                <p>Required Headers (Comma Separated):</p>
                <ul className="list-disc list-inside opacity-80">
                  <li><span className="text-primary">name</span>: Full name</li>
                  <li><span className="text-primary">position</span>: Role (e.g. President, Manager, MINion)</li>
                  <li><span className="text-primary">tenure</span>: Period (e.g. 2025)</li>
                  <li><span className="text-primary">joined_date</span>: YYYY-MM-DD</li>
                  <li><span className="text-secondary-dark">status</span> (opt): ACTIVE, ALUMNI, INACTIVE, REMOVED</li>
                  <li><span className="text-secondary-dark">farewell_date</span> (opt): YYYY-MM-DD</li>
                  <li><span className="text-secondary-dark">bio</span> (opt): Description</li>
                  <li><span className="text-secondary-dark">photo_url</span> (opt): Image Link</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 text-text-main dark:text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest border border-border dark:border-white/10 transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} />
            {uploading ? 'Processing...' : 'Bulk Import (CSV)'}
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <button 
            onClick={() => router.push('/admin/team/new')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <UserPlus size={18} />
            Add Member
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-white/10 focus-within:border-primary transition-all shadow-sm">
          <Search size={18} className="text-text-tertiary" />
          <input 
            suppressHydrationWarning
            type="text" 
            placeholder="Search by name or position..." 
            className="bg-transparent border-none text-sm font-bold focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-2xl border border-border dark:border-white/10">
            <Filter size={18} className="text-text-tertiary" />
            <select 
              className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Every Status</option>
              <option value="active">Active</option>
              <option value="alumni">Alumni</option>
              <option value="inactive">Inactive</option>
              <option value="removed">Removed</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-2xl border border-border dark:border-white/10">
            <Clock size={18} className="text-text-tertiary" />
            <select 
              className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer"
              value={tenureFilter}
              onChange={(e) => setTenureFilter(e.target.value)}
            >
              <option value="all">Every Tenure</option>
              {uniqueTenures.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
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
                            src={member.photo_url || settings?.default_team_photo || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop'} 
                            alt={member.name} 
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black truncate text-text-main dark:text-white">{member.name}</span>
                          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider tabular-nums">Joined {new Date(member.joined_date).getFullYear()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-text-secondary dark:text-text-tertiary">{member.position}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center justify-center text-xs font-black text-primary px-4 py-1.5 rounded-full bg-primary/10 border border-primary/10 shadow-sm tabular-nums">
                        {member.tenure}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${statusColors[member.status]}`}>
                        {member.status}
                      </span>
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
