// components/admin/CertificateForm.jsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FloppyDisk as Save, ArrowLeft, CircleNotch as Loader2, WarningCircle as AlertCircle, Trophy, FileText, CheckCircle as CheckCircle2 } from '@phosphor-icons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

export default function CertificateForm({ initialData = null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const isEditing = !!initialData

  const [events, setEvents] = useState([])
  const [isCustomEvent, setIsCustomEvent] = useState(false)

  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_email: '',
    program_name: 'MIN Program',
    event_id: '',
    event_name: '',
    issued_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    pdf_url: '',
    is_valid: true,
    is_visible: true
  })

  // Load events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events')
        if (res.ok) {
          const data = await res.json()
          setEvents(data || [])
        }
      } catch (err) {
        console.error('Failed to load events in CertificateForm:', err)
      }
    }
    loadEvents()
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipient_name: initialData.recipient_name || '',
        recipient_email: initialData.recipient_email || '',
        program_name: initialData.program_name || 'MIN Program',
        event_id: initialData.event_id || '',
        event_name: initialData.event_name || '',
        issued_date: initialData.issued_date ? initialData.issued_date.split('T')[0] : new Date().toISOString().split('T')[0],
        expiry_date: initialData.expiry_date ? initialData.expiry_date.split('T')[0] : '',
        pdf_url: initialData.pdf_url || '',
        is_valid: initialData.is_valid ?? true,
        is_visible: initialData.is_visible ?? true
      })
      if (!initialData.event_id && initialData.event_name) {
        setIsCustomEvent(true)
      }
    }
  }, [initialData])

  const handleEventChange = (e) => {
    const val = e.target.value
    if (val === 'custom') {
      setIsCustomEvent(true)
      setFormData(prev => ({ ...prev, event_id: '', event_name: '' }))
    } else {
      setIsCustomEvent(false)
      const selected = events.find(event => event.id === val)
      setFormData(prev => ({ 
        ...prev, 
        event_id: val, 
        event_name: selected ? selected.title : '' 
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.recipient_name) {
      setError('Recipient Name is required')
      setLoading(false)
      return
    }

    if (!formData.pdf_url) {
      setError('Please upload a certificate file (Image or PDF)')
      setLoading(false)
      return
    }

    const url = isEditing ? `/api/admin/certificates/${initialData.id}` : '/api/admin/certificates'
    const method = isEditing ? 'PATCH' : 'POST'

    const cleanData = {
      ...formData,
      event_id: formData.event_id || null,
      event_name: formData.event_name || null,
      expiry_date: formData.expiry_date || null
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      })

      if (res.ok) {
        router.push('/admin/certificates')
        router.refresh()
      } else {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save certificate')
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/certificates" 
            className="p-2 rounded-xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all text-auto-tertiary hover:text-primary-dark dark:duration-75"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit Certificate for ${formData.recipient_name}` : 'Issue New Certificate'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Recipient Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Recipient Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Ram Bahadur"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 font-medium"
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({...formData, recipient_name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Recipient Email (Optional)</label>
                  <input 
                    type="email" 
                    placeholder="e.g. ram@example.com"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 font-medium"
                    value={formData.recipient_email}
                    onChange={(e) => setFormData({...formData, recipient_email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Program Name</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. MIN Volunteer, JMOC 2026"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 font-medium"
                    value={formData.program_name}
                    onChange={(e) => setFormData({...formData, program_name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Associated Event</label>
                  <select 
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent cursor-pointer font-medium"
                    value={isCustomEvent ? 'custom' : formData.event_id}
                    onChange={handleEventChange}
                  >
                    <option value="">-- Select Event (Optional) --</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                    <option value="custom">Custom Event Name...</option>
                  </select>
                </div>
              </div>

              {isCustomEvent && (
                <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Custom Event Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Pi Day Symposium 2026"
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 font-medium"
                    value={formData.event_name}
                    onChange={(e) => setFormData({...formData, event_name: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Timeline & Expiry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 opacity-60">Issue Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 font-medium"
                    value={formData.issued_date}
                    onChange={(e) => setFormData({...formData, issued_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 opacity-60">Expiry Date (Optional)</label>
                  <input 
                    type="date" 
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 font-medium"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Certificate Document</h3>
              <div className="aspect-video relative rounded-2xl overflow-hidden border-2 border-primary/10 bg-primary/5 flex flex-col items-center justify-center group mb-4">
                {formData.pdf_url ? (
                  formData.pdf_url.endsWith('.pdf') ? (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <FileText size={48} className="text-primary" />
                      <span className="text-xs font-semibold truncate max-w-full">PDF Document Uploaded</span>
                      <a href={formData.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline font-bold mt-1">View File</a>
                    </div>
                  ) : (
                    <img src={formData.pdf_url} alt="Preview" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Trophy size={48} className="text-primary/10" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-auto-tertiary">No File Uploaded</span>
                  </div>
                )}
              </div>
              <ImageUploader 
                onUpload={(url) => setFormData({...formData, pdf_url: url})} 
                folder="min-website/certificates"
                accept="image/*,application/pdf"
                label={formData.pdf_url ? 'Change Document' : 'Upload Image / PDF'}
              />
            </div>

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Status & Settings</h3>
              
              <div className="flex items-center justify-between p-4 bg-bg-secondary dark:bg-white/5 rounded-2xl border border-border">
                <span className="text-sm font-bold">Valid & Active</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.is_valid}
                    onChange={(e) => setFormData({...formData, is_valid: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-text-tertiary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-bg-secondary dark:bg-white/5 rounded-2xl border border-border">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Visible (Publish)</span>
                  <span className="text-[9px] text-auto-tertiary">Triggers emailing if visible</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({...formData, is_visible: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-text-tertiary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-coral/10 border border-coral/20 flex items-center gap-3 text-coral text-sm">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {isEditing ? 'Save Changes' : 'Issue Certificate'}
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="w-full py-4 rounded-2xl font-bold text-sm text-auto-tertiary hover:bg-bg-secondary dark:hover:bg-white/5 transition-all text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
