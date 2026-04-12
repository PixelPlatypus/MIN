'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, AlertCircle, ShieldAlert, Key, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EditUserPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { id } = useParams()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: '',
    password: '' // New password field for blind reset
  })

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (error) {
        setError(error.message)
      } else {
        setFormData({ 
          name: data.name || '', 
          username: data.username || '', 
          role: data.role || '',
          password: '' 
        })
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
    setSuccess(false)

    try {
      // Using the consolidated API that handles both role and password updates
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to update user account')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/users')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
     return <div className="flex items-center justify-center py-24"><Loader2 size={48} className="animate-spin text-primary" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
           <Link 
            href="/admin/users" 
            className="w-12 h-12 rounded-2xl bg-bg-secondary dark:bg-white/5 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-text-tertiary shadow-sm"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-3xl font-black tracking-tight leading-none">Security Control</h2>
            <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest mt-1">Manage Credentials & Status</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl bg-coral/10 border border-coral/20 flex items-center gap-4 text-coral text-sm font-bold shadow-xl shadow-coral/5">
            <AlertCircle size={20} />
            <p>{error}</p>
          </motion.div>
        )}
        
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl bg-green/10 border border-green/20 flex items-center gap-4 text-green text-sm font-bold shadow-xl shadow-green/5">
             <ShieldAlert size={20} />
             <p>Account synchronized successfully. Redirecting...</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Profile Data */}
           <div className="glass rounded-[2.5rem] p-8 space-y-6 border border-border shadow-sm">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-2"><UserIcon size={14}/> Identity Narrative</h5>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-text-tertiary">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm font-bold transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none"/>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-text-tertiary">Username</label>
                <input required name="username" value={formData.username} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm font-bold transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none"/>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-text-tertiary">Authorization Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm font-black uppercase transition-all focus:border-primary outline-none cursor-pointer">
                   <option value="ADMIN">Administrator</option>
                   <option value="WEBSITE_MANAGER">Website Manager</option>
                   <option value="MANAGER">Manager</option>
                   <option value="WRITER">Writer</option>
                </select>
              </div>
           </div>

           {/* Security Settings */}
           <div className="glass rounded-[2.5rem] p-8 space-y-6 border border-border shadow-sm">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-coral flex items-center gap-2 mb-2"><Key size={14}/> Vulnerability Control</h5>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-text-tertiary">Force Blind Password Reset</label>
                    <input 
                      type="text" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      placeholder="Enter new complex password"
                      className="w-full bg-white dark:bg-white/5 border-2 border-dashed border-border rounded-2xl py-3 px-4 text-sm font-mono transition-all focus:border-coral focus:border-solid focus:ring-4 focus:ring-coral/5 outline-none"
                    />
                 </div>
                 <div className="p-6 bg-coral/5 border border-coral/10 rounded-3xl space-y-2">
                    <p className="text-[10px] font-black text-coral uppercase tracking-widest">Administrative Warning</p>
                    <p className="text-[11px] leading-relaxed text-text-tertiary font-medium italic">Updates here are permanent and will immediately lock the user out of their previous session. Use only when necessary.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-12 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 group"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} className="group-hover:rotate-12 transition-transform" /> Commit Security Changes</>}
          </button>
        </div>
      </form>
    </div>
  )
}
