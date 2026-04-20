'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2, AlertCircle, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ImageUploader from './ImageUploader'

const teamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  position: z.string().min(1, 'Position is required'),
  bio: z.string().optional(),
  tenure: z.string().min(4, 'Tenure year is required'),
  joined_date: z.string().min(1, 'Joined date is required'),
  farewell_date: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  display_order: z.number().int().default(0),
  status: z.enum(['ACTIVE', 'ALUMNI', 'INACTIVE', 'REMOVED']).default('ACTIVE'),
  social_links: z.object({
    social_media: z.string().url().or(z.literal('')).optional(),
    facebook: z.string().url().or(z.literal('')).optional(),
    instagram: z.string().url().or(z.literal('')).optional(),
    linkedin: z.string().url().or(z.literal('')).optional(),
    email: z.string().email().or(z.literal('')).optional(),
    github: z.string().url().or(z.literal('')).optional(),
  }).default({}),
}).refine(data => {
  if (data.farewell_date && data.joined_date) {
    return new Date(data.farewell_date) >= new Date(data.joined_date)
  }
  return true
}, {
  message: "Farewell date cannot be earlier than joined date",
  path: ["farewell_date"]
})

export default function TeamForm({ initialData = null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [settings, setSettings] = useState(null)
  const router = useRouter()
  const isEditing = !!initialData

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setSettings(data))
      .catch(err => {
        if (err.name !== 'TypeError') {
          console.error('Settings load error:', err)
        }
      })
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: initialData || {
      name: '',
      position: 'MINion',
      bio: '',
      tenure: new Date().getFullYear().toString(),
      joined_date: new Date().toISOString().split('T')[0],
      farewell_date: null,
      photo_url: '',
      display_order: 0,
      status: 'ACTIVE',
      social_links: {
        social_media: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        email: '',
        github: '',
      },
    },
  })

  const photoUrl = watch('photo_url')

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    // Fun randomized photo selection if empty
    if (!data.photo_url && settings?.team_identity_assets?.length > 0) {
      const assets = settings.team_identity_assets
      data.photo_url = assets[Math.floor(Math.random() * assets.length)]
    }

    try {
      const url = isEditing ? `/api/team/${initialData.id}` : '/api/team'
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

      router.push('/admin/team')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/team" 
            className="p-2 rounded-xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all text-text-tertiary hover:text-primary"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit Member: ${initialData.name}` : 'Add New Team Member'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Photo Upload Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="glass rounded-[2rem] p-6 space-y-4 text-center">
              <label className="text-sm font-bold uppercase tracking-widest text-text-tertiary block mb-4">
                Profile Photo
              </label>
              
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-primary/10 shadow-lg group">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-bg-secondary dark:bg-white/5 flex items-center justify-center text-text-tertiary">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={24} className="text-white" />
                </div>
              </div>

              <div className="pt-4">
                <ImageUploader 
                  onUpload={(url) => setValue('photo_url', url)} 
                  folder="min-website/team"
                  label={photoUrl ? 'Change Photo' : 'Upload Photo'}
                />
              </div>
              <p className="text-[10px] text-text-tertiary leading-relaxed">
                Recommended: Square image, max 2MB. Optimized automatically by Cloudinary.
              </p>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Full Name</label>
                  <input 
                    {...register('name')}
                    placeholder="e.g. John Doe"
                    className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-4 ${
                      errors.name ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-coral ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Status</label>
                  <select 
                    {...register('status')}
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ALUMNI">Alumni</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="REMOVED">Removed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Role / Position</label>
                  <select 
                    {...register('position')}
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                  >
                    <option value="MINion">MINion</option>
                    <option value="President">President</option>
                    <option value="Manager">Manager</option>
                  </select>
                  {errors.position && <p className="text-xs text-coral ml-1">{errors.position.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Tenure Year</label>
                  <input 
                    {...register('tenure')}
                    placeholder="e.g. 2025"
                    className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-4 ${
                      errors.tenure ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Joined Date</label>
                  <input 
                    {...register('joined_date')}
                    type="date"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Display Order</label>
                  <input 
                    {...register('display_order', { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Short Bio</label>
                <textarea 
                  {...register('bio')}
                  placeholder="Tell us a bit about this team member..."
                  rows={4}
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Farewell Date (Optional)</label>
                <input 
                  {...register('farewell_date')}
                  type="date"
                  className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-4 ${
                    errors.farewell_date ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                  }`}
                />
                {errors.farewell_date && <p className="text-xs text-coral ml-1">{errors.farewell_date.message}</p>}
              </div>
            </div>

            {/* Social Links Section */}
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Social & Contact Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Social Media</label>
                  <input 
                    {...register('social_links.social_media')}
                    placeholder="Link to Facebook or Instagram"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                {['LinkedIn', 'Email', 'GitHub'].map((platform) => (
                  <div key={platform} className="space-y-2">
                    <label className="text-sm font-medium ml-1">{platform}</label>
                    <input 
                      {...register(`social_links.${platform.toLowerCase()}`)}
                      placeholder={`${platform} ${platform === 'Email' ? 'address' : 'URL'}`}
                      className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                ))}
              </div>
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
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link 
                href="/admin/team"
                className="px-8 py-3.5 rounded-2xl text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-bg-secondary dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white px-12 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    {isEditing ? 'Save Changes' : 'Create Member'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
