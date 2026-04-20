'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Loader2, CheckCircle2, AlertCircle, 
  ArrowLeft, Sparkles, Heart, Globe, Target,
  Clock, Upload, FileText
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'

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
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={48} className="animate-spin text-primary" /></div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
           <AlertCircle size={64} className="mx-auto text-coral opacity-20" />
           <h2 className="text-3xl font-black">Something went wrong</h2>
           <p className="text-text-tertiary">{error}</p>
           <Link href="/join" className="inline-block text-primary font-bold hover:underline">Return to Paths</Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-black">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center space-y-8 p-12 glass rounded-[3rem] border border-primary/20 shadow-2xl"
        >
           <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/5">
              <CheckCircle2 size={48} />
           </div>
           <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight leading-tight">{definition?.is_active === false ? 'Added to Alert List' : 'Identity Recorded'}</h2>
              <p className="text-lg text-text-secondary font-medium px-4">
                {definition?.is_active === false 
                  ? `Thank you. We will automatically notify you the moment the ${definition?.category || 'next'} intake opens.` 
                  : `Thank you for applying. We've sent a confirmation to your email. Our team will review your application for the "${definition.batch_name || 'Current'}" batch soon.`}
              </p>
           </div>
           <Link href="/" className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
             Return Home
           </Link>
        </motion.div>
      </div>
    )
  }

  // Handle Dormant/Inactive form state
  if (definition?.is_active === false) {
    return (
      <div className="min-h-screen pt-32 pb-40 px-6 relative overflow-hidden flex items-center justify-center">
         <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-coral/5 blur-[120px] rounded-full -z-10" />
         
         <div className="max-w-2xl w-full text-center space-y-10">
            <Link href="/join" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-tertiary hover:text-primary transition-all group mb-4">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to choices
            </Link>

            <div className="space-y-6 glass p-10 md:p-14 rounded-[3rem] border border-border shadow-2xl">
               <div className="w-24 h-24 bg-coral/10 text-coral rounded-full flex items-center justify-center mx-auto shadow-xl shadow-coral/5">
                  <Clock size={48} />
               </div>
               <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight">Intake Closed</h1>
                  <p className="text-lg text-text-secondary font-medium leading-relaxed max-w-lg mx-auto">
                    The intake for <span className="text-coral font-black">{definition.title}</span> is currently closed. We are evaluating the previous batch.
                  </p>
               </div>

               <div className="pt-8 mt-8 border-t border-border">
                  <h4 className="text-sm font-black uppercase tracking-widest text-text-tertiary mb-6">Get Notified When It Opens</h4>
                  <form onSubmit={handleReminderSubmit} className="flex flex-col sm:flex-row gap-4 relative">
                     <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="Enter your email address..."
                      className="flex-1 bg-white dark:bg-white/5 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary outline-none transition-all"
                     />
                     <button
                        type="submit"
                        disabled={submitting}
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Alert Me</>}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-40 px-6 relative overflow-hidden">
       {/* Ambient Backdrops */}
       <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
       <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-secondary/10 blur-[120px] rounded-full -z-10" />

       <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <header className="space-y-6">
             <Link href="/join" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-tertiary hover:text-primary transition-all group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to choices
             </Link>
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                   <Sparkles size={12}/> Admission Program
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{definition.title}</h1>
                <p className="text-xl text-text-secondary font-medium max-w-2xl leading-relaxed">{definition.description}</p>
             </div>
          </header>

          {/* Form Engine */}
          <form onSubmit={handleSubmit} className="glass p-8 md:p-12 rounded-[3rem] border border-border shadow-2xl space-y-10 relative overflow-hidden bg-white/40 dark:bg-white/5 backdrop-blur-2xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {definition.fields.map((field, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`space-y-3 ${['textarea', 'radio', 'checkbox'].includes(field.type) ? 'md:col-span-2' : ''}`}
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1 flex items-center gap-2">
                       {field.label} {field.required && <span className="text-coral flex items-center gap-0.5"><Heart size={8} fill="currentColor"/> Required</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                       <select 
                        required={field.required}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all cursor-pointer appearance-none"
                      >
                         <option value="">Select an option...</option>
                         {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'radio' ? (
                       <div className="flex flex-wrap gap-4">
                          {field.options?.map(opt => (
                            <label key={opt} className="flex items-center gap-3 bg-white dark:bg-white/5 border border-border rounded-xl px-5 py-3 cursor-pointer group hover:border-primary/50 transition-colors">
                              <input 
                                type="radio" 
                                name={field.label}
                                value={opt}
                                required={field.required}
                                onChange={(e) => handleChange(field.label, e.target.value)}
                                className="w-4 h-4 text-primary focus:ring-primary"
                              />
                              <span className="text-sm font-bold">{opt}</span>
                            </label>
                          ))}
                       </div>
                    ) : field.type === 'checkbox' ? (
                       <div className="flex flex-wrap gap-4">
                          {field.options?.map(opt => (
                            <label key={opt} className="flex items-center gap-3 bg-white dark:bg-white/5 border border-border rounded-xl px-5 py-3 cursor-pointer group hover:border-primary/50 transition-colors">
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
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
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
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
                        placeholder={`Tell us about ${field.label.toLowerCase()}...`}
                      />
                     ) : field.type === 'phone' ? (
                       <PhoneInput 
                         international
                         defaultCountry="NP"
                         flags={flags}
                         value={formData[field.label]}
                         onChange={(val) => handleChange(field.label, val || '')}
                         className="w-full bg-white dark:bg-white/10 border border-border rounded-2xl px-6 py-4 text-sm font-bold focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 outline-none transition-all"
                       />
                    ) : field.type === 'link' ? (
                      <input 
                        type="url"
                        required={field.required}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                        placeholder="https://..."
                      />
                    ) : field.type === 'file' ? (
                       <div className="relative group bg-white dark:bg-white/10 border border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors">
                          <input 
                            type="file"
                            accept=".pdf,.doc,.docx"
                            required={field.required && !formData[field.label]}
                            onChange={async (e) => {
                               const uploaded = e.target.files[0];
                               if (!uploaded) return;
                               setSubmitting(true);
                               try {
                                 const fd = new FormData();
                                 fd.append('file', uploaded);
                                 fd.append('folder', 'intake-cvs');
                                 const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                 const resData = await res.json();
                                 if (resData.url) {
                                    handleChange(field.label, resData.url);
                                 } else throw new Error("Upload failed");
                               } catch (err) {
                                 alert("Failed to upload file. Please try again.");
                               } finally {
                                 setSubmitting(false);
                               }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-3 pointer-events-none">
                             <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto">
                               {formData[field.label] ? <FileText size={20} /> : <Upload size={20} />}
                             </div>
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-dynamic">
                                  {formData[field.label] ? "Document Attached Successfully" : "Click or drag file to upload"}
                                </p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-text-tertiary">PDF, DOC, DOCX up to 5MB</p>
                             </div>
                             {formData[field.label] && <p className="text-[10px] text-primary italic break-all px-4">{formData[field.label]}</p>}
                          </div>
                       </div>
                    ) : (
                      <input 
                        type={field.type === 'email' ? 'email' : 'text'}
                        required={field.required}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                        placeholder={`Your ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </motion.div>
                ))}
             </div>

             <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-text-tertiary">
                   <Target size={20} className="shrink-0" />
                   <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                      Assigned Batch: <span className="text-primary font-black">{definition.batch_name || 'GENERAL'}</span> <br />
                      Response time: 7-10 Business Days
                   </p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Verifying Submission</>
                  ) : (
                    <><Send size={18} /> Submit Application</>
                  )}
                </button>
             </div>
          </form>
       </div>
    </div>
  )
}
