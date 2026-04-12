'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Loader2, AlertCircle, Bell, Image as ImageIcon, CheckCircle2, X, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

export default function NoticeForm({ initialData = null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const isEditing = !!initialData

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    image_url: '',
    cta_text: '',
    cta_url: '',
    is_active: true,
    starts_at: '',
    ends_at: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        body: initialData.body || '',
        image_url: initialData.image_url || '',
        cta_text: initialData.cta_text || '',
        cta_url: initialData.cta_url || '',
        is_active: initialData.is_active ?? true,
        starts_at: initialData.starts_at ? initialData.starts_at.split('T')[0] : '',
        ends_at: initialData.ends_at ? initialData.ends_at.split('T')[0] : ''
      })
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const url = isEditing ? `/api/notices/${initialData.id}` : '/api/notices'
    const method = isEditing ? 'PATCH' : 'POST'
    
    const cleanData = {
      ...formData,
      starts_at: formData.starts_at || null,
      ends_at: formData.ends_at || null
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      })
      
      if (res.ok) {
        router.push('/admin/notices')
        router.refresh()
      } else {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save notice')
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
            href="/admin/notices" 
            className="p-2 rounded-xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all text-text-tertiary hover:text-primary"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit Notice: ${formData.title}` : 'Post New Notice'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Notice Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Join the JMOC 2026!"
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-lg font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary/10"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">Notice Content</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="What should the announcement say?"
                  className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-4 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none"
                  value={formData.body}
                  onChange={(e) => setFormData({...formData, body: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">CTA Button Text</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Register Now"
                      className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-10 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10"
                      value={formData.cta_text}
                      onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                    />
                    <CheckCircle2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-primary lowercase tracking-wider opacity-60">CTA destination URL</label>
                  <div className="relative">
                    <input 
                      type="url" 
                      placeholder="https://..."
                      className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-10 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10"
                      value={formData.cta_url}
                      onChange={(e) => setFormData({...formData, cta_url: e.target.value})}
                    />
                    <LinkIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Display Visibility</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 opacity-60">Publish from</label>
                  <input 
                    type="date" 
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 opacity-60">Expire on</label>
                  <input 
                    type="date" 
                    className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-2xl py-3 px-4 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({...formData, ends_at: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Asset Sidebar */}
          <div className="space-y-8">
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Cover Asset</h3>
              <div className="aspect-video relative rounded-2xl overflow-hidden border-2 border-primary/10 bg-primary/5 flex items-center justify-center group mb-4">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon size={48} className="text-primary/10" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-text-tertiary">No Image Selected</span>
                  </div>
                )}
              </div>
              <ImageUploader 
                onUpload={(url) => setFormData({...formData, image_url: url})} 
                folder="min-website/notices"
                label={formData.image_url ? 'Change Image' : 'Select Hero Image'}
              />
            </div>

            <div className="glass rounded-[2rem] p-8 space-y-6">
              <h3 className="text-lg font-bold tracking-tight">Publishing</h3>
              <div className="flex items-center justify-between p-4 bg-bg-secondary dark:bg-white/5 rounded-2xl border border-border">
                <span className="text-sm font-bold">Active Immediately</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-text-tertiary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <p className="text-[10px] text-text-tertiary text-center leading-relaxed">
                Only one notice can be active at a time. Activating this will disable any other currently active announcements.
              </p>
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
                {isEditing ? 'Save Changes' : 'Post Announcement'}
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="w-full py-4 rounded-2xl font-bold text-sm text-text-tertiary hover:bg-bg-secondary dark:hover:bg-white/5 transition-all text-center"
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
