'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

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
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/admin'), 1800)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-bg-dynamic p-8 md:p-10"
    >
      <header className="text-center mb-8">
        <div className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic mb-2">Account Recovery</div>
        <h1 className="text-2xl font-black tracking-tighter text-headline">Set new password</h1>
        <p className="text-text-secondary-dynamic text-sm mt-2">Choose a fresh, secure password.</p>
      </header>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 rounded-xl border border-lotus-pink/30 bg-lotus-pink/5 flex items-center gap-2.5 text-lotus-pink text-sm"
        >
          <AlertCircle size={14} /> {error}
        </motion.div>
      )}

      {success ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-marigold/30 bg-marigold/5 flex flex-col items-center gap-3 text-marigold text-center"
        >
          <CheckCircle2 size={24} strokeWidth={1.5} />
          <p className="font-semibold text-headline">Password updated</p>
          <p className="text-sm text-text-secondary-dynamic">Redirecting to dashboard…</p>
        </motion.div>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic">New password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary-dynamic" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-dynamic border border-border focus:border-headline rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary-dynamic placeholder:text-text-tertiary-dynamic outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-headline text-bg text-xs font-institutional uppercase tracking-[0.24em] hover:bg-headline/90 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Update password'}
          </button>
        </form>
      )}
    </motion.section>
  )
}
