'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, FileDown, Loader2, CheckCircle2, AlertCircle, Sparkles, User, Mail, Plus, X } from 'lucide-react'
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
          className="glass rounded-[3rem] p-12 md:p-24 space-y-6 shadow-2xl"
        >
          <div className="w-24 h-24 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle2 size={64} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Submission Received!</h1>
          <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
            Thank you for contributing to the MIN knowledge base. Our editorial team 
            will review your submission and notify you via email once it's approved.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
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
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
          >
            <Sparkles size={16} />
            Contribute
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]"
          >
            Share Your Knowledge
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed"
          >
            Found an interesting problem or written an insightful article? 
            Submit it to the MIN Library and help students across Nepal.
          </motion.p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[3rem] p-8 md:p-12 space-y-8 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Content Title</label>
                  <input 
                    {...register('title')}
                    placeholder="e.g. A Deep Dive into Plane Geometry"
                    className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-4 px-6 text-lg font-bold transition-all focus:outline-none focus:ring-4 ${
                      errors.title ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                    }`}
                  />
                  {errors.title && <p className="text-xs text-coral ml-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-6 p-8 bg-bg-secondary dark:bg-white/5 rounded-3xl border border-dashed border-coral/20">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-16 bg-coral/10 text-coral rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileDown size={32} />
                    </div>
                    <h4 className="font-bold">Upload PDF Document</h4>
                    <p className="text-xs text-text-tertiary">Max size: 10MB. Document will be hosted on Cloudinary.</p>
                  </div>
                  
                  {pdfUrl && (
                    <div className="p-4 bg-white dark:bg-bg-dark rounded-2xl flex items-center justify-between border border-border dark:border-border-dark shadow-sm">
                      <div className="flex items-center gap-3">
                        <FileDown className="text-coral" size={20} />
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
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-text-tertiary ml-1">Display Filename</label>
                      <input 
                        {...register('pdf_filename')}
                        placeholder="e.g. Geometry_Notes.pdf"
                        className="w-full bg-white dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-coral transition-all shadow-sm"
                      />
                    </div>
                    <ImageUploader 
                      onUpload={(url) => setValue('pdf_url', url)}
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
            <div className="glass rounded-[2.5rem] p-8 space-y-8 shadow-sm">
              <h3 className="text-xl font-bold tracking-tight">Your Details</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors group-focus-within:text-primary">
                      <User size={18} />
                    </div>
                    <input 
                      {...register('submitter_name')}
                      placeholder="Jane Doe"
                      className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 pl-12 pr-4 text-sm transition-all focus:outline-none focus:ring-4 ${
                        errors.submitter_name ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                      }`}
                    />
                  </div>
                  {errors.submitter_name && <p className="text-xs text-coral ml-1">{errors.submitter_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors group-focus-within:text-primary">
                      <Mail size={18} />
                    </div>
                    <input 
                      {...register('submitter_email')}
                      placeholder="jane@example.com"
                      className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 pl-12 pr-4 text-sm transition-all focus:outline-none focus:ring-4 ${
                        errors.submitter_email ? 'border-coral/50 focus:ring-coral/10' : 'border-border dark:border-border-dark focus:border-primary focus:ring-primary/10'
                      }`}
                    />
                  </div>
                  {errors.submitter_email && <p className="text-xs text-coral ml-1">{errors.submitter_email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Content Type</label>
                  <select 
                    {...register('type')}
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm font-bold transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent cursor-pointer"
                  >
                    <option value="ARTICLE">Article</option>
                    <option value="PROBLEM">Problem</option>
                    <option value="BLOG">Blog Post</option>
                    <option value="RESOURCE">Resource</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-coral/10 border border-coral/20 flex items-center gap-3 text-coral text-xs">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 group"
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

              <p className="text-[10px] text-text-tertiary leading-relaxed text-center px-4">
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
