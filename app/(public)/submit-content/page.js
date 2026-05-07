'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, FileDown, Loader2, CheckCircle2, AlertCircle, Sparkles, User, Mail, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ImageUploader from '@/components/admin/ImageUploader'
import { captureEvent } from '@/lib/analytics'

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
      <div className="pt-32 pb-24 container mx-auto px-6 max-w-2xl text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface rounded-3xl p-12 md:p-24 space-y-6 border border-border"
        >
          <div className="w-24 h-24 rounded-xl bg-marigold/5 border border-marigold/10 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={64} className="text-marigold" />
          </div>
          <h1 className="text-headline text-4xl font-bold tracking-tight">Submission Received!</h1>
          <p className="text-lg text-text-secondary-dynamic leading-relaxed">
            Thank you for contributing to the MIN knowledge base. Our editorial team
            will review your submission and notify you via email once it&apos;s approved.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-headline text-bg px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent transition-all"
          >
            Submit Another
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 max-w-5xl">
      <div className="space-y-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 pill px-4 py-2 text-xs font-institutional tracking-[0.2em] text-text-secondary-dynamic">
            <Sparkles size={16} className="text-marigold" />
            Contribute
          </div>
          <h1 className="text-headline text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
            Share Your Knowledge
          </h1>
          <p className="text-xl text-text-secondary-dynamic leading-relaxed">
            Found an interesting problem or written an insightful article?
            Submit it to the MIN Library and help students across Nepal.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface rounded-3xl p-8 md:p-12 space-y-8 border border-border">
              <input type="hidden" {...register('content_type')} />
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary-dynamic ml-1">Content Title</label>
                  <input
                    {...register('title')}
                    placeholder="e.g. A Deep Dive into Plane Geometry"
                    className={`w-full bg-bg-secondary border rounded-xl py-4 px-6 text-lg font-bold text-text-primary-dynamic transition-all focus:outline-none focus:ring-2 ${
                      errors.title ? 'border-sari-red/50 focus:ring-sari-red/10' : 'border-border focus:border-headline focus:ring-headline/10'
                    }`}
                  />
                  {errors.title && <p className="text-xs text-sari-red ml-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-6 p-8 bg-bg-secondary rounded-xl border border-dashed border-border">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-16 rounded-xl bg-marigold/5 border border-marigold/10 flex items-center justify-center mx-auto mb-4">
                      <FileDown size={32} className="text-marigold" />
                    </div>
                    <h4 className="text-headline font-bold">Upload PDF Document</h4>
                    <p className="text-xs text-text-tertiary-dynamic">Max size: 10MB. Document will be hosted on Cloudinary.</p>
                  </div>

                  {pdfUrl && (
                    <div className="p-4 bg-surface rounded-xl flex items-center justify-between border border-border">
                      <div className="flex items-center gap-3">
                        <FileDown className="text-marigold" size={20} />
                        <span className="text-sm font-bold text-text-primary-dynamic truncate max-w-[200px]">{watch('pdf_filename') || 'document.pdf'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setValue('pdf_url', '')
                          setValue('pdf_filename', '')
                        }}
                        className="text-text-tertiary-dynamic hover:text-sari-red transition-colors"
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

          <div className="space-y-8">
            <div className="bg-surface rounded-2xl p-8 space-y-8 border border-border">
              <h3 className="text-headline text-xl font-bold tracking-tight">Your Details</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary-dynamic ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary-dynamic">
                      <User size={18} />
                    </div>
                    <input
                      {...register('submitter_name')}
                      placeholder="Jane Doe"
                      className={`w-full bg-bg-secondary border rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary-dynamic transition-all focus:outline-none focus:ring-2 ${
                        errors.submitter_name ? 'border-sari-red/50 focus:ring-sari-red/10' : 'border-border focus:border-headline focus:ring-headline/10'
                      }`}
                    />
                  </div>
                  {errors.submitter_name && <p className="text-xs text-sari-red ml-1">{errors.submitter_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary-dynamic ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary-dynamic">
                      <Mail size={18} />
                    </div>
                    <input
                      {...register('submitter_email')}
                      placeholder="jane@example.com"
                      className={`w-full bg-bg-secondary border rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary-dynamic transition-all focus:outline-none focus:ring-2 ${
                        errors.submitter_email ? 'border-sari-red/50 focus:ring-sari-red/10' : 'border-border focus:border-headline focus:ring-headline/10'
                      }`}
                    />
                  </div>
                  {errors.submitter_email && <p className="text-xs text-sari-red ml-1">{errors.submitter_email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-secondary-dynamic ml-1">Content Type</label>
                  <select
                    {...register('type')}
                    className="w-full bg-bg-secondary border border-border rounded-xl py-3 px-4 text-sm font-bold text-text-primary-dynamic transition-all focus:outline-none focus:border-headline focus:ring-2 focus:ring-headline/10 cursor-pointer"
                  >
                    <option value="ARTICLE">Article</option>
                    <option value="PROBLEM">Problem</option>
                    <option value="BLOG">Blog Post</option>
                    <option value="RESOURCE">Resource</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-sari-red/5 border border-sari-red/20 flex items-center gap-3 text-sari-red text-xs">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-headline text-bg py-5 rounded-xl font-bold text-lg hover:bg-accent transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    Submit Content
                    <Send size={20} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-text-tertiary-dynamic leading-relaxed text-center px-4">
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
