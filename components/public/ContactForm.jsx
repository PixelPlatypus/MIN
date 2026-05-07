'use client'
import { useState } from 'react'
import { Send, CheckCircle2, Loader2, MessageSquare } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { const r = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.name, email: formData.email, type: 'INQUIRY', form_data: { subject: formData.subject, message: formData.message } }) }); if (r.ok) setSubmitted(true); else { const err = await r.json(); alert(err.error || 'Failed to send') } } catch { alert('Network error') } finally { setLoading(false) } }

  if (submitted) return (
    <div className="rounded-3xl border border-border p-12 text-center space-y-6 bg-surface">
      <div className="w-16 h-16 rounded-2xl bg-marigold/5 border border-marigold/10 flex items-center justify-center mx-auto"><CheckCircle2 size={28} className="text-marigold" /></div>
      <h3 className="text-2xl font-bold text-headline">Message Sent!</h3>
      <p className="text-text-secondary-dynamic">We&apos;ll get back to you as soon as possible.</p>
    </div>
  )

  const ic = "w-full bg-bg-secondary border border-border rounded-xl px-5 py-4 text-sm text-text-primary-dynamic placeholder:text-text-tertiary-dynamic focus:border-headline/50 outline-none transition-colors"

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border p-8 md:p-12 space-y-8 bg-surface">
      <div className="flex items-center gap-4 pb-6 border-b border-border">
        <div className="w-12 h-12 rounded-xl bg-marigold/5 border border-marigold/10 flex items-center justify-center"><MessageSquare size={22} className="text-marigold" /></div>
        <div><h3 className="text-xl font-bold text-headline">Send a Message</h3><p className="text-xs font-institutional tracking-[0.2em] text-text-tertiary-dynamic">General inquiries</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2"><label className="text-xs font-bold text-text-secondary-dynamic">Name</label><input required type="text" placeholder="Your Name" className={ic} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        <div className="space-y-2"><label className="text-xs font-bold text-text-secondary-dynamic">Email</label><input required type="email" placeholder="name@example.com" className={ic} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
      </div>
      <div className="space-y-2"><label className="text-xs font-bold text-text-secondary-dynamic">Subject</label><input required type="text" placeholder="What is this about?" className={ic} value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} /></div>
      <div className="space-y-2"><label className="text-xs font-bold text-text-secondary-dynamic">Message</label><textarea required rows={5} placeholder="Tell us more..." className={`${ic} resize-none`} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
      <button type="submit" disabled={loading} className="w-full bg-headline text-bg py-4 rounded-xl text-sm font-semibold tracking-wide hover:bg-accent hover:shadow-xl hover:shadow-accent/25 transition-all disabled:opacity-50 flex items-center justify-center gap-3">{loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}<span>{loading ? 'Sending...' : 'Send Message'}</span></button>
    </form>
  )
}
