'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, Loader2, Mail, MessageSquare } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          type: 'INQUIRY',
          form_data: {
            subject: formData.subject,
            message: formData.message
          }
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[3rem] p-12 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-black">Message Sent!</h3>
        <p className="text-text-secondary font-medium">We'll get back to you as soon as possible.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[3rem] p-8 md:p-12 space-y-8 shadow-2xl">
      <div className="flex items-center gap-5 mb-10 pb-6 border-b border-border dark:border-white/5">
        <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
          <MessageSquare size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight">Send a Message</h3>
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none">General inquiries & feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-2">Name <span className="text-coral">*</span></label>
          <input 
            suppressHydrationWarning
            required
            type="text" 
            placeholder="Your Name"
            className="w-full glass bg-white/10 dark:bg-white/5 px-8 py-5 rounded-2xl focus:ring-2 ring-primary/20 outline-none transition-all border border-border hover:border-primary/20 font-medium"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-2">Email <span className="text-coral">*</span></label>
          <input 
            suppressHydrationWarning
            required
            type="email" 
            placeholder="name@example.com"
            className="w-full glass bg-white/10 dark:bg-white/5 px-8 py-5 rounded-2xl focus:ring-2 ring-primary/20 outline-none transition-all border border-border hover:border-primary/20 font-medium"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-2">Subject <span className="text-coral">*</span></label>
        <input 
          suppressHydrationWarning
          required
          type="text" 
          placeholder="What is this about?"
          className="w-full glass bg-white/10 dark:bg-white/5 px-8 py-5 rounded-2xl focus:ring-2 ring-primary/20 outline-none transition-all border border-border hover:border-primary/20 font-medium"
          value={formData.subject}
          onChange={e => setFormData({...formData, subject: e.target.value})}
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-2">Message <span className="text-coral">*</span></label>
        <textarea 
          suppressHydrationWarning
          required
          rows={5}
          placeholder="Tell us more about your ideas or questions..."
          className="w-full glass bg-white/10 dark:bg-white/5 px-8 py-5 rounded-2xl focus:ring-2 ring-primary/20 outline-none transition-all resize-none border border-border hover:border-primary/20 font-medium"
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
        />
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
        <span>{loading ? 'Sending...' : 'Send Message'}</span>
      </button>
    </form>
  )
}
