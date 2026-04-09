'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, AlertCircle, ImageIcon, Calendar, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ImageUploader from './ImageUploader'
import TipTapEditor from './TipTapEditor'
import { slugify } from '@/lib/slugify'

const eventSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  cover_url: z.string().optional(),
  gallery_urls: z.array(z.string()).default([]),
  action_link: z.string().optional().nullable(),
  youtube_playlist: z.string().optional().nullable(),
  event_type: z.enum(['RECURRING', 'EVERGOING', 'SPECIAL', 'EVENT']).default('EVENT'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

export default function EventForm({ initialData = null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      description: '',
      location: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      cover_url: '',
      gallery_urls: [],
      action_link: '',
      youtube_playlist: '',
      event_type: 'EVENT',
      status: 'DRAFT',
    },
  })

  const title = watch('title')
  const coverUrl = watch('cover_url')
  const description = watch('description')

  const handleTitleChange = (e) => {
    const value = e.target.value
    setValue('title', value)
    if (!isEditing) {
      setValue('slug', slugify(value))
    }
  }

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    try {
      const url = isEditing ? `/api/events/${initialData.id}` : '/api/events'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Something went wrong')
      }

      router.push('/admin/events')
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
            href="/admin/events" 
            className="p-2 rounded-xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all text-text-tertiary hover:text-primary"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit Event: ${initialData.title}` : 'Create New Event'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Event Title</label>
                <input 
                  {...register('title')}
                  onChange={handleTitleChange}
                  placeholder="e.g. JMOC 2024"
                  className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-lg font-bold transition-all focus:outline-none focus:ring-4 ${
                    errors.title ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                  }`}
                />
                {errors.title && <p className="text-xs text-coral ml-1">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Slug</label>
                <input 
                  {...register('slug')}
                  placeholder="e-g-jmoc-2024"
                  className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-2 px-4 text-xs font-mono transition-all focus:outline-none focus:ring-4 ${
                    errors.slug ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                  }`}
                />
                {errors.slug && <p className="text-xs text-coral ml-1">{errors.slug.message}</p>}
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
              <h3 className="text-lg font-bold tracking-tight">Gallery</h3>
              <p className="text-sm text-text-tertiary mb-4">Add images to the event gallery.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {watch('gallery_urls').map((url, i) => (
                  <div key={i} className="aspect-square relative rounded-2xl overflow-hidden group">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        const urls = watch('gallery_urls')
                        setValue('gallery_urls', urls.filter((_, idx) => idx !== i))
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-coral text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div className="aspect-square">
                  <ImageUploader 
                    onUpload={(url) => {
                      const urls = watch('gallery_urls')
                      setValue('gallery_urls', [...urls, url])
                    }}
                    folder={`min-website/events/${watch('slug') || 'temp'}`}
                    label="Add Image"
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Status & Settings</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Event Type</label>
                <select 
                  {...register('event_type')}
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent cursor-pointer"
                >
                  <option value="EVENT">Event (Standard)</option>
                  <option value="RECURRING">Recurring</option>
                  <option value="EVERGOING">Evergoing</option>
                  <option value="SPECIAL">Special</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Status</label>
                <select 
                  {...register('status')}
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent cursor-pointer"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Start Date</label>
                <input 
                  {...register('start_date')}
                  type="date"
                  className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 ${
                    errors.start_date ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                  }`}
                />
                {errors.start_date && <p className="text-xs text-coral ml-1">{errors.start_date.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">End Date (Optional)</label>
                <input 
                  {...register('end_date')}
                  type="date"
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Location</label>
                <input 
                  {...register('location')}
                  placeholder="e.g. Kathmandu, Nepal"
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Action Link (Optional)</label>
                <input 
                  {...register('action_link')}
                  placeholder="e.g. https://forms.gle/..."
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">YouTube Playlist URL (Optional)</label>
                <input 
                  {...register('youtube_playlist')}
                  placeholder="Playlist URL..."
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
                folder={`min-website/events/${watch('slug') || 'temp'}`}
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
                    {isEditing ? 'Save Changes' : 'Create Event'}
                  </>
                )}
              </button>
              <Link 
                href="/admin/events"
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
