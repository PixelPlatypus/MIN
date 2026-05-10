'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Sparkles,
  Clock, Upload, FileText, Target,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import GridPaper from '@/components/shared/GridPaper'
import NepalBar from '@/components/shared/NepalBar'

const inputClass = 'w-full bg-bg-dynamic border border-border rounded-xl py-3.5 px-5 text-sm text-text-primary-dynamic placeholder:text-text-tertiary-dynamic focus:border-headline outline-none transition-colors'
const labelClass = 'text-[10px] font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic flex items-center gap-2'

function FieldLabel({ field }) {
  return (
    <label className={labelClass}>
      {field.label}
      {field.required && <span className="text-lotus-pink normal-case tracking-normal text-[10px]">— required</span>}
    </label>
  )
}

export default function DynamicFormPage() {
  const { slug } = useParams()
  const [definition, setDefinition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    async function fetchDefinition() {
      try {
        const res = await fetch(`/api/forms/definition?slug=${slug}`)
        if (!res.ok) throw new Error('Form not found or inactive')
        const data = await res.json()
        setDefinition(data)
        if (data.fields) {
          const initial = {}
          data.fields.forEach(f => { initial[f.label] = '' })
          setFormData(initial)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDefinition()
  }, [slug])

  const handleChange = (label, value) => setFormData(prev => ({ ...prev, [label]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (definition?.fields) {
      for (const field of definition.fields) {
        const val = formData[field.label]
        if (field.required && (!val || (Array.isArray(val) && val.length === 0))) {
          setError(`Please fill out the required field: ${field.label}`)
          setSubmitting(false)
          return
        }
        if (field.type === 'phone' && val && !isValidPhoneNumber(val)) {
          setError(`Invalid phone number for ${field.label}. Include country code (e.g. +977).`)
          setSubmitting(false)
          return
        }
        if (field.type === 'link' && val) {
          try { new URL(val) } catch {
            setError(`Please enter a valid URL (https://...) for ${field.label}.`)
            setSubmitting(false)
            return
          }
        }
      }
    }

    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id: definition.id, data: formData }),
      })
      if (!res.ok) throw new Error('Failed to submit application')
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const handleReminderSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const email = new FormData(e.target).get('email')
    try {
      const res = await fetch('/api/forms/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, category: definition.category }),
      })
      if (!res.ok) throw new Error('Failed to join waitlist')
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-text-tertiary-dynamic" />
      </div>
    )
  }

  if (error && !definition) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle size={32} className="mx-auto text-text-tertiary-dynamic" />
          <h2 className="text-3xl font-black tracking-tighter text-headline">Something went wrong</h2>
          <p className="text-text-secondary-dynamic">{error}</p>
          <Link href="/join" className="inline-block text-headline font-medium underline-offset-4 hover:underline">Return to programs</Link>
        </div>
      </main>
    )
  }

  if (submitted) {
    const isWaitlist = definition?.is_active === false
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
        <GridPaper opacity={0.08} spacing={80} />
        <NepalBar position="left" />
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-xl w-full text-center space-y-8 p-10 md:p-14 rounded-2xl border border-border bg-bg-dynamic/60 backdrop-blur-md"
        >
          <div className="h-16 w-16 mx-auto grid place-items-center rounded-full border border-marigold/30 text-marigold">
            <CheckCircle2 size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-headline">
              {isWaitlist ? 'Added to the waitlist' : 'Application received'}
            </h2>
            <p className="text-text-secondary-dynamic leading-relaxed">
              {isWaitlist
                ? `We'll notify you the moment the ${definition?.category || 'next'} intake opens.`
                : `Thank you for applying. A confirmation has been emailed. Our team will review your submission for the "${definition.batch_name || 'current'}" batch.`}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text-primary-dynamic hover:text-headline hover:border-headline/40 text-xs font-institutional uppercase tracking-[0.24em] transition-colors"
          >
            Return home
          </Link>
        </motion.section>
      </main>
    )
  }

  if (definition?.is_active === false) {
    return (
      <main className="relative min-h-screen pt-32 pb-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        <GridPaper opacity={0.08} spacing={80} />
        <NepalBar position="left" />

        <div className="relative max-w-2xl mx-auto space-y-12">
          <Link href="/join" className="inline-flex items-center gap-2 text-xs font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic hover:text-headline transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to programs
          </Link>

          <section className="space-y-8 p-10 md:p-12 rounded-2xl border border-border bg-bg-dynamic/60 backdrop-blur-md">
            <div className="h-14 w-14 grid place-items-center rounded-full border border-border text-text-primary-dynamic">
              <Clock size={22} strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
              <div className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic">Status</div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-headline">Intake closed</h1>
              <p className="text-text-secondary-dynamic leading-relaxed">
                The intake for <span className="text-headline font-semibold">{definition.title}</span> is currently closed while we evaluate the previous batch.
              </p>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <h3 className="text-[10px] font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic">Get notified when it opens</h3>
              <form onSubmit={handleReminderSubmit} className="flex flex-col sm:flex-row gap-3">
                <input type="email" name="email" required placeholder="Your email address" className={inputClass} />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-headline text-bg text-xs font-institutional uppercase tracking-[0.24em] hover:bg-headline/90 transition-colors disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} /> Alert me</>}
                </button>
              </form>
              {error && <p className="text-xs text-lotus-pink">{error}</p>}
            </div>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen pt-32 pb-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      <GridPaper opacity={0.08} spacing={80} />
      <NepalBar position="left" />

      <div className="relative max-w-3xl mx-auto space-y-12">
        <header className="space-y-6">
          <Link href="/join" className="inline-flex items-center gap-2 text-xs font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic hover:text-headline transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to programs
          </Link>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-text-tertiary-dynamic text-[10px] font-institutional uppercase tracking-[0.28em]">
              <Sparkles size={11} />
              Application
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] text-headline">{definition.title}</h1>
            {definition.description && (
              <p className="text-base md:text-lg text-text-secondary-dynamic leading-relaxed max-w-2xl">{definition.description}</p>
            )}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10 p-8 md:p-10 rounded-2xl border border-border bg-bg-dynamic/60 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {definition.fields.map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`space-y-2 ${['textarea', 'radio', 'checkbox', 'file'].includes(field.type) ? 'md:col-span-2' : ''}`}
              >
                <FieldLabel field={field} />

                {field.type === 'select' ? (
                  <select
                    required={field.required}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    className={`${inputClass} cursor-pointer appearance-none`}
                  >
                    <option value="">Select an option…</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'radio' ? (
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map(opt => (
                      <label key={opt} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-bg-dynamic text-sm text-text-primary-dynamic cursor-pointer hover:border-headline/40 transition-colors">
                        <input
                          type="radio"
                          name={field.label}
                          value={opt}
                          required={field.required}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                          className="accent-headline"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : field.type === 'checkbox' ? (
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map(opt => (
                      <label key={opt} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-bg-dynamic text-sm text-text-primary-dynamic cursor-pointer hover:border-headline/40 transition-colors">
                        <input
                          type="checkbox"
                          name={`${field.label}-${opt}`}
                          value={opt}
                          onChange={(e) => {
                            const cur = Array.isArray(formData[field.label]) ? formData[field.label] : []
                            handleChange(field.label, e.target.checked ? [...cur, opt] : cur.filter(x => x !== opt))
                          }}
                          className="accent-headline"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    rows={5}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    placeholder={field.placeholder || `Tell us about ${field.label.toLowerCase()}…`}
                    className={`${inputClass} resize-none`}
                  />
                ) : field.type === 'phone' ? (
                  <PhoneInput
                    international
                    defaultCountry="NP"
                    flags={flags}
                    value={formData[field.label]}
                    onChange={(val) => handleChange(field.label, val || '')}
                    className="bg-bg-dynamic border border-border rounded-xl px-5 py-3 text-sm text-text-primary-dynamic focus-within:border-headline transition-colors"
                  />
                ) : field.type === 'link' ? (
                  <input
                    type="url"
                    required={field.required}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    placeholder={field.placeholder || 'https://…'}
                    className={inputClass}
                  />
                ) : field.type === 'file' ? (
                  <div className="relative bg-bg-dynamic border border-dashed border-border rounded-xl p-6 text-center hover:border-headline/40 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required={field.required && !formData[field.label]}
                      onChange={async (e) => {
                        const uploaded = e.target.files[0]
                        if (!uploaded) return
                        setSubmitting(true)
                        try {
                          const fd = new FormData()
                          fd.append('file', uploaded)
                          fd.append('folder', 'intake-cvs')
                          const res = await fetch('/api/upload', { method: 'POST', body: fd })
                          const resData = await res.json()
                          if (resData.url) handleChange(field.label, resData.url)
                          else throw new Error('Upload failed')
                        } catch {
                          alert('Failed to upload file. Please try again.')
                        } finally {
                          setSubmitting(false)
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <div className="h-10 w-10 mx-auto grid place-items-center rounded-full border border-border text-text-primary-dynamic">
                        {formData[field.label] ? <FileText size={16} /> : <Upload size={16} />}
                      </div>
                      <p className="text-sm font-medium text-text-primary-dynamic">
                        {formData[field.label] ? 'Document attached' : 'Click or drag to upload'}
                      </p>
                      <p className="text-[10px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic">PDF, DOC, DOCX · up to 5MB</p>
                      {formData[field.label] && <p className="text-[10px] text-text-secondary-dynamic break-all px-4 italic">{formData[field.label]}</p>}
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.type === 'email' ? 'email' : 'text'}
                    required={field.required}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    placeholder={field.placeholder || `Your ${field.label.toLowerCase()}…`}
                    className={inputClass}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-lotus-pink/30 bg-lotus-pink/5 px-4 py-3 text-sm text-lotus-pink flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="pt-6 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-text-tertiary-dynamic">
              <Target size={14} className="shrink-0" />
              <p className="text-[10px] font-institutional uppercase tracking-[0.24em]">
                Batch <span className="text-headline">{definition.batch_name || 'General'}</span> · Reply within 7–10 days
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-headline text-bg text-xs font-institutional uppercase tracking-[0.24em] hover:bg-headline/90 transition-colors disabled:opacity-60"
            >
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting</> : <><Send size={14} /> Submit application</>}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
