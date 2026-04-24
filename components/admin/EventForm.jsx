'use client'
import { useState } from 'react'
import { Save, ArrowLeft, Loader2, AlertCircle, ImageIcon, Calendar, X, Plus, Trash2, Video } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
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
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  cover_url: z.string().optional(),
  gallery_urls: z.array(z.string()).default([]),
  action_link: z.string().optional().nullable(),
  action_text: z.string().optional().nullable(),
  action_title: z.string().optional().nullable(),
  action_description: z.string().optional().nullable(),
  action_deadline: z.string().optional().nullable(),
  youtube_title: z.string().optional().nullable(),
  youtube_videos: z.array(z.object({
    title: z.string().optional(),
    url: z.string().min(1, 'Video URL is required')
  })).default([]),
  show_date: z.boolean().default(true),
  show_action_link: z.boolean().default(true),
  show_youtube_playlist: z.boolean().default(true),
  event_type: z.enum(['RECURRING', 'EVERGOING', 'SPECIAL', 'EVENT']).default('EVENT'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
}).superRefine((data, ctx) => {
  if (data.show_date && !data.start_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Start date is required when "Show Date" is enabled',
      path: ['start_date']
    });
  }
});

export default function EventForm({ initialData = null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const isEditing = !!initialData

  // Format dates for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: isEditing ? {
      ...initialData,
      start_date: formatDateForInput(initialData.start_date),
      end_date: formatDateForInput(initialData.end_date),
      show_date: initialData.show_date ?? true,
      show_action_link: initialData.show_action_link ?? true,
      show_youtube_playlist: initialData.show_youtube_playlist ?? true,
      action_text: initialData.action_text || '',
      action_link: initialData.action_link || '',
      action_title: initialData.action_title || 'Registration / Action Required',
      action_description: initialData.action_description || 'Follow the link to participate or register for this event.',
      action_deadline: formatDateForInput(initialData.action_deadline),
      youtube_title: initialData.youtube_title || 'Event Recordings',
      youtube_videos: initialData.youtube_videos || [],
    } : {
      title: '',
      slug: '',
      description: '',
      location: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      cover_url: '',
      gallery_urls: [],
      action_link: '',
      action_text: '',
      action_title: 'Registration / Action Required',
      action_description: 'Follow the link to participate or register for this event.',
      action_deadline: '',
      youtube_title: 'Event Recordings',
      youtube_videos: [],
      show_date: true,
      show_action_link: true,
      show_youtube_playlist: true,
      event_type: 'EVENT',
      status: 'DRAFT',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "youtube_videos"
  });

  const title = watch('title')
  const coverUrl = watch('cover_url')
  const description = watch('description')
  const showDate = watch('show_date')

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

    // Clean data before submission
    const submissionData = {
      ...data,
      start_date: data.start_date === '' ? null : data.start_date,
      end_date: data.end_date === '' ? null : data.end_date,
      action_link: data.action_link === '' ? null : data.action_link,
      action_text: data.action_text === '' ? null : data.action_text,
      action_deadline: data.action_deadline === '' ? null : data.action_deadline,
      youtube_title: data.youtube_title === '' ? 'Event Recordings' : data.youtube_title,
    }

    try {
      const url = isEditing ? `/api/events/${initialData.id}` : '/api/events'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
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
                  <div key={i} className="aspect-square relative rounded-2xl overflow-hidden group shadow-sm">
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

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video size={24} className="text-coral" />
                  <h3 className="text-lg font-bold tracking-tight">Videos (YouTube)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => append({ title: '', url: '' })}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                >
                  <Plus size={14} />
                  Add Video
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark space-y-4 relative group">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-4 right-4 p-2 text-text-tertiary hover:text-coral transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary">Video Title</label>
                        <input
                          {...register(`youtube_videos.${index}.title`)}
                          placeholder="e.g. Workshop Session 1"
                          className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary">Video/Playlist URL</label>
                        <input
                          {...register(`youtube_videos.${index}.url`)}
                          placeholder="https://youtu.be/..."
                          className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                        {errors.youtube_videos?.[index]?.url && (
                          <p className="text-[10px] text-coral">{errors.youtube_videos[index].url.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {fields.length === 0 && (
                  <div className="py-12 text-center border-2 border-dashed border-border dark:border-border-dark rounded-[2rem]">
                    <Video size={32} className="mx-auto text-text-tertiary mb-2 opacity-50" />
                    <p className="text-sm text-text-tertiary font-medium">No videos added yet.</p>
                  </div>
                )}
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

              <div className="pt-4 space-y-4 border-t border-border dark:border-border-dark">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      {...register('show_date')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-bg-secondary dark:bg-white/10 rounded-full peer peer-checked:bg-primary transition-all"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:left-6"></div>
                  </div>
                  <span className="text-sm font-bold">Show Date on Event Page</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      {...register('show_action_link')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-bg-secondary dark:bg-white/10 rounded-full peer peer-checked:bg-primary transition-all"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:left-6"></div>
                  </div>
                  <span className="text-sm font-bold">Enable Action Button</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox"
                      {...register('show_youtube_playlist')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-bg-secondary dark:bg-white/10 rounded-full peer peer-checked:bg-primary transition-all"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:left-6"></div>
                  </div>
                  <span className="text-sm font-bold">Show YouTube Section</span>
                </label>
              </div>

              {showDate && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
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
              )}

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

              <div className="space-y-4 pt-4 border-t border-border dark:border-border-dark">
                <h4 className="text-xs font-black uppercase tracking-widest text-text-tertiary">Action Button Customization</h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Section Title</label>
                  <input 
                    {...register('action_title')}
                    placeholder="e.g. Registration / Action Required"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Section Description</label>
                  <textarea 
                    {...register('action_description')}
                    rows={2}
                    placeholder="Follow the link to participate or register..."
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Button Text</label>
                  <input 
                    {...register('action_text')}
                    placeholder="e.g. Register Now, Join Discord"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Button Link</label>
                  <input 
                    {...register('action_link')}
                    placeholder="e.g. https://forms.gle/..."
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Action Link Deadline</label>
                  <input 
                    {...register('action_deadline')}
                    type="date"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                  <p className="text-[10px] text-text-tertiary ml-1 italic">If not provided, the event's End Date will be used as the deadline.</p>
                </div>

                <h4 className="text-xs font-black uppercase tracking-widest text-text-tertiary pt-4">YouTube Section Settings</h4>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">YouTube Section Header</label>
                  <input 
                    {...register('youtube_title')}
                    list="youtube-title-suggestions"
                    placeholder="e.g. Event Recordings"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                  <datalist id="youtube-title-suggestions">
                    <option value="Event Recordings" />
                    <option value="Online Lesson" />
                    <option value="Tutorial" />
                    <option value="Workshop Highlights" />
                    <option value="Session Replay" />
                    <option value="Livestream" />
                  </datalist>
                </div>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Cover Image</h3>
              <div className="aspect-video relative rounded-2xl overflow-hidden border-2 border-primary/10 mb-4 bg-bg-secondary dark:bg-white/5 shadow-inner">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-tertiary gap-2">
                    <ImageIcon size={48} className="opacity-20" />
                    <span className="text-xs font-medium">No cover image</span>
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
