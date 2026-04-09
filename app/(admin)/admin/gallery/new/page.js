'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Upload, 
  Plus,
  Image as ImageIcon, 
  X, 
  Save, 
  Loader2, 
  CheckCircle2,
  Tag,
  FolderOpen,
  Type
} from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'

export default function NewGalleryImagePage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [existingTags, setExistingTags] = useState([])
  const [formData, setFormData] = useState({
    caption: '',
    album: '',
    tags: '',
    image_url: ''
  })

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('/api/gallery')
        if (res.ok) {
          const data = await res.json()
          const tags = [...new Set(data.flatMap(img => img.tags || []))]
          setExistingTags(tags)
        }
      } catch (err) {
        console.error('Fetch tags error:', err)
      }
    }
    fetchTags()
  }, [])

  const addTag = (tag) => {
    const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
    if (!currentTags.includes(tag)) {
      setFormData({
        ...formData,
        tags: currentTags.length > 0 ? [...currentTags, tag].join(', ') : tag
      })
    }
  }

  const isFormValid = formData.caption && formData.image_url

  const handleImageUploaded = (url) => {
    setPreviewUrl(url)
    setFormData(prev => ({ ...prev, image_url: url }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return

    setUploading(true)
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/admin/gallery'), 1500)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save gallery entry')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('An error occurred while saving')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowLeft size={20} />
          </div>
          <span className="font-bold text-sm">Back to Gallery</span>
        </button>

        <div className="text-right">
          <h2 className="text-3xl font-black tracking-tight">Add to Gallery</h2>
          <p className="text-primary font-bold text-sm uppercase tracking-widest">Post a new memory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column: Preview & Upload */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass rounded-[3rem] overflow-hidden border border-border dark:border-border-dark aspect-video relative group">
            <AnimatePresence mode="wait">
              {previewUrl ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      onClick={() => { setPreviewUrl(null); setFormData(p => ({ ...p, image_url: '' })) }}
                      className="bg-coral text-white p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full bg-bg-secondary dark:bg-black/20 flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-6 animate-pulse">
                    <ImageIcon size={48} />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Select a Photo</h4>
                  <p className="text-sm text-text-tertiary max-w-xs mx-auto mb-8">
                    Choose a high-quality image from an event or program to add to the MIN collection.
                  </p>
                  
                  <ImageUploader 
                    onUpload={handleImageUploaded}
                    folder="min-website/gallery"
                    label="Choose File"
                    className="w-full max-w-xs"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass rounded-[2rem] p-6 border border-border dark:border-border-dark flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h5 className="font-bold text-sm mb-1">Upload Tip</h5>
              <p className="text-xs text-text-secondary leading-relaxed">
                Images are automatically optimized for delivery. We recommend using widescreen (16:9) or square (1:1) photos for the best gallery presentation.
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass rounded-[3rem] p-10 border border-border dark:border-border-dark space-y-8 sticky top-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-text-tertiary ml-1">
                  <Type size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Caption</label>
                </div>
                <input 
                  required
                  type="text" 
                  placeholder="Describe this moment..."
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-text-tertiary ml-1">
                  <FolderOpen size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Album / Collection</label>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. JMOC 2024, Bootcamp"
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={formData.album}
                  onChange={(e) => setFormData({...formData, album: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-text-tertiary ml-1">
                  <Tag size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Tags (Keywords)</label>
                </div>
                <input 
                  type="text" 
                  placeholder="learning, math, impact"
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
                
                {existingTags.length > 0 && (
                  <div className="space-y-2 px-2">
                    <p className="text-[9px] font-bold text-text-tertiary uppercase">Suggestions from existing photos:</p>
                    <div className="flex flex-wrap gap-2">
                      {existingTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="text-[10px] bg-primary/5 hover:bg-primary/20 text-primary px-3 py-1 rounded-full transition-all border border-primary/10"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-text-tertiary px-2 italic">Separate with commas</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border dark:border-border-dark space-y-4">
              <button 
                type="submit"
                disabled={!isFormValid || uploading || success}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl ${
                  success 
                    ? 'bg-green text-white' 
                    : 'bg-primary text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-primary/20'
                }`}
              >
                {uploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : success ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Plus size={20} />
                )}
                <span>{uploading ? 'Publishing...' : success ? 'Published!' : 'Publish to Gallery'}</span>
              </button>
              
              <p className="text-[10px] text-center text-text-tertiary">
                Your photo will be visible on the public gallery immediately.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
