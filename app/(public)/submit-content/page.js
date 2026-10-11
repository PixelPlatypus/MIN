'use client'
import { useState } from 'react'
import { m } from 'framer-motion'
import { PaperPlaneTilt as Send, FileArrowDown as FileDown, CircleNotch as Loader2, CheckCircle as CheckCircle2, WarningCircle as AlertCircle, RocketLaunch as Sparkles, User, Envelope as Mail, Plus, X } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ImageUploader from '@/components/admin/ImageUploader'
import { captureEvent } from '@/lib/analytics'
import PageHero from '@/components/public/PageHero'

const submissionSchema = z.object({
  submitter_name: z.string().min(2, 'Name is required'),
  submitter_email: z.string().email('Valid email is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  type: z.enum(['ARTICLE', 'PROBLEM', 'BLOG', 'RESOURCE']),
  content_type: z.enum(['RICHTEXT', 'PDF', 'LINK']),
  body: z.string().optional(),
  pdf_url: z.string().optional(),
  pdf_filename: z.string().optional(),
})

export default function SubmitContentPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      submitter_name: '',
      submitter_email: '',
      title: '',
      type: 'ARTICLE',
      content_type: 'PDF',
      body: '',
      pdf_url: '',
      pdf_filename: '',
    },
  })

  const contentType = watch('content_type')
  const pdfUrl = watch('pdf_url')
  const body = watch('body')

  async function onSubmit(data) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Something went wrong')
      }

      captureEvent('content_submitted', { type: data.type, content_type: data.content_type, title: data.title })
      setSuccess(true)
      reset()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="pt-36 md:pt-40 pb-24 container mx-auto px-6 max-w-2xl text-center space-y-8">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-brand rounded-[2.5rem] p-10 md:p-20 space-y-6"
        >
          <div className="w-24 h-24 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={64} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gradient-brand pb-1">Submission Received!</h1>
          <p className="text-lg text-auto-secondary leading-relaxed">
            Thank you for contributing to the MIN knowledge base. Our editorial team 
            will review your submission and notify you via email once it's approved.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="btn-brand text-lg"
          >
            Submit Another
          </button>
        </m.div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <PageHero
        eyebrow="Contribute"
        icon={<Sparkles size={16} weight="bold" />}
        title="Share Your Knowledge"
        description="Found an interesting problem or written an insightful article? Submit it to the MIN Library and help students across Nepal."
      />

      <div className="container mx-auto px-6 max-w-5xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-brand rounded-[2.5rem] p-6 sm:p-8 md:p-12 space-y-8">
              <input type="hidden" {...register('content_type')} />
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Content Title</label>
                  <input 
                    {...register('title')}
                    placeholder="e.g. A Deep Dive into Plane Geometry"
                    className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-4 px-6 text-lg font-bold transition-all focus:outline-none focus:ring-4 ${
                      errors.title ? 'border-rose-500/50 focus:ring-rose-500/10' : 'border-primary/15 dark:border-white/15 focus:border-primary focus:ring-primary/10 dark:focus:border-secondary/60 dark:focus:ring-secondary/10'
                    }`}
                  />
                  {errors.title && <p className="text-xs text-rose-500 ml-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-6 p-6 sm:p-8 bg-primary/[0.03] dark:bg-white/5 rounded-3xl border border-dashed border-primary/20 dark:border-white/15">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-16 bg-coral/10 text-coral rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <FileDown size={32} />
                    </div>
                    <h4 className="font-bold">Upload PDF Document</h4>
                    <p className="text-xs text-auto-tertiary">Max size: 10MB. Document will be hosted on Cloudinary.</p>
                  </div>
                  
                  {pdfUrl && (
                    <div className="p-4 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-between gap-3 border border-primary/15 dark:border-white/15 shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileDown className="text-coral shrink-0" size={20} />
                        <span className="text-sm font-bold truncate max-w-[200px]">{watch('pdf_filename') || 'document.pdf'}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setValue('pdf_url', '')
                          setValue('pdf_filename', '')
                        }}
                        className="text-auto-tertiary hover:text-rose-500 transition-colors shrink-0"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <ImageUploader 
                      onUpload={(url, publicId, fileName) => {
                        setValue('pdf_url', url)
                        setValue('pdf_filename', fileName)
                      }}
                      folder="min-website/submissions/pdfs"
                      label={pdfUrl ? 'Replace PDF' : 'Select PDF File'}
                      accept="application/pdf"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submitter Info Column */}
          <div className="space-y-8">
            <div className="card-brand rounded-[2.5rem] p-6 sm:p-8 space-y-8">
              <h3 className="text-xl font-bold tracking-tight">Your Details</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-auto-tertiary transition-colors group-focus-within:text-primary dark:group-focus-within:text-secondary">
                      <User size={18} />
                    </div>
                    <input 
                      {...register('submitter_name')}
                      placeholder="Jane Doe"
                      className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 pl-12 pr-4 text-sm transition-all focus:outline-none focus:ring-4 ${
                        errors.submitter_name ? 'border-rose-500/50 focus:ring-rose-500/10' : 'border-primary/15 dark:border-white/15 focus:border-primary focus:ring-primary/10 dark:focus:border-secondary/60 dark:focus:ring-secondary/10'
                      }`}
                    />
                  </div>
                  {errors.submitter_name && <p className="text-xs text-rose-500 ml-1">{errors.submitter_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-auto-tertiary transition-colors group-focus-within:text-primary dark:group-focus-within:text-secondary">
                      <Mail size={18} />
                    </div>
                    <input 
                      {...register('submitter_email')}
                      placeholder="jane@example.com"
                      className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 pl-12 pr-4 text-sm transition-all focus:outline-none focus:ring-4 ${
                        errors.submitter_email ? 'border-rose-500/50 focus:ring-rose-500/10' : 'border-primary/15 dark:border-white/15 focus:border-primary focus:ring-primary/10 dark:focus:border-secondary/60 dark:focus:ring-secondary/10'
                      }`}
                    />
                  </div>
                  {errors.submitter_email && <p className="text-xs text-rose-500 ml-1">{errors.submitter_email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Content Type</label>
                  <select 
                    {...register('type')}
                    className="w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm font-bold transition-all focus:outline-none focus:ring-4 border-primary/15 dark:border-white/15 focus:border-primary focus:ring-primary/10 dark:focus:border-secondary/60 dark:focus:ring-secondary/10 cursor-pointer"
                  >
                    <option value="ARTICLE">Article</option>
                    <option value="PROBLEM">Problem</option>
                    <option value="BLOG">Blog Post</option>
                    <option value="RESOURCE">Resource</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-brand w-full py-5 text-lg gap-3 group"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    Submit Content
                    <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-auto-tertiary leading-relaxed text-center px-4">
                By submitting, you agree to the MIN Terms of Use and grant us permission 
                to publish this content for educational purposes.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
