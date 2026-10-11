'use client'
import { useState } from 'react'
import { m } from 'framer-motion'
import { PaperPlaneTilt as Send, CheckCircle as CheckCircle2, CircleNotch as Loader2, Envelope as Mail, ChatTeardropText as MessageSquare } from '@phosphor-icons/react'

const inputClass = 'input-brand'
const labelClass = 'label-brand'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to send message. Please try again later.')
      }
    } catch (err) {
      console.error('Contact submit error', err)
      alert('A network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-brand rounded-[2.5rem] p-12 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-black">Message Sent!</h3>
        <p className="text-auto-secondary font-medium">We'll get back to you as soon as possible.</p>
      </m.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-brand rounded-[2.5rem] p-6 sm:p-8 md:p-12 space-y-6">
      <div className="flex items-center gap-5 mb-8 pb-6 border-b border-primary/10 dark:border-white/10">
        <div className="w-14 h-14 shrink-0 bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary rounded-2xl flex items-center justify-center">
          <MessageSquare size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight">Send a Message</h3>
          <p className="text-sm font-medium text-auto-tertiary">General inquiries & feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelClass}>Name <span className="text-coral">*</span></label>
          <input 
            suppressHydrationWarning
            required
            type="text" 
            placeholder="Your Name"
            className={inputClass}
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Email <span className="text-coral">*</span></label>
          <input 
            suppressHydrationWarning
            required
            type="email" 
            placeholder="name@example.com"
            className={inputClass}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Subject <span className="text-coral">*</span></label>
        <input 
          suppressHydrationWarning
          required
          type="text" 
          placeholder="What is this about?"
          className={inputClass}
          value={formData.subject}
          onChange={e => setFormData({...formData, subject: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Message <span className="text-coral">*</span></label>
        <textarea 
          suppressHydrationWarning
          required
          rows={5}
          placeholder="Tell us more about your ideas or questions..."
          className={`${inputClass} resize-none`}
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
        />
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="btn-brand w-full py-5 text-lg"
      >
        {loading ? <Loader2 className="animate-spin" size={22} /> : <Send size={22} weight="bold" />}
        <span>{loading ? 'Sending...' : 'Send Message'}</span>
      </button>
    </form>
  )
}
