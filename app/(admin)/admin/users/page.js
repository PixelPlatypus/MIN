'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, PlusCircle, Loader2, Shield, Trash2, Edit2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleRoleChange(userId, newRole) {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })
    if (res.ok) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } else {
      alert('Failed to change role. Ensure you have ADMIN permissions.')
    }
  }

  async function handleRemoveUser(userId) {
    if (!confirm('Are you sure you want to permanently remove this user? This cannot be undone.')) return
    
    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })
    
    if (res.ok) {
      setUsers(users.filter(u => u.id !== userId))
    } else {
      const data = await res.json()
      alert(data.error || 'Failed to remove user.')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">User Management</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Manage admin, manager, and writer accounts.
          </p>
        </div>
        <Link 
          href="/admin/users/new"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 w-fit"
        >
          <PlusCircle size={18} />
          Create User
        </Link>
      </div>

      <div className="flex-1 glass px-4 py-2 rounded-xl flex items-center gap-3 border border-border dark:border-border-dark group-focus-within:border-primary transition-all max-w-md">
        <Search size={18} className="text-text-tertiary" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-sm border border-border dark:border-border-dark">
        {loading ? (
           <div className="flex items-center justify-center py-24">
             <Loader2 size={48} className="animate-spin text-primary" />
           </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary dark:bg-white/5 text-text-tertiary dark:text-text-tertiary-dark text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Name / Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-bg-secondary/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold truncate">{user.name}</span>
                          <span className="text-xs text-text-tertiary truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex items-center gap-1.5 w-fit ${
                        user.role === 'ADMIN' ? 'bg-coral/10 text-coral border-coral/20' :
                        user.role === 'MANAGER' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                        'bg-text-tertiary/10 text-text-secondary border-text-tertiary/20'
                      }`}>
                        {user.role === 'ADMIN' && <Shield size={10} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3 h-full">
                      <select 
                        className="bg-transparent border border-border dark:border-border-dark rounded-xl px-2 py-1 text-[10px] font-black uppercase focus:outline-none focus:border-primary cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === users.find(u => u.isSelf)?.id} // Assuming we tag self or check uid
                      >
                        <option value="WEBSITE_MANAGER">Website Manager</option>
                        <option value="ADMIN">Administrator</option>
                        <option value="MANAGER">Manager</option>
                        <option value="WRITER">Writer</option>
                      </select>
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="text-text-tertiary hover:text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleRemoveUser(user.id)}
                        disabled={user.id === users.find(u => u.isSelf)?.id}
                        className="text-coral hover:bg-coral/10 p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                        title={user.id === users.find(u => u.isSelf)?.id ? "Cannot delete self" : "Remove User"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-text-tertiary">No users found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
