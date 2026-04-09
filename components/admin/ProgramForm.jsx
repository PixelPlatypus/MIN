'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, AlertCircle, ImageIcon, Layers } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ImageUploader from './ImageUploader'
import TipTapEditor from './TipTapEditor'

const programSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  tagline: z.string().optional(),
  description: z.string().optional(),
  cover_url: z.string().optional(),
  tags: z.array(z.string()).default([]),
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
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(programSchema),
    defaultValues: initialData,
  })

  const coverUrl = watch('cover_url')
  const description = watch('description')
  const tags = watch('tags')

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/programs/${initialData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/programs" 
            className="p-2 rounded-xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all text-text-tertiary hover:text-primary"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            Edit Program: {initialData.name}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Program Name</label>
                <input 
                  {...register('name')}
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-lg font-bold transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                {errors.name && <p className="text-xs text-coral ml-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Tagline</label>
                <input 
                  {...register('tagline')}
                  placeholder="e.g. Education to action"
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Description</label>
                <TipTapEditor 
                  content={description}
                  onChange={(html) => setValue('description', html)}
                />
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-bold border border-primary/10">
                    {tag}
                    <button 
                      type="button"
                      onClick={() => setValue('tags', tags.filter((_, idx) => idx !== i))}
                      className="hover:text-coral transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input 
                  type="text"
                  placeholder="Add tag and press Enter..."
                  className="bg-transparent border-none text-xs font-bold focus:outline-none min-w-[150px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const val = e.target.value.trim()
                      if (val && !tags.includes(val)) {
                        setValue('tags', [...tags, val])
                        e.target.value = ''
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Status & Order</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Status</label>
                <select 
                  {...register('status')}
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent cursor-pointer"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Display Order</label>
                <input 
                  {...register('display_order', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Cover Image</h3>
              <div className="aspect-video relative rounded-2xl overflow-hidden border-2 border-primary/10 mb-4 bg-bg-secondary dark:bg-white/5">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
              <ImageUploader 
                onUpload={(url) => setValue('cover_url', url)}
                folder={`min-website/programs/${initialData.slug}`}
                label={coverUrl ? 'Change Cover' : 'Upload Cover'}
              />
            </div>

            {/* Error Message */}
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

            {/* Form Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
              <Link 
                href="/admin/programs"
                className="w-full px-8 py-4 rounded-2xl text-sm font-bold text-text-secondary text-center hover:text-text-primary hover:bg-bg-secondary dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function X({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
