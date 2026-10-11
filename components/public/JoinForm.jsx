'use client'
import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { 
  PaperPlaneTilt as Send, 
  Heart, 
  CheckCircle as CheckCircle2, 
  Buildings as Building2, 
  Handshake, 
  CaretLeft as ChevronLeft, 
  CircleNotch as Loader2, 
  Wrench,
  Plus,
  WarningCircle as AlertCircle
} from '@phosphor-icons/react'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import { captureEvent } from '@/lib/analytics'

const defaultSchemas = {
  VOLUNTEER: {
    fields: [
      { id: 'motivation', label: 'Why do you want to join MIN?', type: 'textarea', required: true },
      { id: 'experience', label: 'Previous Mathematics/Teaching Experience', type: 'textarea', required: true },
      { id: 'cv', label: 'Upload your CV (PDF only)', type: 'file', required: true },
      { id: 'skills', label: 'Specific Skills (e.g., Olympiad Math, Coding)', type: 'text', required: false },
    ]
  },
  ORGANIZATION: {
    fields: [
      { id: 'orgName', label: 'Official Name of Institution', type: 'text', required: true },
      { id: 'orgWebsite', label: 'Website / Social Media Link', type: 'text', required: false },
      { id: 'collaborationGoal', label: 'What is your primary goal for this collaboration?', type: 'textarea', required: true },
    ]
  },
  PARTNERSHIP: {
    fields: [
      { id: 'entityName', label: 'Partner Entity Name', type: 'text', required: true },
      { id: 'missionAlignment', label: 'How does your mission align with MIN?', type: 'textarea', required: true },
      { id: 'proposal', label: 'Specific Proposal or Project Idea', type: 'textarea', required: true },
    ]
  }
}

const inputClass = 'input-brand'
const labelClass = 'label-brand'

const categories = [
  { 
    id: 'VOLUNTEER', 
    label: 'Volunteer', 
    icon: <Heart size={32} />, 
    desc: 'Support events, teach sessions, or help with outreach.',
    iconTint: 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary'
  },
  { 
    id: 'ORGANIZATION', 
    label: 'Organization', 
    icon: <Building2 size={32} />, 
    desc: 'Schools or institutions looking for educational collaboration.',
    iconTint: 'bg-secondary/40 text-primary-dark dark:bg-secondary/15 dark:text-secondary'
  },
  { 
    id: 'PARTNERSHIP', 
    label: 'Partnership', 
    icon: <Handshake size={32} />, 
    desc: 'Corporate sponsors or NGOs looking to scale impact.',
    iconTint: 'bg-coral/10 text-coral'
  },
]

