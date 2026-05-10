'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { LogoMark } from '@/components/shared/Logo'
import { loginAction } from './actions'
import { captureEvent, identifyUser } from '@/lib/analytics'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const inputBase = 'w-full bg-bg-dynamic border rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary-dynamic placeholder:text-text-tertiary-dynamic outline-none transition-colors'

export default function LoginPage() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState(null)
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const identifierValue = watch('identifier')

  async function onSubmit(data) {
    setLoading(true)
    setError(null)
    try {
      const result = await loginAction(data)
      if (!result.success) {
        setError(result.error === 'Invalid login credentials' ? 'Invalid email or password.' : result.error)
        captureEvent('admin_login_failed', { identifier: data.identifier, error: result.error })
        setLoading(false)
      } else {
        identifyUser(data.identifier, { identifier: data.identifier })
        captureEvent('admin_login_success', { identifier: data.identifier })
        router.refresh()
        setTimeout(() => router.push('/admin'), 300)
      }
    } catch (err) {
      console.error('Unexpected login error:', err)
      setError('A connection error occurred. Please check your network and try again.')
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    if (!identifierValue) {
      setError('Enter your username or email first.')
      return
    }
    setResetting(true)
    setError(null)
    setResetMessage(null)
    const { resetPasswordAction } = await import('./actions')
    const result = await resetPasswordAction(identifierValue)
    if (result.success) {
      captureEvent('password_reset_requested', { identifier: identifierValue })
      setResetMessage('Reset instructions sent. Check your email.')
    } else {
      setError(result.error)
    }
    setResetting(false)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-bg-dynamic p-8 md:p-10"
    >
      <header className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center mb-4 group" aria-label="MIN home">
          <LogoMark className="h-12 w-auto transition-transform group-hover:scale-105" />
        </Link>
        <div className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic mb-2">Admin Portal</div>
        <h1 className="text-2xl font-black tracking-tighter text-headline">Sign in</h1>
        <p className="text-text-secondary-dynamic text-sm mt-2">Manage Mathematics Initiatives content.</p>
      </header>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 rounded-xl border border-lotus-pink/30 bg-lotus-pink/5 flex items-center gap-2.5 text-lotus-pink text-sm"
        >
          <AlertCircle size={14} /> {error}
        </motion.div>
      )}

      {resetMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 rounded-xl border border-marigold/30 bg-marigold/5 flex items-center gap-2.5 text-marigold text-sm"
        >
          <CheckCircle2 size={14} /> {resetMessage}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic">Username or email</label>
          <div className="relative">
            <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary-dynamic" />
            <input
              {...register('identifier')}
              type="text"
              placeholder="Enter your username or email"
              className={`${inputBase} ${errors.identifier ? 'border-lotus-pink/50 focus:border-lotus-pink' : 'border-border focus:border-headline'}`}
            />
          </div>
          {errors.identifier && <p className="text-xs text-lotus-pink">{errors.identifier.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic">Password</label>
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetting}
              className="text-xs text-text-tertiary-dynamic hover:text-headline transition-colors disabled:opacity-50"
            >
              {resetting ? 'Sending…' : 'Forgot password?'}
            </button>
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary-dynamic" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`${inputBase} ${errors.password ? 'border-lotus-pink/50 focus:border-lotus-pink' : 'border-border focus:border-headline'}`}
            />
          </div>
          {errors.password && <p className="text-xs text-lotus-pink">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-headline text-bg text-xs font-institutional uppercase tracking-[0.24em] hover:bg-headline/90 transition-colors disabled:opacity-60 group"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <>Sign in <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></>}
        </button>
      </form>

      <div className="mt-7 text-center">
        <Link href="/" className="text-xs text-text-tertiary-dynamic hover:text-headline transition-colors">
          ← Back to homepage
        </Link>
      </div>
    </motion.section>
  )
}
