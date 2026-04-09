'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, Search, Loader2, Link as LinkIcon, ShieldAlert } from 'lucide-react'

export default function AuditLogPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      const res = await fetch('/api/audit')
      if (res.ok) {
        const data = await res.json()
        setLogs(Array.isArray(data) ? data : [])
      }
      setLoading(false)
    }
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => 
    log.actor_name?.toLowerCase().includes(search.toLowerCase()) || 
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.entity_type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Audit Log</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Complete security trail of all authenticated administrative actions.
          </p>
        </div>
      </div>

      <div className="flex-1 glass px-4 py-2 rounded-xl flex items-center gap-3 border border-border dark:border-border-dark group-focus-within:border-primary transition-all max-w-md">
        <Search size={18} className="text-text-tertiary" />
        <input 
          type="text" 
          placeholder="Search by name, action, or entity type..." 
          className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Audit Logs Table */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-sm border border-border dark:border-border-dark">
        {loading ? (
           <div className="flex items-center justify-center py-24">
             <Loader2 size={48} className="animate-spin text-primary" />
           </div>
        ) : filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary dark:bg-white/5 text-text-tertiary dark:text-text-tertiary-dark text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity Type</th>
                  <th className="px-6 py-4">Context Metadata</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-bg-secondary/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-text-tertiary/10 text-text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                          {log.actor_name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <span className="text-sm font-bold truncate max-w-[150px]">
                          {log.actor_name || 'System Account'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         {log.action.includes('DELETE') ? (
                          <span className="w-2 h-2 rounded-full bg-coral shrink-0" />
                        ) : log.action.includes('CREATE') ? (
                          <span className="w-2 h-2 rounded-full bg-green shrink-0" />
                        ) : log.action.includes('UPDATE') || log.action.includes('CHANGE') ? (
                          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-text-tertiary/10 px-2 py-0.5 rounded border border-border/50 text-text-secondary">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-text-secondary">
                        {log.entity_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-text-tertiary font-mono max-w-[200px] truncate" title={JSON.stringify(log.meta)}>
                         {JSON.stringify(log.meta)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end min-w-0">
                        <span className="text-sm font-medium">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-text-tertiary uppercase tracking-widest font-bold">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary">
              <ShieldAlert size={32} />
            </div>
            <p className="text-text-tertiary text-lg">No audit log entries matched your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
