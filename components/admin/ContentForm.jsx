'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, AlertCircle, ImageIcon, FileText, FileDown, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ImageUploader from './ImageUploader'
import TipTapEditor from './TipTapEditor'
import { slugify } from '@/lib/slugify'
import { createClient } from '@/lib/supabase/client'

const contentSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  type: z.enum(['ARTICLE', 'PROBLEM', 'BLOG', 'RESOURCE']),
  content_type: z.enum(['RICHTEXT', 'PDF']),
  body: z.string().optional(),
  pdf_url: z.string().optional(),
  pdf_filename: z.string().optional(),
  published_date: z.string().optional(),
  excerpt: z.string().optional(),
  cover_url: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author_name: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

export default function ContentForm({ initialData = null }) {
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
    resolver: zodResolver(contentSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      type: 'ARTICLE',
      content_type: 'RICHTEXT',
      body: '',
      pdf_url: '',
      pdf_filename: '',
      published_at: new Date().toISOString().split('T')[0],
      excerpt: '',
      cover_url: '',
      tags: [],
      author_name: '',
      status: 'PUBLISHED',
    },
  })

  // Auto-fill author name for new content
  useEffect(() => {
    if (!isEditing) {
      async function getAuthor() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single()
          
          if (profile?.name) {
            setValue('author_name', profile.name)
          }
        }
      }
      getAuthor()
    }
  }, [isEditing, setValue])

  const coverUrl = watch('cover_url')
  const pdfUrl = watch('pdf_url')
  const tags = watch('tags')

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
      const url = isEditing ? `/api/content/${initialData.id}` : '/api/content'
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

      router.push('/admin/content')
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
            href="/admin/content" 
            className="p-2 rounded-xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all text-text-tertiary hover:text-primary"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit Content: ${initialData.title}` : 'Create New Content'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <div className="flex p-1 bg-bg-secondary dark:bg-white/5 rounded-2xl border border-border dark:border-border-dark">
                {['RICHTEXT', 'PDF'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setValue('content_type', mode)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                      watch('content_type') === mode 
                        ? 'bg-white dark:bg-white/10 shadow-sm text-primary' 
                        : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                  >
                    {mode === 'RICHTEXT' ? 'Rich Text Editor' : 'PDF Document'}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Title</label>
                <input 
                  {...register('title')}
                  onChange={handleTitleChange}
                  placeholder="e.g. Introduction to Calculus"
                  className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-lg font-bold transition-all focus:outline-none focus:ring-4 ${
                    errors.title ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                  }`}
                />
                {errors.title && <p className="text-xs text-coral ml-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Author Name</label>
                  <input 
                    {...register('author_name')}
                    placeholder="e.g. MIN Team"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Published Date</label>
                  <input 
                    {...register('published_at')}
                    type="date"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {watch('content_type') === 'RICHTEXT' ? (
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Content Body</label>
                  <TipTapEditor 
                    initialContent={watch('body')} 
                    onChange={(html) => setValue('body', html)} 
                  />
                </div>
              ) : (
                <div className="space-y-6 pt-4 p-8 bg-bg-secondary dark:bg-white/5 rounded-3xl border border-dashed border-primary/20">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileDown size={32} />
                    </div>
                    <h4 className="font-bold">Upload PDF Document</h4>
                    <p className="text-xs text-text-tertiary">Max size: 10MB. Document will be hosted on Cloudinary.</p>
                  </div>
                  
                  {pdfUrl && (
                    <div className="p-4 bg-white dark:bg-bg-dark rounded-2xl flex items-center justify-between border border-border dark:border-border-dark">
                      <div className="flex items-center gap-3">
                        <FileDown className="text-primary" size={20} />
                        <span className="text-sm font-bold truncate max-w-[200px]">{watch('pdf_filename') || 'document.pdf'}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setValue('pdf_url', '')
                          setValue('pdf_filename', '')
                        }}
                        className="text-text-tertiary hover:text-coral transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <ImageUploader 
                      onUpload={(url, publicId, fileName) => {
                        setValue('pdf_url', url)
                        if (!watch('pdf_filename')) setValue('pdf_filename', fileName || 'Document.pdf')
                      }}
                      folder="min-website/content/pdfs"
                      label={pdfUrl ? 'Replace PDF' : 'Select PDF File'}
                      accept="application/pdf"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Excerpt / Summary</label>
                <textarea 
                  {...register('excerpt')}
                  placeholder="A short summary for previews..."
                  rows={3}
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                />
              </div>
            </div>
          </div>


          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Metadata</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Type</label>
                <select 
                  {...register('type')}
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent cursor-pointer font-bold"
                >
                  <option value="ARTICLE">Article</option>
                  <option value="PROBLEM">Problem</option>
                  <option value="BLOG">Blog Post</option>
                  <option value="RESOURCE">Resource</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Status</label>
                <select 
                  {...register('status')}
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent cursor-pointer font-bold"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
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
                folder="min-website/content/covers"
                label={coverUrl ? 'Change Cover' : 'Upload Cover'}
              />
            </div>

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-[10px] font-bold border border-primary/10 uppercase tracking-widest">
                    {tag}
                    <button 
                      type="button"
                      onClick={() => setValue('tags', tags.filter((_, idx) => idx !== i))}
                      className="hover:text-coral transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input 
                  type="text"
                  placeholder="Add tag..."
                  className="bg-transparent border-none text-[10px] font-bold focus:outline-none min-w-[80px] uppercase tracking-widest"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const val = e.target.value.trim().toLowerCase()
                      if (val && !tags.includes(val)) {
                        setValue('tags', [...tags, val])
                        e.target.value = ''
                      }
                    }
                  }}
                />
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
                    {isEditing ? 'Save Changes' : 'Create Content'}
                  </>
                )}
              </button>
              <Link 
                href="/admin/content"
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
