'use client'
import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { 
  PaperPlaneTilt as Send, CircleNotch as Loader2, CheckCircle as CheckCircle2, WarningCircle as AlertCircle, 
  ArrowLeft, RocketLaunch as Sparkles, Heart, Globe, Target,
  Clock, UploadSimple as Upload, FileText
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import PageHero from '@/components/public/PageHero'

const inputClass = 'input-brand text-sm font-semibold'
const choiceClass = 'flex items-center gap-3 rounded-xl border border-primary/15 bg-white/60 px-5 py-3 cursor-pointer group transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:border-white/15 dark:bg-white/5 dark:hover:border-secondary/50 dark:has-[:checked]:border-secondary dark:has-[:checked]:bg-secondary/10'
const labelClass = 'label-brand flex flex-wrap items-center gap-2'

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
        
        // Initialize form data only if basic fields exist
        if (data.fields) {
           const initial = {}
           data.fields.forEach(f => initial[f.label] = '')
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

  const handleChange = (label, value) => {
    setFormData(prev => ({ ...prev, [label]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (definition?.fields) {
      for (const field of definition.fields) {
        const val = formData[field.label]
        
        // Required check (redundant but good for custom UI)
        if (field.required && (!val || (Array.isArray(val) && val.length === 0))) {
          setError(`Please fill out the required field: ${field.label}`)
          setSubmitting(false)
          return
        }

        // Phone validation
        if (field.type === 'phone' && val) {
          if (!isValidPhoneNumber(val)) {
            setError(`Invalid phone number format for ${field.label}. Please include country code (e.g. +977).`)
            setSubmitting(false)
            return
          }
        }

        // URL validation for links
        if (field.type === 'link' && val) {
          try {
            new URL(val)
          } catch (e) {
            setError(`Please enter a valid URL (starting with http:// or https://) for ${field.label}.`)
            setSubmitting(false)
            return
          }
        }
      }
    }

    try {
      const res = await fetch(`/api/forms/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          form_id: definition.id, 
          data: formData 
        })
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
      const res = await fetch(`/api/forms/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          category: definition.category 
        })
      })
      
      if (!res.ok) throw new Error('Failed to join waitlist')
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={48} className="animate-spin text-primary dark:text-secondary" /></div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card-brand rounded-[2.5rem] max-w-lg w-full p-10 md:p-12 text-center space-y-4">
           <AlertCircle size={64} className="mx-auto text-rose-500 opacity-60" />
           <h2 className="text-3xl font-black">Something went wrong</h2>
           <p className="text-auto-tertiary">{error}</p>
           <Link href="/join" className="btn-brand-outline mt-2">Return to Paths</Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-32 pb-24">
        <m.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-brand rounded-[2.5rem] max-w-xl w-full text-center space-y-8 p-8 sm:p-12"
        >
           <div className="w-24 h-24 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight leading-tight text-gradient-brand pb-1">{definition?.is_active === false ? 'Added to Alert List' : 'Identity Recorded'}</h2>
              <p className="text-lg text-auto-secondary font-medium px-4">
                {definition?.is_active === false 
                  ? `Thank you. We will automatically notify you the moment the ${definition?.category || 'next'} intake opens.` 
                  : `Thank you for applying. We've sent a confirmation to your email. Our team will review your application for the "${definition.batch_name || 'Current'}" batch soon.`}
              </p>
           </div>
           <Link href="/" className="btn-brand">
             Return Home
           </Link>
        </m.div>
      </div>
    )
  }

  // Handle Dormant/Inactive form state
  if (definition?.is_active === false) {
    return (
      <div className="min-h-screen pt-36 md:pt-40 pb-32 px-6 relative isolate overflow-hidden flex items-center justify-center">
         <div aria-hidden className="absolute inset-0 -z-10 hero-glow pointer-events-none" />
         <div aria-hidden className="absolute inset-0 -z-10 bg-graph pointer-events-none" />
         
         <div className="max-w-2xl w-full text-center space-y-10">
            <Link href="/join" className="inline-flex items-center gap-2 text-sm font-bold text-auto-secondary hover:text-primary dark:hover:text-secondary transition-all group mb-4">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to choices
            </Link>

            <div className="card-brand rounded-[2.5rem] space-y-6 p-6 sm:p-10 md:p-14">
               <div className="w-24 h-24 bg-amber-500/10 text-amber-600 dark:text-amber-300 rounded-full flex items-center justify-center mx-auto">
                  <Clock size={48} />
               </div>
               <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient-brand pb-1">Intake Closed</h1>
                  <p className="text-lg text-auto-secondary font-medium leading-relaxed max-w-lg mx-auto">
                    The intake for <span className="text-primary dark:text-secondary font-black">{definition.title}</span> is currently closed. We are evaluating the previous batch.
                  </p>
               </div>

               <div className="pt-8 mt-8 border-t border-primary/10 dark:border-white/10">
                  <h4 className="text-sm font-bold tracking-wide text-auto-secondary mb-6">Get Notified When It Opens</h4>
                  <form onSubmit={handleReminderSubmit} className="flex flex-col sm:flex-row gap-4 relative">
                     <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="Enter your email address..."
                      className={`${inputClass} flex-1 min-w-0`}
                     />
                     <button
                        type="submit"
                        disabled={submitting}
                        className="btn-brand px-8"
                      >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} weight="bold" /> Alert Me</>}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden">
       <PageHero
         eyebrow="Admission Program"
         icon={<Sparkles size={14} weight="fill" />}
         title={definition.title}
         description={definition.description}
       >
         <Link href="/join" className="btn-brand-outline group px-6 py-3 text-sm">
            <ArrowLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" /> Back to choices
         </Link>
       </PageHero>

       <div className="max-w-4xl mx-auto px-6 space-y-12">
          {/* Form Engine */}
          <form onSubmit={handleSubmit} className="card-brand rounded-[2.5rem] p-6 sm:p-8 md:p-12 space-y-10 relative overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {definition.fields.map((field, i) => (
                  <m.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`space-y-2 ${['textarea', 'radio', 'checkbox'].includes(field.type) ? 'md:col-span-2' : ''}`}
                  >
                    <label className={labelClass}>
                       {field.label} {field.required && <span className="text-coral text-[11px] flex items-center gap-0.5"><Heart size={8} fill="currentColor"/> Required</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                       <select 
                        required={field.required}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className={`${inputClass} cursor-pointer appearance-none dark:[&>option]:bg-primary-dark`}
                      >
                         <option value="">Select an option...</option>
                         {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'radio' ? (
                       <div className="flex flex-wrap gap-4">
                          {field.options?.map(opt => (
                            <label key={opt} className={choiceClass}>
                              <input 
                                type="radio" 
                                name={field.label}
                                value={opt}
                                required={field.required}
                                onChange={(e) => handleChange(field.label, e.target.value)}
                                className="w-4 h-4 accent-primary dark:accent-secondary"
                              />
                              <span className="text-sm font-bold">{opt}</span>
                            </label>
                          ))}
                       </div>
                    ) : field.type === 'checkbox' ? (
                       <div className="flex flex-wrap gap-4">
                          {field.options?.map(opt => (
                            <label key={opt} className={choiceClass}>
                              <input 
                                type="checkbox" 
                                name={`${field.label}-${opt}`}
                                value={opt}
                                onChange={(e) => {
                                  // For checkboxes, we store an array of selected options
                                  const currentArr = Array.isArray(formData[field.label]) ? formData[field.label] : [];
                                  if(e.target.checked) {
                                    handleChange(field.label, [...currentArr, opt])
                                  } else {
                                    handleChange(field.label, currentArr.filter(i => i !== opt))
                                  }
                                }}
                                className="w-4 h-4 rounded accent-primary dark:accent-secondary"
                              />
                              <span className="text-sm font-bold">{opt}</span>
                            </label>
                          ))}
                       </div>
                    ) : field.type === 'textarea' ? (
                      <textarea 
                        required={field.required}
                        rows={5}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className={`${inputClass} resize-none`}
                        placeholder={field.placeholder || `Tell us about ${field.label.toLowerCase()}...`}
                      />
                     ) : field.type === 'phone' ? (
                       <PhoneInput 
                         international
                         defaultCountry="NP"
                         flags={flags}
                         value={formData[field.label]}
                         onChange={(val) => handleChange(field.label, val || '')}
                         className="w-full"
                       />
                    ) : field.type === 'link' ? (
                      <input 
                        type="url"
                        required={field.required}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className={inputClass}
                        placeholder={field.placeholder || "https://..."}
                      />
                    ) : field.type === 'file' ? (
                       <div className="relative group bg-white/60 dark:bg-white/5 border-2 border-dashed border-primary/20 dark:border-white/15 rounded-2xl p-6 text-center hover:border-primary/40 dark:hover:border-secondary/50 transition-colors">
                          <input 
                            type="file"
                            accept=".pdf"
                            required={field.required && !formData[field.label]}
                            onChange={async (e) => {
                               const uploaded = e.target.files[0];
                               if (!uploaded) return;
                               if (uploaded.type !== 'application/pdf') {
                                 setError('Please upload your CV/document as a PDF file.');
                                 return;
                               }
                               if (uploaded.size > 5 * 1024 * 1024) {
                                 setError('File is too large. Please upload a PDF under 5MB.');
                                 return;
                               }
                               setSubmitting(true);
                               setError(null);
                               try {
                                 const fd = new FormData();
                                 fd.append('file', uploaded);
                                 fd.append('category', definition.category || 'JOIN');
                                 const res = await fetch('/api/applications/upload', { method: 'POST', body: fd });
                                 const resData = await res.json();
                                 if (resData.url) {
                                    handleChange(field.label, resData.url);
                                 } else {
                                   throw new Error(resData.error || "Upload failed");
                                 }
                               } catch (err) {
                                 setError(`Failed to upload file: ${err.message}`);
                               } finally {
                                 setSubmitting(false);
                               }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-3 pointer-events-none">
                             <div className="w-12 h-12 bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary rounded-xl flex items-center justify-center mx-auto">
                               {formData[field.label] ? <FileText size={20} /> : <Upload size={20} />}
                             </div>
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-dynamic">
                                  {formData[field.label] ? "Document Attached Successfully" : "Click or drag file to upload"}
                                </p>
                                <p className="text-xs font-medium text-auto-tertiary">PDF format up to 5MB</p>
                             </div>
                             {formData[field.label] && (
                               <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 break-all px-4 bg-emerald-500/5 py-1.5 rounded-lg border border-emerald-500/20">
                                 ✓ Attached: {formData[field.label].split('/').pop()}
                                </p>
                             )}
                          </div>
                       </div>
                    ) : (
                      <input 
                        type={field.type === 'email' ? 'email' : 'text'}
                        required={field.required}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className={inputClass}
                        placeholder={field.placeholder || `Your ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </m.div>
                ))}
             </div>

             <div className="pt-8 border-t border-primary/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-auto-tertiary">
                   <Target size={20} className="shrink-0" />
                   <p className="text-xs font-semibold leading-relaxed">
                      Assigned Batch: <span className="text-primary dark:text-secondary font-black">{definition.batch_name || 'GENERAL'}</span> <br />
                      Response time: 7-10 Business Days
                   </p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-brand w-full md:w-auto px-12 py-5"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Verifying Submission</>
                  ) : (
                    <><Send size={18} weight="bold" /> Submit Application</>
                  )}
                </button>
             </div>
          </form>
       </div>
    </div>
  )
}