export default function JoinForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [type, setType] = useState('VOLUNTEER')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [formQuestions, setFormQuestions] = useState({})
  const [schemas, setSchemas] = useState(defaultSchemas)
  const [uploadingFile, setUploadingFile] = useState(null) // track id of field being uploaded

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('min_form_schemas')
      if (saved) {
        try {
          setSchemas(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse saved schemas", e)
        }
      }
    }
  }, [step])

  const handleCategorySelect = (id) => {
    setType(id)
    setStep(2)
    setFormQuestions({})
  }

  const handleFileUpload = async (fieldId, file) => {
    if (!file) return
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.')
      return
    }

    setUploadingFile(fieldId)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', type)

    try {
      const res = await fetch('/api/applications/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) {
        setFormQuestions(prev => ({ ...prev, [fieldId]: data.url }))
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err) {
      alert('Upload failed due to a network error.')
    } finally {
      setUploadingFile(null)
    }
  }

  const handleFormChange = (key, val) => {
    setFormQuestions(prev => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      alert('Please enter a valid phone number.')
      return
    }

    setLoading(true)

    const payload = {
      ...formData,
      type,
      form_data: formQuestions
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        captureEvent('join_application_submitted', { type })
        setSubmitted(true)
        return
      }

      const data = await res.json()
      alert(data.error || 'Failed to submit application')
    } catch (error) {
      console.error('Submission Error:', error)
      alert('A network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field) => {
    if (field.type === 'file') {
      const isUploaded = !!formQuestions[field.id || field.label]
      return (
        <div key={field.id} className="space-y-4">
          <label className={labelClass}>
            {field.label} {field.required && <span className="text-coral">*</span>}
          </label>
          <div className={`relative group transition-all duration-300 ${
            isUploaded ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/60 dark:bg-white/5 border-primary/20 hover:border-primary/40 dark:border-white/15 dark:hover:border-secondary/50'
          } border-2 border-dashed rounded-[2rem] p-8 text-center`}>
            {uploadingFile === field.id ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="animate-spin text-primary dark:text-secondary" size={32} />
                <span className="text-xs font-bold text-primary dark:text-secondary animate-pulse">Uploading PDF...</span>
              </div>
            ) : isUploaded ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">CV Uploaded Successfully</p>
                  <p className="text-xs font-medium text-auto-tertiary">File is ready for review</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleFormChange(field.id || field.label, null)}
                  className="text-xs font-bold text-coral hover:underline mt-2"
                >
                  Remove & Replace
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Select PDF Document</p>
                  <p className="text-xs text-auto-tertiary font-medium">Click or drag & drop (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  accept=".pdf,application/pdf"
                  onChange={(e) => handleFileUpload(field.id || field.label, e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={field.required && !isUploaded}
                />
              </div>
            )}
          </div>
        </div>
      )
    }

    const commonProps = {
      required: field.required,
      onChange: (e) => handleFormChange(field.label, e.target.value),
      className: inputClass,
    }

    return (
      <div key={field.id} className="space-y-2">
        <label className={labelClass}>
          {field.label} {field.required && <span className="text-coral">*</span>}
        </label>
        {field.type === 'textarea' ? (
          <textarea {...commonProps} rows={3} className={commonProps.className + " resize-none"} />
        ) : (
          <input {...commonProps} type={field.type} />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Visual Stepper */}
      {!submitted && (
        <div className="flex items-center justify-center gap-4 mb-12 mt-4">
          {[1, 2].map(num => (
            <div key={num} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                step >= num 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 dark:bg-secondary dark:text-primary-dark' 
                  : 'bg-primary/5 dark:bg-white/5 text-auto-tertiary border border-primary/15 dark:border-white/15'
              }`}>
                {num}
              </div>
              {num === 1 && (
                <div className={`w-12 sm:w-20 h-1 rounded-full transition-all ${step > 1 ? 'bg-primary dark:bg-secondary' : 'bg-primary/10 dark:bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {submitted ? (
          <m.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-brand rounded-[2.5rem] px-6 py-14 sm:p-20 text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/20 dark:to-secondary/5 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-gradient-brand pb-1">Submission Successful!</h2>
              <p className="text-lg md:text-xl font-medium text-auto-secondary max-w-xl mx-auto leading-relaxed">
                Thank you for reaching out to MIN Nepal. We've received your {type.toLowerCase()} application and sent a confirmation to <span className="text-primary dark:text-secondary font-bold break-all">{formData.email}</span>.
              </p>
            </div>

            <div className="pt-10 relative z-10">
              <button 
                onClick={() => {
                  setSubmitted(false)
                  setStep(1)
                  setFormData({ name: '', email: '', phone: '' })
                  setFormQuestions({})
                }}
                className="btn-brand-outline"
              >
                Submit another application
              </button>
            </div>
          </m.div>
        ) : step === 1 ? (
          <m.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="card-brand card-brand-hover rounded-[2.5rem] relative flex flex-col items-center text-center p-10 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20 dark:from-white/5 dark:to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${cat.iconTint}`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-3xl font-black mb-3 transition-colors group-hover:text-primary dark:group-hover:text-secondary">{cat.label}</h3>
                  <p className="text-sm font-medium leading-relaxed max-w-[220px] text-auto-secondary">
                    {cat.desc}
                  </p>
                </div>
              </button>
            ))}
          </m.div>
        ) : (
          <m.form 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="card-brand rounded-[2.5rem] p-6 sm:p-10 md:p-16 space-y-12 relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm font-bold text-auto-secondary hover:text-primary dark:hover:text-secondary transition-all group"
              >
                <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                Change Category
              </button>
              <div className="eyebrow">
                {type} Selection
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 relative z-10">
              <div className="space-y-8">
                <div className="border-l-4 border-primary dark:border-secondary pl-4 mb-10">
                  <h4 className="text-3xl font-black tracking-tight">Identity</h4>
                  <p className="text-sm font-medium text-auto-tertiary">How should we address you?</p>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Full Name <span className="text-coral">*</span></label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter your name"
                    className={inputClass}
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Email Address <span className="text-coral">*</span></label>
                  <input 
                    required 
                    type="email" 
                    placeholder="your@email.com"
                    className={inputClass}
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Phone Number</label>
                  <PhoneInput 
                    international
                    defaultCountry="NP"
                    flags={flags}
                    value={formData.phone}
                    onChange={val => setFormData({ ...formData, phone: val || '' })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="border-l-4 border-secondary-dark dark:border-secondary/50 pl-4 mb-10">
                  <h4 className="text-3xl font-black tracking-tight">Context</h4>
                  <p className="text-sm font-medium text-auto-tertiary">What brings you to MIN?</p>
                </div>
                <div className="space-y-6">
                  {schemas[type]?.fields.map(renderField)}
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-primary/10 dark:border-white/10 flex items-center justify-end relative z-10">
              <button 
                type="submit"
                disabled={loading}
                className="btn-brand group w-full sm:w-auto px-12 py-5 text-lg"
              >
                <div className="flex items-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} weight="bold" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  <span>{loading ? 'Sending...' : 'Complete Application'}</span>
                </div>
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  )
}
