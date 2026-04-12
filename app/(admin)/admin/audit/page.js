'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  History, Search, Loader2, Link as LinkIcon, 
  ShieldAlert, User, Activity, Clock, Trash2, 
  Filter, ChevronRight, Eye, Smartphone, Monitor,
  Layers, Database, FileText, Settings
} from 'lucide-react'

export default function AuditLogPage() {
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [purging, setPurging] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ actor_id: '', action: '', entity_type: '' })
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [filters.actor_id, filters.action, filters.entity_type])

  async function fetchInitialData() {
    const userRes = await fetch('/api/users')
    if (userRes.ok) {
      const userData = await userRes.json()
      setUsers(userData)
    }
  }

  async function fetchLogs() {
    setLoading(true)
    let url = '/api/audit?'
    if (filters.actor_id) url += `actor_id=${filters.actor_id}&`
    if (filters.action) url += `action=${filters.action}&`
    if (filters.entity_type) url += `entity_type=${filters.entity_type}&`
    
    const res = await fetch(url)
    const data = await res.json()
    if (res.ok) {
      setLogs(Array.isArray(data) ? data : [])
    } else {
      alert(data.error || 'Failed to fetch logs')
    }
    setLoading(false)
  }

  async function handlePurge() {
    if (!confirm('This will permanently delete all logs older than 30 days. Proceed?')) return
    setPurging(true)
    const res = await fetch('/api/audit', { method: 'DELETE' })
    if (res.ok) {
      alert('Maintenance complete: Old logs purged.')
      fetchLogs()
    }
    setPurging(false)
  }

  const filteredLogs = logs.filter(log => 
    log.actor_name?.toLowerCase().includes(search.toLowerCase()) || 
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.entity_type?.toLowerCase().includes(search.toLowerCase())
  )

  const entityCategories = [
    { id: 'site_settings', name: 'Site Nexus', icon: <Settings size={12}/> },
    { id: 'timeline_events', name: 'Timeline', icon: <Clock size={12}/> },
    { id: 'practice_questions', name: 'Questions', icon: <Layers size={12}/> },
    { id: 'content', name: 'Articles', icon: <FileText size={12}/> },
    { id: 'team_members', name: 'Team', icon: <User size={12}/> },
    { id: 'events', name: 'Events', icon: <Clock size={12}/> },
    { id: 'profiles', name: 'Users', icon: <ShieldAlert size={12}/> },
    { id: 'form_definitions', name: 'Form Builder', icon: <Layers size={12}/> },
    { id: 'popup_notices', name: 'Notices', icon: <Settings size={12}/> },
    { id: 'gallery', name: 'Gallery', icon: <Database size={12}/> },
    { id: 'form_submissions', name: 'Intake Submissions', icon: <Database size={12}/> },
    { id: 'join_applications', name: 'Legacy Intake', icon: <Database size={12}/> },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Panel */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/10">
              <History size={32} />
           </div>
           <div>
             <h2 className="text-4xl font-black tracking-tighter text-dynamic leading-none">Forensic Stream</h2>
             <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                   <Clock size={12} /> 30-Day Retention Active
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                   {logs.length} Recent Incidents
                </span>
             </div>
           </div>
        </div>

        <button 
          onClick={handlePurge}
          disabled={purging}
          className="flex items-center gap-3 px-8 py-4 bg-coral/10 text-coral hover:bg-coral hover:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
        >
          {purging ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          Maintenance Purge
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Management Rail */}
        <aside className="lg:w-80 space-y-8 flex-shrink-0">
           <div className="space-y-6">
              <h5 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary/60">Forensic Filters</h5>
              
              <div className="glass p-6 rounded-[2.5rem] border border-border space-y-6 shadow-sm">
                 {/* Actor Filter */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><User size={12}/> Agent Identity</label>
                    <select 
                      value={filters.actor_id} 
                      onChange={e => setFilters({...filters, actor_id: e.target.value})}
                      className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Total Network</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name || u.email} {u.isSelf ? '(You)' : ''}
                        </option>
                      ))}
                    </select>
                 </div>

                 {/* Action Filter */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Activity size={12}/> Operations</label>
                    <div className="flex flex-wrap gap-2">
                       {['CREATE', 'UPDATE', 'DELETE'].map(act => (
                         <button
                            key={act}
                            onClick={() => setFilters({...filters, action: filters.action === act ? '' : act})}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filters.action === act ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-bg-secondary text-text-tertiary hover:text-primary border border-transparent hover:border-primary/20'}`}
                         >
                           {act}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Entity Type Filter */}
                 <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Database size={12}/> Data Sector</label>
                    <div className="grid grid-cols-1 gap-2">
                       {entityCategories.map(cat => (
                         <button
                            key={cat.id}
                            onClick={() => setFilters({...filters, entity_type: filters.entity_type === cat.id ? '' : cat.id})}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filters.entity_type === cat.id ? 'bg-primary/10 text-primary border-primary shadow-sm' : 'bg-transparent text-text-tertiary border-border hover:border-primary/50 hover:text-primary'}`}
                         >
                           {cat.icon}
                           {cat.name}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-8 glass rounded-[2.5rem] border border-dashed border-border flex flex-col items-center text-center space-y-4">
              <ShieldAlert size={40} className="text-text-tertiary/20" />
              <p className="text-[11px] text-text-tertiary font-bold leading-relaxed px-4">Cryptographic integrity verified. Logs represent absolute source of truth.</p>
           </div>
        </aside>

        {/* Audit Stream */}
        <div className="flex-1 space-y-6">
           <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4 border border-border shadow-sm focus-within:border-primary transition-all">
              <Search size={20} className="text-text-tertiary" />
              <input 
                type="text" 
                placeholder="Search the forensic stream..." 
                className="bg-transparent border-none text-sm font-bold focus:outline-none w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>

           <div className="glass rounded-[2.5rem] overflow-hidden border border-border shadow-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md">
              {loading ? (
                <div className="py-40 flex flex-col items-center justify-center gap-4">
                   <Loader2 size={48} className="animate-spin text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Sequencing Logs...</span>
                </div>
              ) : filteredLogs.length > 0 ? (
                <div className="divide-y divide-border/50">
                   {filteredLogs.map((log) => (
                     <div 
                      key={log.id} 
                      className={`p-6 flex items-center justify-between hover:bg-bg-secondary/50 dark:hover:bg-white/5 transition-all cursor-pointer group ${selectedLog?.id === log.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                      onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                    >
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 shadow-sm border border-border flex items-center justify-center font-black text-primary transition-transform group-hover:scale-105">
                              {log.actor_name?.[0]?.toUpperCase() || 'S'}
                           </div>
                           <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-3 mb-1">
                                 <h4 className="font-black text-sm tracking-tight truncate max-w-[150px]">{log.actor_name || 'System Auto'}</h4>
                                 <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                   log.action.includes('DELETE') ? 'bg-coral/10 text-coral border-coral/20' : 
                                   log.action.includes('CREATE') ? 'bg-green/10 text-green border-green/20' : 
                                   'bg-primary/10 text-primary border-primary/20'
                                 }`}>
                                    {log.action}
                                 </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary">
                                 <span className="flex items-center gap-1"><History size={10}/> {new Date(log.created_at).toLocaleDateString()}</span>
                                 <span className="opacity-30">•</span>
                                 <span className="font-mono bg-text-tertiary/5 px-1.5 rounded uppercase text-[9px] tracking-tight">{log.entity_type}</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                           <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{new Date(log.created_at).toLocaleTimeString()}</p>
                           <div className="flex justify-end">
                              <ChevronRight size={18} className={`text-text-tertiary transition-transform ${selectedLog?.id === log.id ? 'rotate-90 text-primary' : 'group-hover:translate-x-1'}`} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="py-40 text-center space-y-6">
                   <div className="w-20 h-20 bg-bg-secondary dark:bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <ShieldAlert size={40} className="text-text-tertiary/20" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary">No incidents detected.</p>
                      <p className="text-[10px] text-text-tertiary font-medium">Try broadening your forensic parameters.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
        
        {/* Detail Panel */}
        <AnimatePresence>
           {selectedLog && (
             <motion.aside 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[450px] space-y-6 shrink-0"
             >
                <div className="glass rounded-[2.5rem] p-10 border border-border shadow-2xl sticky top-8 bg-white/60 dark:bg-black/40 backdrop-blur-xl">
                   <div className="flex justify-between items-start mb-10">
                      <div>
                         <h3 className="text-2xl font-black tracking-tight mb-1 leading-none">Payload Analysis</h3>
                         <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mt-2">UUID: <span className="font-mono">{selectedLog.id.slice(0,12)}...</span></p>
                      </div>
                      <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-bg-secondary dark:hover:bg-white/10 rounded-xl transition-all">
                         <XCircle size={24} className="text-text-tertiary hover:text-coral transition-colors" />
                      </button>
                   </div>

                   <div className="space-y-8">
                      <div className="p-6 bg-bg-secondary dark:bg-white/5 rounded-3xl space-y-4 border border-border shadow-inner">
                         <div className="flex items-center gap-3 mb-1">
                            <Monitor size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Client Signature</span>
                         </div>
                         <p className="text-[11px] font-mono leading-relaxed text-text-tertiary break-all line-clamp-3">
                            {selectedLog.meta?.browser || 'System/Server-Level Execution'}
                         </p>
                      </div>

                      {selectedLog.meta?.changes && typeof selectedLog.meta.changes === 'object' && (
                         <div className="space-y-4 mb-8">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 border-b border-border pb-2">
                               <Activity size={14}/> Modification Trace
                            </h5>
                            <div className="space-y-3">
                               {Object.entries(selectedLog.meta.changes).map(([key, changeData]) => (
                                 <div key={key} className="bg-bg-secondary dark:bg-white/5 rounded-3xl p-5 border border-border shadow-inner">
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-text-tertiary mb-3 block border-b border-border/50 pb-2">
                                       {key.replace(/_/g, ' ')}
                                    </span>
                                    {changeData?.from !== undefined && changeData?.to !== undefined ? (
                                      <div className="grid grid-cols-2 gap-4">
                                         <div className="space-y-2">
                                            <span className="inline-block text-[8px] font-black text-coral uppercase tracking-widest bg-coral/10 px-2 py-0.5 rounded leading-none">Previous</span>
                                            <p className="text-[10px] font-mono text-text-secondary break-all bg-black/5 dark:bg-black/40 p-3 rounded-2xl border border-coral/10">
                                               {changeData.from ? String(changeData.from) : 'NULL'}
                                            </p>
                                         </div>
                                         <div className="space-y-2">
                                            <span className="inline-block text-[8px] font-black text-green uppercase tracking-widest bg-green/10 px-2 py-0.5 rounded leading-none">Current</span>
                                            <p className="text-[10px] font-mono text-text-secondary break-all bg-black/5 dark:bg-black/40 p-3 rounded-2xl border border-green/10 hidden-scrollbar overflow-x-auto">
                                               {changeData.to ? String(changeData.to) : 'NULL'}
                                            </p>
                                         </div>
                                      </div>
                                    ) : (
                                      <p className="text-[10px] font-mono text-text-secondary bg-black/5 dark:bg-black/40 p-3 rounded-2xl">
                                         {String(changeData)}
                                      </p>
                                    )}
                                 </div>
                               ))}
                            </div>
                         </div>
                      )}

                      <div className="space-y-4">
                         <div className="flex items-center justify-between border-b border-border pb-2">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
                               <Layers size={14}/> Raw Payload
                            </h5>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(selectedLog.meta, null, 2))
                                alert('Copied to clipboard')
                              }}
                              className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline bg-primary/10 px-3 py-1.5 rounded-lg"
                            >
                              Copy JSON
                            </button>
                         </div>
                         <div className="bg-black/5 dark:bg-black/40 p-6 rounded-3xl border border-border shadow-inner overflow-hidden relative group">
                            <pre className="text-[10px] font-mono text-text-secondary leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[250px] scrollbar-hide">
                               {JSON.stringify(selectedLog.meta, null, 2)}
                            </pre>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-border/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                         <span>RELATION_KEY</span>
                         <span className="font-mono text-dynamic bg-bg-secondary dark:bg-white/5 px-2 py-1 rounded truncate max-w-[200px]">{selectedLog.entity_id || 'NULL'}</span>
                      </div>
                   </div>
                </div>
             </motion.aside>
           )}
        </AnimatePresence>
      </div>
    </div>
  )
}

import { XCircle } from 'lucide-react'
