'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { loginAction } from './actions'
import { captureEvent, identifyUser } from '@/lib/analytics'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // No longer needed: const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  // State for forgot password flow
  const [resetting, setResetting] = useState(false)
  const [resetMessage, setResetMessage] = useState(null)
  
  const identifierValue = watch('identifier')

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    try {
      const result = await loginAction(data)

      if (!result.success) {
        // Handle specific Supabase error messages
        if (result.error === 'Invalid login credentials') {
          setError('Invalid email or password. Please try again.')
        } else {
          setError(result.error)
        }
        captureEvent('admin_login_failed', { identifier: data.identifier, error: result.error })
        setLoading(false)
      } else {
        identifyUser(data.identifier, { identifier: data.identifier })
        captureEvent('admin_login_success', { identifier: data.identifier })
        // Refresh to ensure cookies are sent on the next request
        router.refresh()
        // Wait a tiny bit then push to the admin dashboard
        setTimeout(() => {
          router.push('/admin')
        }, 300)
      }
    } catch (err) {
      console.error('Unexpected login error:', err)
      setError('A connection error occurred. Please check your internet and try again.')
      setLoading(false)
    } finally {
      // In case something fails to set loading back
      const timer = setTimeout(() => {
        setLoading(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }

  async function handleResetPassword() {
    if (!identifierValue) {
      setError('Please enter your username or email first.')
      return
    }
    setResetting(true)
    setError(null)
    setResetMessage(null)

    // Using dynamic import or direct function call from actions
    const { resetPasswordAction } = await import('./actions')
    const result = await resetPasswordAction(identifierValue)
    
    if (result.success) {
      captureEvent('password_reset_requested', { identifier: identifierValue })
      setResetMessage('Password reset instructions sent! Check your email.')
    } else {
      setError(result.error)
    }
    setResetting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-16 -mb-16 blur-3xl" />

      <div className="relative">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-secondary font-bold text-3xl">M</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Admin Portal</h1>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Sign in to manage MIN website content
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-coral/10 border border-coral/20 flex items-center gap-3 text-coral text-sm"
          >
            <AlertCircle size={18} />
            <p>{error}</p>
          </motion.div>
        )}
        
        {resetMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-green/10 border border-green/20 flex items-center gap-3 text-green text-sm"
          >
            <AlertCircle size={18} />
            <p>{resetMessage}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Username or Email</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors group-focus-within:text-primary">
                <Mail size={18} />
              </div>
              <input
                {...register('identifier')}
                type="text"
                placeholder="Enter your username or email"
                className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 pl-12 pr-4 text-sm transition-all focus:outline-none focus:ring-4 ${
                  errors.identifier 
                    ? 'border-coral/50 focus:ring-coral/10' 
                    : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                }`}
              />
            </div>
            {errors.identifier && (
              <p className="text-xs text-coral ml-1 mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium">Password</label>
              <button 
                type="button" 
                onClick={handleResetPassword}
                disabled={resetting}
                className="text-xs font-bold text-primary hover:underline transition-all"
              >
                {resetting ? 'Sending...' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors group-focus-within:text-primary">
                <Lock size={18} />
              </div>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 pl-12 pr-4 text-sm transition-all focus:outline-none focus:ring-4 ${
                  errors.password 
                    ? 'border-coral/50 focus:ring-coral/10' 
                    : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-coral ml-1 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-sm text-text-tertiary hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
