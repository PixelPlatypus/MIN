'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EditUserPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { id } = useParams()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
  })

  // We fetch standard details. Note: We only allow changing Name and Username inside profiles,
  // NOT email or password because auth handles those and requires sending confirmation emails.
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (error) {
        setError(error.message)
      } else {
        setFormData({ name: data.name || '', username: data.username || '' })
      }
      setLoading(false)
    }
    fetchUser()
  }, [id, supabase])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // Using the admin client via a direct PATCH since standard users couldn't modify others
    try {
      const res = await fetch(`/api/users/${id}/details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to update user details')
      }

      router.push('/admin/users')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
     return <div className="flex items-center justify-center py-24"><Loader2 size={48} className="animate-spin text-primary" /></div>
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
          Edit User Profile
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

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Full Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark focus:border-primary focus:ring-primary/10 rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Username</label>
            <input 
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark focus:border-primary focus:ring-primary/10 rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4"
            />
          </div>

          <p className="text-xs text-text-tertiary">Note: For security reasons, Emails and Passwords cannot be directly edited here. Users must use the 'Forgot Password' flow.</p>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white py-4 px-8 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> Update Details</>}
          </button>
        </div>
      </form>
    </div>
  )
}
