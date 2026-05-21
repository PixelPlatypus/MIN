'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Key, ShieldCheck, Envelope as Mail, 
  Smartphone, FloppyDisk as Save, CircleNotch as Loader2, WarningCircle as AlertCircle, 
  CheckCircle as CheckCircle2, Camera, Eye, EyeSlash as EyeOff,
  UserCircle, Fingerprint, Lock
} from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'

export default function AccountSettingsClient({ initialProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialProfile?.name || '',
    username: initialProfile?.username || '',
    email: initialProfile?.email || '',
    new_password: '',
    confirm_password: ''
  })

  const supabase = createClient()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // 1. Update Profile Table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          username: formData.username,
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // 2. Update Password if provided
      if (formData.new_password) {
        if (formData.new_password !== formData.confirm_password) {
          throw new Error("Passwords do not match")
        }
        if (formData.new_password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
        
        const { error: authError } = await supabase.auth.updateUser({
          password: formData.new_password
        })
        
        if (authError) throw authError
        
        // Clear password fields on success
        setFormData(prev => ({ ...prev, new_password: '', confirm_password: '' }))
      }

      setSuccess("Account synchronized successfully")
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tight mb-2">Account Control</h2>
        <p className="text-auto-tertiary text-sm font-medium">Manage your identity, credentials and administrative presence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[2.5rem] p-8 text-center border border-border shadow-xl">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-black text-primary border-4 border-white dark:border-white/5 shadow-2xl">
                {profile?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-white dark:bg-bg-dark border border-border flex items-center justify-center text-auto-tertiary shadow-lg">
                <Camera size={14} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-black">{profile?.name}</h3>
              <p className="text-xs text-auto-tertiary font-bold uppercase tracking-widest">@{profile?.username}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-border space-y-4">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-auto-tertiary">Role</span>
                  <span className="text-primary px-3 py-1 bg-primary/10 rounded-full">{profile?.role}</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-auto-tertiary">Status</span>
                  <span className="text-green flex items-center gap-1.5"><ShieldCheck size={12}/> Verified</span>
               </div>
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-6 border border-border bg-coral/5 border-coral/10">
             <div className="flex items-start gap-4">
                <Lock size={20} className="text-coral shrink-0 mt-1" />
                <div className="space-y-1">
                   <h4 className="text-xs font-black uppercase tracking-widest text-coral">Security Protocol</h4>
                   <p className="text-[11px] font-medium text-auto-tertiary leading-relaxed">
                      Changing your password will immediately end all other active sessions for your protection.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-coral/10 border border-coral/20 rounded-3xl p-5 flex items-center gap-4 text-coral text-sm font-bold shadow-xl shadow-coral/5"
                >
                  <AlertCircle size={20} />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green/10 border border-green/20 rounded-3xl p-5 flex items-center gap-4 text-green text-sm font-bold shadow-xl shadow-green/5"
                >
                  <CheckCircle2 size={20} />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Identity */}
            <div className="glass rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <UserCircle size={20} className="text-primary" />
                <h4 className="text-sm font-black uppercase tracking-widest">Public Identity</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-auto-tertiary flex items-center gap-2">
                    <User size={12} /> Full Name
                  </label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-auto-tertiary flex items-center gap-2">
                    <Fingerprint size={12} /> Username
                  </label>
                  <input 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2 opacity-60 grayscale cursor-not-allowed">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-auto-tertiary flex items-center gap-2">
                    <Mail size={12} /> Primary Email Address
                  </label>
                  <div className="w-full bg-bg-secondary dark:bg-white/5 border border-border rounded-2xl py-4 px-6 text-sm font-bold flex items-center justify-between">
                    {formData.email}
                    <Lock size={14} className="text-auto-tertiary" />
                  </div>
                  <p className="text-[9px] font-bold text-auto-tertiary px-1">Email changes must be requested through system administration.</p>
                </div>
              </div>
            </div>

            {/* Credential Control */}
            <div id="password" className="glass rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm space-y-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-2">
                <Key size={20} className="text-coral" />
                <h4 className="text-sm font-black uppercase tracking-widest">Credential Control</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-auto-tertiary">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all pr-12"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-auto-tertiary hover:text-primary-dark dark:duration-75 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-auto-tertiary">Confirm Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {saving ? (
                  <><Loader2 size={18} className="animate-spin" /> Synchronizing...</>
                ) : (
                  <><Save size={18} /> Commit Account Changes</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
