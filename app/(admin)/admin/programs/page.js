'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { 
  Plus, Search, Edit2, Trash2, Filter, Loader2, Layers, 
  GripVertical, CheckCircle2, AlertCircle, Save,
  ChevronUp, ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [hasChanges, setHasChanges] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchPrograms()
  }, [])

  async function fetchPrograms() {
    setLoading(true)
    const res = await fetch('/api/programs')
    const data = await res.json()
    setPrograms(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(search.toLowerCase()) || 
                         program.tagline?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || program.status === filter
    return matchesSearch && matchesFilter
  })

  const handleReorder = (newOrder) => {
    setPrograms(newOrder)
    setHasChanges(true)
  }

  const saveNewOrder = async () => {
    setSaving(true)
    try {
      const items = programs.map((p, index) => ({
        id: p.id,
        display_order: index + 1
      }))

      const res = await fetch('/api/programs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })

      if (res.ok) {
        setHasChanges(false)
        router.refresh()
      }
    } catch (err) {
      console.error('Reorder error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this program?')) return
    
    try {
      const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPrograms(programs.filter(p => p.id !== id))
        router.refresh()
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const moveItem = (index, direction) => {
    const newPrograms = [...programs]
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= programs.length) return
    
    // Swap items
    const [movedItem] = newPrograms.splice(index, 1)
    newPrograms.splice(nextIndex, 0, movedItem)
    
    setPrograms(newPrograms)
    setHasChanges(true)
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-dynamic">Programs</h2>
          <p className="text-text-tertiary text-lg font-medium">Drag and drop to reorder homepage initiatives.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {hasChanges && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                onClick={saveNewOrder}
                disabled={saving}
                className="flex items-center gap-2 bg-green text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Changes
              </motion.button>
            )}
          </AnimatePresence>

          <Link 
            href="/admin/programs/new" 
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Add New Program
          </Link>
          <div className="hidden md:flex bg-bg-secondary dark:bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary items-center gap-2 border border-border dark:border-border-dark h-[44px]">
            <Layers size={14} />
            {programs.length} Seeded
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-border-dark group-focus-within:border-primary transition-all shadow-sm">
          <Search size={20} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search programs..." 
            className="bg-transparent border-none text-base focus:outline-none w-full placeholder:text-text-tertiary font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 px-2">
          <Filter size={18} className="text-text-tertiary" />
          <select 
            className="glass px-6 py-3 rounded-2xl text-sm font-bold border border-border dark:border-border-dark focus:outline-none focus:border-primary transition-all bg-transparent cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Initiatives</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Hidden Only</option>
          </select>
        </div>
      </div>

      {/* Programs List */}
      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={48} className="animate-spin text-primary" />
            <p className="text-xs font-black uppercase tracking-widest text-text-tertiary animate-pulse">Synchronizing Data...</p>
          </div>
        ) : programs.length > 0 ? (
          <Reorder.Group 
            axis="y" 
            values={programs} 
            onReorder={handleReorder}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredPrograms.map((program, index) => (
                <Reorder.Item 
                  key={program.id} 
                  value={program}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative"
                >
                  <div className="glass bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/40 dark:border-white/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl group-active:scale-[0.98] group-active:shadow-2xl">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button 
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="p-1.5 hover:bg-primary/10 text-text-tertiary hover:text-primary rounded-lg transition-all disabled:opacity-0"
                          title="Move Up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <div className="cursor-grab active:cursor-grabbing p-1.5 text-text-tertiary hover:text-primary transition-colors bg-bg-secondary dark:bg-white/5 rounded-lg">
                          <GripVertical size={20} />
                        </div>
                        <button 
                          onClick={() => moveItem(index, 1)}
                          disabled={index === programs.length - 1}
                          className="p-1.5 hover:bg-primary/10 text-text-tertiary hover:text-primary rounded-lg transition-all disabled:opacity-0"
                          title="Move Down"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold tracking-tight text-dynamic">{program.name}</h3>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                program.status === 'ACTIVE' 
                                ? 'bg-green/10 text-green border-green/10' 
                                : 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/10'
                            }`}>
                                {program.status}
                            </span>
                        </div>
                        <p className="text-sm text-text-tertiary font-medium">
                          {program.tagline || 'No tagline assigned.'}
                        </p>
                        <p className="text-[10px] font-mono text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                            Redirects to: {program.learn_more_link || '/events'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-12 md:pl-0">
                      <Link 
                        href={`/admin/programs/${program.id}`}
                        className="p-3 bg-bg-secondary dark:bg-white/5 text-text-tertiary hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                        title="Edit Details"
                      >
                        <Edit2 size={20} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(program.id)}
                        className="p-3 bg-bg-secondary dark:bg-white/5 text-text-tertiary hover:text-coral hover:bg-coral/10 rounded-2xl transition-all"
                        title="Delete Program"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="glass rounded-[3rem] py-32 text-center border border-dashed border-border">
            <Layers className="mx-auto mb-6 text-text-tertiary/20" size={64} />
            <p className="text-lg font-bold text-text-tertiary">No initiatives found.</p>
            <p className="text-sm text-text-tertiary/60">Ready to start? Create your first program.</p>
          </div>
        )}
      </div>
    </div>
  )
}
