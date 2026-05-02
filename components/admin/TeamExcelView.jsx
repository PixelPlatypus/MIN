'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Download, Filter, Search, X, Loader2, AlertCircle, Plus, Clock, User } from 'lucide-react'

export default function TeamExcelView({ members, onSave, onRefresh }) {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterYear, setFilterYear] = useState('ALL')
  const [isSaving, setIsSaving] = useState(false)
  const [changedIds, setChangedIds] = useState(new Set())
  const [lastUpdate, setLastUpdate] = useState(null)

  // Fetch last modification info
  useEffect(() => {
    async function fetchLastUpdate() {
      try {
        const res = await fetch('/api/audit?entity_type=team_members')
        if (res.ok) {
          const logs = await res.json()
          if (logs && logs.length > 0) {
            setLastUpdate(logs[0])
          }
        }
      } catch (err) {
        console.error('Failed to fetch audit log:', err)
      }
    }
    fetchLastUpdate()
  }, [])

  // Extract unique years for filtering
  const uniqueYears = Array.from(new Set(data
    .map(m => m.joined_date ? new Date(m.joined_date).getFullYear().toString() : null)
    .filter(Boolean)
  )).sort((a, b) => b - a)

  useEffect(() => {
    // Only initialize data if it's empty to prevent overwriting edits during refresh
    if (data.length === 0 && members.length > 0) {
      const mapped = members.map(m => mapMemberToRow(m))
      setData(mapped)
    }
  }, [members])

  const slugify = (text) => {
    if (!text) return `member-${Math.random().toString(36).substr(2, 5)}`
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
  }

  const mapMemberToRow = (m) => {
    const social = typeof m.social_links === 'string' ? JSON.parse(m.social_links) : (m.social_links || {})
    const roles = Array.isArray(social.role_history) 
      ? social.role_history.map(rh => `${rh.year}: ${rh.position}`).join(', ') 
      : ''
    
    return {
      id: m.id,
      slug: m.slug,
      name: m.name || '',
      status: m.status || 'ACTIVE',
      joined_date: m.joined_date || '',
      farewell_date: m.farewell_date || '',
      is_advisor: m.is_advisor ? 'YES' : 'NO',
      role_history: roles,
      _original: m
    }
  }

  const addNewRow = () => {
    // Clear filters to ensure the user can see the new row immediately
    setSearch('')
    setFilterStatus('ALL')
    setFilterYear('ALL')

    const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`
    const joinDate = new Date().toISOString().split('T')[0]
    const year = new Date(joinDate).getFullYear()
    const newRow = {
      id: tempId,
      slug: '',
      name: '',
      status: 'ACTIVE',
      joined_date: joinDate,
      farewell_date: '',
      is_advisor: 'NO',
      role_history: `${year}: MINion`,
      _isNew: true
    }
    setData(prev => [...prev, newRow])
    setChangedIds(prev => new Set(prev).add(tempId))
  }

  const handleCellChange = (id, field, value) => {
    setData(prev => prev.map(row => {
      if (row.id !== id) return row
      
      let updatedRow = { ...row, [field]: value }
      
      // Track changes for highlighting
      setChangedIds(prev => new Set(prev).add(id))
      
      // Auto-fill Role History if joined_date is set and history is empty
      if (field === 'joined_date' && value && !updatedRow.role_history) {
        const year = new Date(value).getFullYear()
        if (!isNaN(year)) {
          updatedRow.role_history = `${year}: MINion`
        }
      }

      // Sync slug if name is changed and it's a new row
      if (field === 'name' && updatedRow._isNew) {
        updatedRow.slug = slugify(value)
      }
      
      return updatedRow
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates = data.map(row => {
        const originalSocial = row._original?.social_links 
          ? (typeof row._original.social_links === 'string' ? JSON.parse(row._original.social_links) : row._original.social_links)
          : { role_history: [] }
        
        const joinedYear = row.joined_date 
          ? new Date(row.joined_date).getFullYear().toString() 
          : new Date().getFullYear().toString()

        let roleHistory = row.role_history.split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .map(s => {
            const [year, ...pos] = s.split(':')
            return { year: year?.trim(), position: pos.join(':')?.trim() }
          })
          .filter(rh => rh.year && rh.position)

        // Ensure baseline MINion entry exists for their joining year
        const hasBaseline = roleHistory.some(rh => rh.year === joinedYear)
        if (!hasBaseline) {
          roleHistory.push({ year: joinedYear, position: 'MINion' })
        }

        // Sort role history chronologically for the database
        roleHistory.sort((a, b) => parseInt(a.year) - parseInt(b.year))

        // Derive current position from the LATEST role entry
        const latestRole = roleHistory.length > 0 
          ? [...roleHistory].sort((a, b) => parseInt(b.year) - parseInt(a.year))[0]
          : { position: 'MINion' }

        const payload = {
          name: row.name || 'New Member',
          slug: row.slug || slugify(row.name),
          position: latestRole.position || 'MINion',
          status: row.status.toUpperCase(),
          joined_date: row.joined_date || new Date().toISOString().split('T')[0],
          farewell_date: row.farewell_date || null,
          is_advisor: row.is_advisor.toUpperCase() === 'YES',
          tenure: joinedYear,
          social_links: {
            ...originalSocial,
            role_history: roleHistory
          }
        }

        // Only include ID if it's not a temporary one
        if (!row._isNew) {
          payload.id = row.id
        }

        return payload
      })

      const res = await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (res.ok) {
        alert('Changes saved successfully!')
        setChangedIds(new Set()) // Clear highlights
        setData([]) // Reset data so next effect re-initializes from refreshed members
        onRefresh()
      } else {
        const err = await res.json()
        alert(`Failed to save: ${err.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    const headers = [
      'name', 'role_history', 'tenure', 'joined_date', 'slug', 
      'is_advisor', 'status', 'certificate_url', 'farewell_date', 
      'bio', 'photo_url', 'display_order'
    ]
    const csvRows = [headers.join(',')]
    
    filteredData.forEach(row => {
      const m = row._original || {}
      const values = [
        `"${row.name || ''}"`,
        `"${row.role_history || ''}"`,
        `"${row.tenure || (row.joined_date ? new Date(row.joined_date).getFullYear().toString() : '')}"`,
        `"${row.joined_date || ''}"`,
        `"${row.slug || ''}"`,
        `"${row.is_advisor === 'YES'}"`,
        `"${row.status || ''}"`,
        `"${m.certificate_url || ''}"`,
        `"${row.farewell_date || ''}"`,
        `"${m.bio || ''}"`,
        `"${m.photo_url || ''}"`,
        `"${m.display_order || ''}"`
      ]
      csvRows.push(values.join(','))
    })

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MIN_Team_Export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const statusPriority = {
    ACTIVE: 0,
    ALUMNI: 1,
    INACTIVE: 2,
    REMOVED: 3
  }

  const filteredData = data.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || row.status === filterStatus
    const matchesYear = filterYear === 'ALL' || (row.joined_date && new Date(row.joined_date).getFullYear().toString() === filterYear)
    return matchesSearch && matchesStatus && matchesYear
  }).sort((a, b) => {
    // New rows stay at the very bottom so they appear where the 'Add' button is
    if (a._isNew && !b._isNew) return 1
    if (!a._isNew && b._isNew) return -1

    // Status priority (Active > Alumni > Inactive)
    const priorityA = statusPriority[a.status] ?? 99
    const priorityB = statusPriority[b.status] ?? 99
    if (priorityA !== priorityB) return priorityA - priorityB
    
    // Then sort by joined_date descending
    const dateA = a.joined_date ? new Date(a.joined_date).getTime() : 0
    const dateB = b.joined_date ? new Date(b.joined_date).getTime() : 0
    
    if (dateB !== dateA) return dateB - dateA
    
    // Final tie-breaker: Name
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="flex-1 glass px-4 py-2 rounded-xl flex items-center gap-2 border border-border dark:border-white/10 focus-within:border-primary">
              <Search size={16} className="text-text-tertiary" />
              <input 
                type="text" 
                placeholder="Search spreadsheet..."
                className="bg-transparent border-none text-xs font-bold focus:outline-none w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="glass px-3 py-2 rounded-xl flex items-center gap-2 border border-border dark:border-white/10">
                <Filter size={16} className="text-text-tertiary" />
                <select 
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ALUMNI">Alumni</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="glass px-3 py-2 rounded-xl flex items-center gap-2 border border-border dark:border-white/10">
                <Clock size={16} className="text-text-tertiary" />
                <select 
                  className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer"
                  value={filterYear}
                  onChange={e => setFilterYear(e.target.value)}
                >
                  <option value="ALL">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {lastUpdate && (
            <p className="text-[9px] font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2 ml-1">
              <User size={12} className="text-primary" />
              Last Modified by <span className="text-primary">{lastUpdate.actor_name}</span> • {new Date(lastUpdate.created_at).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary dark:bg-white/5 border border-border dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-bg-tertiary transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-border dark:border-white/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-bg-secondary dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-text-tertiary border-b border-border dark:border-white/10">
              <th className="px-4 py-4 w-48">Full Name</th>
              <th className="px-4 py-4 w-32">Status</th>
              <th className="px-4 py-4 w-32">Joined Date</th>
              <th className="px-4 py-4 w-32">Farewell Date</th>
              <th className="px-4 py-4 w-24 text-center">isAdvisor</th>
              <th className="px-4 py-4 w-auto">Roles History</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-white/5">
            {filteredData.map(row => (
              <tr 
                key={row.id} 
                className={`transition-colors group ${
                  changedIds.has(row.id) 
                    ? 'bg-primary/5 hover:bg-primary/10' 
                    : 'hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05]'
                }`}
              >
                <td className="px-1 py-1">
                  <input 
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold focus:bg-white dark:focus:bg-white/10 outline-none rounded-lg border border-transparent focus:border-primary/30 transition-all"
                    placeholder="Member Name"
                    value={row.name}
                    onChange={e => handleCellChange(row.id, 'name', e.target.value)}
                  />
                </td>
                <td className="px-1 py-1">
                  <select 
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold focus:bg-white dark:focus:bg-white/10 outline-none rounded-lg border border-transparent focus:border-primary/30 transition-all uppercase"
                    value={row.status}
                    onChange={e => handleCellChange(row.id, 'status', e.target.value)}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ALUMNI">ALUMNI</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="REMOVED">REMOVED</option>
                  </select>
                </td>
                <td className="px-1 py-1">
                  <input 
                    type="date"
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold focus:bg-white dark:focus:bg-white/10 outline-none rounded-lg border border-transparent focus:border-primary/30 transition-all"
                    value={row.joined_date}
                    onChange={e => handleCellChange(row.id, 'joined_date', e.target.value)}
                  />
                </td>
                <td className="px-1 py-1">
                  <input 
                    type="date"
                    className="w-full bg-transparent px-3 py-2 text-xs font-bold focus:bg-white dark:focus:bg-white/10 outline-none rounded-lg border border-transparent focus:border-primary/30 transition-all"
                    value={row.farewell_date}
                    onChange={e => handleCellChange(row.id, 'farewell_date', e.target.value)}
                  />
                </td>
                <td className="px-1 py-1 text-center">
                   <button 
                    onClick={() => handleCellChange(row.id, 'is_advisor', row.is_advisor === 'YES' ? 'NO' : 'YES')}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      row.is_advisor === 'YES' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-bg-secondary text-text-tertiary'
                    }`}
                   >
                     {row.is_advisor}
                   </button>
                </td>
                <td className="px-1 py-1">
                  <textarea 
                    rows={1}
                    className="w-full bg-transparent px-3 py-2 text-[10px] font-medium focus:bg-white dark:focus:bg-white/10 outline-none rounded-lg border border-transparent focus:border-primary/30 transition-all resize-none overflow-hidden hover:overflow-y-auto max-h-20"
                    placeholder="e.g. 2024: Manager (MINion is auto-added)"
                    value={row.role_history}
                    onChange={e => handleCellChange(row.id, 'role_history', e.target.value)}
                  />
                </td>
              </tr>
            ))}
            {/* Natural Add Row Button */}
            <tr>
              <td colSpan="6" className="p-0">
                <button 
                  onClick={addNewRow}
                  className="w-full py-4 bg-bg-secondary/30 dark:bg-white/[0.02] hover:bg-primary/[0.05] text-text-tertiary hover:text-primary transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group"
                >
                  <Plus size={14} className="group-hover:scale-125 transition-transform" />
                  Add New Member Row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-6 glass rounded-2xl border border-dashed border-border dark:border-white/10 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1">
           <p className="text-xs font-black uppercase tracking-widest text-text-primary-dynamic">Excel Mode Active</p>
           <p className="text-[10px] font-bold text-text-tertiary leading-relaxed">
             You are in spreadsheet mode. Copy and paste work naturally between cells. 
             Remember to hit <strong>Save Changes</strong> to sync with the database.
             <br />
             Role History: <span className="text-primary font-black uppercase">MINion is automatic</span> from Joined Year. Only log changes like: <span className="font-mono text-primary">2024: Manager</span>
           </p>
        </div>
      </div>
    </div>
  )
}
