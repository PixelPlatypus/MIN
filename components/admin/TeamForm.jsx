'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadSimple as Upload, X, CircleNotch as Loader2, WarningCircle as AlertCircle, FloppyDisk as Save, ArrowLeft, Image as ImageIcon } from '@phosphor-icons/react'
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
  is_advisor: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'ALUMNI', 'INACTIVE', 'REMOVED']).default('ACTIVE'),
  certificate_url: z.string().url().or(z.literal('')).optional().nullable(),
  social_links: z.object({
    social_media: z.string().url().or(z.literal('')).optional(),
    facebook: z.string().url().or(z.literal('')).optional(),
    instagram: z.string().url().or(z.literal('')).optional(),
    linkedin: z.string().url().or(z.literal('')).optional(),
    email: z.string().email().or(z.literal('')).optional(),
    github: z.string().url().or(z.literal('')).optional(),
    role_history: z.array(z.object({
      year: z.string().min(4, "Year must be 4 digits"),
      position: z.string().min(1, "Position is required")
    })).default([]),
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
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()
  const isEditing = !!initialData

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setSettings(data))
      .catch(err => console.error('Settings load error:', err))

    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setCurrentUser(data))
      .catch(err => console.error('Profile load error:', err))
  }, [])

  let parsedSocialLinks = {
    social_media: '', facebook: '', instagram: '', linkedin: '', email: '', github: '', role_history: []
  };
  if (initialData?.social_links) {
    if (typeof initialData.social_links === 'string') {
      try { 
        const parsed = JSON.parse(initialData.social_links); 
        parsedSocialLinks = { ...parsedSocialLinks, ...parsed };
      } catch(e) { /* ignore */ }
    } else if (typeof initialData.social_links === 'object') {
      parsedSocialLinks = { ...parsedSocialLinks, ...initialData.social_links };
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      ...(initialData || {
        name: '',
        position: 'MINion',
        bio: '',
        tenure: new Date().getFullYear().toString(),
        photo_url: '',
        display_order: 0,
        is_advisor: false,
        status: 'ACTIVE',
        certificate_url: '',
      }),
      joined_date: initialData?.joined_date ? initialData.joined_date.substring(0, 7) : new Date().getFullYear().toString(),
      farewell_date: initialData?.farewell_date ? initialData.farewell_date.substring(0, 7) : '',
      social_links: parsedSocialLinks,
    },
  })

  const currentJoinedDate = watch('joined_date')
  
  // Auto-populate MINion role in UI when joined date is provided
  useEffect(() => {
    if (currentJoinedDate && currentJoinedDate.length >= 4) {
      const year = currentJoinedDate.split('-')[0]
      if (year.length === 4) {
        const history = watch('social_links.role_history') || []
        if (!history.some(r => r.year === year)) {
          setValue('social_links.role_history', [...history, { year, position: 'MINion' }])
        }
      }
    }
  }, [currentJoinedDate, setValue, watch])

  const photoUrl = watch('photo_url')

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    // Auto-derive data based on user requests
    if (data.joined_date) {
      const parts = data.joined_date.split('-')
      const year = parts[0]
      const month = parts[1] || '01'
      const day = parts[2] || '01'
      
      data.joined_date = `${year}-${month}-${day}`
      data.tenure = year

      // Automatically inject MINion role for their joining year (fallback backup)
      if (!data.social_links) data.social_links = {}
      if (!data.social_links.role_history) data.social_links.role_history = []
      
      const hasJoinedYearRole = data.social_links.role_history.some(r => r.year === data.tenure)
      if (!hasJoinedYearRole) {
        data.social_links.role_history.push({ year: data.tenure, position: 'MINion' })
      }
    }
    
    if (data.farewell_date && data.farewell_date.trim() !== '') {
      const parts = data.farewell_date.split('-')
      const year = parts[0]
      const month = parts[1] || '01'
      const day = parts[2] || '01'
      data.farewell_date = `${year}-${month}-${day}`
    } else {
      data.farewell_date = null
    }

    if (data.social_links?.role_history?.length > 0) {
      const history = [...data.social_links.role_history].sort((a,b) => parseInt(b.year) - parseInt(a.year))
      data.position = history[0].position
    } else {
      data.position = 'MINion'
    }

    // Generate slug from name if it doesn't exist
    const slugify = (text) => {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
    }
    
    if (!isEditing || !initialData.slug) {
      data.slug = slugify(data.name)
    }

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
            className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary transition-all text-auto-tertiary hover:text-primary"
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
              <label className="text-sm font-bold uppercase tracking-widest text-auto-tertiary block mb-4">
                Profile Photo
              </label>
              
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-primary/10 shadow-lg group">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-auto-tertiary">
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
              <p className="text-[10px] text-auto-tertiary leading-relaxed">
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
                    className={`w-full bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-4 ${
                      errors.name ? 'border-coral/50 focus:ring-coral/10' : 'border-border focus:border-primary focus:ring-primary/10'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-coral ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Status</label>
                  <select 
                    {...register('status')}
                    className="w-full bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ALUMNI">Alumni</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="REMOVED">Removed</option>
                  </select>
                </div>



                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Joined Date</label>
                  <input 
                    {...register('joined_date')}
                    type="text"
                    placeholder="YYYY or YYYY-MM"
                    className="w-full bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                  {errors.joined_date && <p className="text-xs text-coral ml-1">{errors.joined_date.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Display Order</label>
                  <input 
                    {...register('display_order', { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border border-border bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <input 
                      type="checkbox" 
                      {...register('is_advisor')}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                    />
                    <div>
                      <div className="text-sm font-bold">Mark as Advisor</div>
                      <div className="text-xs text-auto-tertiary">Advisors have special visibility and filtering on the public team page.</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Short Bio</label>
                <textarea 
                  {...register('bio')}
                  placeholder="Tell us a bit about this team member..."
                  rows={4}
                  className="w-full bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Farewell Date (Optional)</label>
                <input 
                  {...register('farewell_date')}
                  type="text"
                  placeholder="YYYY or YYYY-MM"
                  className={`w-full bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-4 ${
                    errors.farewell_date ? 'border-coral/50 focus:ring-coral/10' : 'border-border focus:border-primary focus:ring-primary/10'
                  }`}
                />
                {errors.farewell_date && <p className="text-xs text-coral ml-1">{errors.farewell_date.message}</p>}
              </div>
            </div>

            {/* Role History Section (Stored in social_links JSONB to avoid DB migration) */}
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight">Role History</h3>
                <button
                  type="button"
                  onClick={() => {
                    const currentHistory = watch('social_links.role_history') || []
                    setValue('social_links.role_history', [...currentHistory, { year: '', position: 'MINion' }])
                  }}
                  className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  + Add Past Role
                </button>
              </div>
              <p className="text-sm text-auto-tertiary">
                If this person was promoted, add their past roles here. They will automatically show up as their past role in those specific tenure years.
              </p>
              
              <div className="space-y-4">
                {(watch('social_links.role_history') || []).map((historyItem, index) => (
                  <div key={index} className="flex items-center gap-4 bg-bg-secondary p-4 rounded-2xl border border-black/5 dark:border-white/5 relative group">
                    <div className="space-y-1 flex-1">
                      <label className="text-xs font-bold text-auto-tertiary ml-1">Year</label>
                      <input 
                        {...register(`social_links.role_history.${index}.year`)}
                        placeholder="e.g. 2022"
                        className="w-full bg-white dark:bg-[#1a1a1a] border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="text-xs font-bold text-auto-tertiary ml-1">Position</label>
                      <select 
                        {...register(`social_links.role_history.${index}.position`)}
                        className="w-full bg-white dark:bg-[#1a1a1a] border border-border rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
                      >
                        <option value="MINion">MINion</option>
                        {currentUser?.role === 'ADMIN' && (
                          <option value="President">President</option>
                        )}
                        <option value="Manager">Manager</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentHistory = watch('social_links.role_history') || []
                        setValue('social_links.role_history', currentHistory.filter((_, i) => i !== index))
                      }}
                      className="mt-5 p-2 text-coral bg-coral/10 hover:bg-coral hover:text-white rounded-xl transition-colors"
                      title="Remove Role"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>



            {/* Certificate Section */}
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Certificate</h3>
              <p className="text-sm text-auto-tertiary">
                Upload a certificate image or document (will be displayed on the member's profile page).
              </p>
              
              <div className="space-y-4">
                {watch('certificate_url') && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                    <div className="w-16 h-16 relative bg-white/10 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                      {(watch('certificate_url') || '').endsWith('.pdf') ? (
                        <div className="text-xs font-bold uppercase tracking-widest text-primary">PDF</div>
                      ) : (
                        <img src={watch('certificate_url')} alt="Certificate" className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <a href={watch('certificate_url')} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline truncate block">
                        View Certificate
                      </a>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setValue('certificate_url', '')}
                      className="p-2 text-coral bg-coral/10 hover:bg-coral hover:text-white rounded-xl transition-colors shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                {!watch('certificate_url') && (
                  <ImageUploader 
                    onUpload={(url) => setValue('certificate_url', url)} 
                    folder="min-website/certificates"
                    label="Upload Certificate"
                    accept="image/*,application/pdf"
                  />
                )}
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
                    className="w-full bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                {['LinkedIn', 'Email', 'GitHub'].map((platform) => (
                  <div key={platform} className="space-y-2">
                    <label className="text-sm font-medium ml-1">{platform}</label>
                    <input 
                      {...register(`social_links.${platform.toLowerCase()}`)}
                      placeholder={`${platform} ${platform === 'Email' ? 'address' : 'URL'}`}
                      className="w-full bg-white/5 border border-border rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
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
                className="px-8 py-3.5 rounded-2xl text-sm font-bold text-auto-secondary hover:text-text-primary hover:bg-bg-secondary transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-marigold hover:bg-[color:var(--color-primary-dark)] text-bg px-12 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
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
