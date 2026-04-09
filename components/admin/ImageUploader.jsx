'use client'
import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

export default function ImageUploader({ 
  onUpload, 
  folder = 'min-website/general', 
  label = 'Upload Image', 
  accept = 'image/*',
  className = ''
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    
    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5MB)')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 401) throw new Error('Unauthorized: Please log in again')
        if (res.status === 403) throw new Error('Forbidden: You do not have permission to upload')
        if (res.status === 429) throw new Error('Rate limit exceeded. Please wait a minute.')
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json()
      if (data.url) {
        onUpload(data.url, data.public_id, file.name)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Upload size={16} />
        )}
        {uploading ? 'Uploading...' : label}
      </button>

      {error && (
        <p className="text-[10px] text-coral font-semibold text-center mt-1">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
