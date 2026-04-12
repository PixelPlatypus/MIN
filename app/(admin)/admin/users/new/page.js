'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'WRITER'
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create user')
      }

      router.push('/admin/users')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/users" 
          className="p-2 rounded-xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all text-text-tertiary hover:text-primary"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">
          Create New User
        </h2>
      </div>

      <form onSubmit={onSubmit} className="glass rounded-[2rem] p-8 space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-coral/10 border border-coral/20 flex items-center gap-3 text-coral text-sm"
          >
            <AlertCircle size={18} />
            <p>{error}</p>
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">Full Name</label>
          <input 
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark focus:border-primary focus:ring-primary/10 rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Username</label>
            <input 
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark focus:border-primary focus:ring-primary/10 rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Email</label>
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark focus:border-primary focus:ring-primary/10 rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Password</label>
            <input 
              required
              type="text"
              name="password"
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Temporary password"
              className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark focus:border-primary focus:ring-primary/10 rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Role</label>
            <select 
              required
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent cursor-pointer"
            >
              <option value="WEBSITE_MANAGER">Website Manager</option>
              <option value="MANAGER">Manager</option>
              <option value="WRITER">Writer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white py-4 px-8 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Create User</>}
          </button>
        </div>
      </form>
    </div>
  )
}
