'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, AlertCircle, Layers, Globe, ListOrdered, CheckCircle2, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const programSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  tagline: z.string().optional(),
  learn_more_link: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  display_order: z.number().int().default(0),
})

export default function ProgramForm({ initialData }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(programSchema),
    defaultValues: initialData,
  })

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    try {
      const isNew = !initialData?.id
      const res = await fetch(isNew ? '/api/programs' : `/api/programs/${initialData.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-')
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Something went wrong')
      }

      router.push('/admin/programs')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const isNew = !initialData?.id

  const inputClasses = "w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-4 px-5 text-base transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder:text-text-tertiary"
  const labelClasses = "text-xs font-black uppercase tracking-widest text-text-tertiary ml-1 block mb-2"

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link 
            href="/admin/programs" 
            className="inline-flex items-center gap-2 text-sm font-bold text-text-tertiary hover:text-primary transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Programs
          </Link>
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight text-dynamic">
              {isNew ? 'Create New' : 'Edit'} Program
            </h2>
            <p className="text-text-tertiary text-lg font-medium">Configure initiative details and redirects.</p>
          </div>
        </div>

        {!isNew && (
            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${initialData.status === 'ACTIVE' ? 'bg-green/10 text-green border-green/20' : 'bg-red/10 text-red border-red/20'}`}>
                {initialData.status}
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 gap-8">
          {/* Core Identification Section */}
          <div className="glass rounded-[3rem] p-10 md:p-14 space-y-10 border border-white/40 dark:border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 border-b border-border pb-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Layers size={24}/>
                 </div>
                 <div>
                    <h3 className="text-xl font-black tracking-tight">Identity & Branding</h3>
                    <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest">General program info</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                    <label className={labelClasses}>Program Name</label>
                    <input 
                        {...register('name')}
                        placeholder="e.g. ETA Campaigns"
                        className={`${inputClasses} font-bold text-lg`}
                    />
                    {errors.name && <p className="text-xs text-coral font-bold mt-2 ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className={labelClasses}>Catchy Tagline</label>
                    <input 
                        {...register('tagline')}
                        placeholder="e.g. Education to action"
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="space-y-2 max-w-2xl">
                <label className={labelClasses}>Custom Navigation Link</label>
                <div className="relative group/input">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within/input:text-primary transition-colors" size={20} />
                    <input 
                        {...register('learn_more_link')}
                        placeholder="e.g. /events or https://..."
                        className={`${inputClasses} pl-14 font-mono text-sm`}
                    />
                </div>
                <p className="text-[10px] text-text-tertiary font-medium italic ml-1 mt-2">Overrides the default "/events" behavior.</p>
            </div>
          </div>

          {/* Configuration & Visibility Section */}
          <div className="glass rounded-[3rem] p-10 md:p-14 space-y-10 border border-white/40 dark:border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 border-b border-border pb-6">
                 <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-dark flex items-center justify-center">
                    <Settings size={24}/>
                 </div>
                 <div>
                    <h3 className="text-xl font-black tracking-tight">Visibility Settings</h3>
                    <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest">Controls how it appears on site</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className={labelClasses}>Publishing Status</label>
                    <div className="grid grid-cols-2 gap-4">
                        {['ACTIVE', 'INACTIVE'].map((status) => (
                           <label 
                             key={status}
                             className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer font-bold text-sm ${
                               register('status').value === status || watch('status') === status
                                 ? 'border-primary bg-primary/5 text-primary' 
                                 : 'border-border hover:border-text-tertiary/30 text-text-tertiary'
                             }`}
                           >
                             <input type="radio" {...register('status')} value={status} className="hidden" />
                             {status === 'ACTIVE' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                             {status}
                           </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={labelClasses}>Display Priority</label>
                    <div className="relative group/input">
                        <ListOrdered className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within/input:text-primary transition-colors" size={20} />
                        <input 
                            {...register('display_order', { valueAsNumber: true })}
                            type="number"
                            className={`${inputClasses} pl-14`}
                        />
                    </div>
                    <p className="text-[10px] text-text-tertiary font-medium italic ml-1 mt-2">Lower numbers appear first (e.g., 1, 2, 3).</p>
                </div>
            </div>
          </div>
        </div>

        {/* Global Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-[2rem] bg-coral/10 border border-coral/20 flex items-center gap-4 text-coral"
          >
            <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
               <AlertCircle size={24} />
            </div>
            <div>
                <p className="font-black text-sm uppercase tracking-widest">Process Error</p>
                <p className="text-sm opacity-80">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-10 border-t border-border">
          <Link 
            href="/admin/programs"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-all text-center"
          >
            Discard Changes
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <Save size={20} />
                {isNew ? 'Create Program' : 'Publish Changes'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
