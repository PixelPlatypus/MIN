'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleUpdatePassword(e) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin')
      }, 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      
      <div className="relative text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Set New Password</h1>
        <p className="text-text-secondary text-sm">Create a new secure password for your account.</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-coral/10 border border-coral/20 flex items-center gap-3 text-coral text-sm"
        >
          <AlertCircle size={18} />
          <p>{error}</p>
        </motion.div>
      )}

      {success ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-green/10 border border-green/20 flex flex-col items-center gap-4 text-green text-center"
        >
          <CheckCircle size={32} />
          <p className="font-bold">Password successfully updated!</p>
          <p className="text-sm">Redirecting to dashboard...</p>
        </motion.div>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
          </button>
        </form>
      )}
    </motion.div>
  )
}
