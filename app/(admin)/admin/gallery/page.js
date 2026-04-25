'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Plus, Search, Trash2, Filter, Image as ImageIcon, Upload, X, Save, Pencil } from 'lucide-react'
import { ContentGridSkeleton } from '@/components/shared/Skeletons'

export default function AdminGalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [albumFilter, setAlbumFilter] = useState('ALL')

  useEffect(() => {
    async function fetchGallery() {
      setLoading(true)
      const res = await fetch(`/api/gallery?album=${albumFilter}`)
      const data = await res.json()
      setImages(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchGallery()
  }, [albumFilter])

  const filteredImages = images.filter(img => 
    img.caption?.toLowerCase().includes(search.toLowerCase()) ||
    img.album?.toLowerCase().includes(search.toLowerCase())
  )

  const albums = ['ALL', ...new Set(images.map(img => img.album).filter(Boolean))]

  async function handleDelete(id) {
    if (!confirm('Delete this image from gallery?')) return
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    if (res.ok) setImages(images.filter(img => img.id !== id))
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Gallery Management</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Upload and organize photos from MIN events and programs.
          </p>
        </div>
        <Link 
          href="/admin/gallery/new"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 transition-all flex items-center gap-2 w-fit hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Upload Photos
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:ring-2 ring-primary/20 transition-all">
          <Search size={18} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by caption or album..." 
            className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-text-tertiary" />
          <select 
            className="glass px-5 py-3 rounded-2xl text-sm font-bold border border-border dark:border-border-dark outline-none bg-transparent cursor-pointer"
            value={albumFilter}
            onChange={(e) => setAlbumFilter(e.target.value)}
          >
            {albums.map(a => <option key={a} value={a}>{a === 'ALL' ? 'All Albums' : a}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <ContentGridSkeleton count={10} />
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm border border-border dark:border-border-dark bg-bg-secondary"
              >
                <img 
                  src={img.image_url || img.url} 
                  alt={img.caption} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <p className="text-white text-[10px] font-bold leading-relaxed line-clamp-3">{img.caption}</p>
                  <span className="text-primary-light text-[8px] font-black uppercase tracking-[0.2em] bg-white/10 px-2 py-1 rounded-full">{img.album}</span>
                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        href={`/admin/gallery/${img.id}`}
                        className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white flex items-center justify-center transition-all"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(img.id)}
                        className="w-8 h-8 rounded-full bg-coral/20 text-coral hover:bg-coral hover:text-white flex items-center justify-center transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-[3rem] border border-dashed border-border dark:border-border-dark">
          <div className="inline-flex p-6 rounded-[2rem] bg-bg-secondary dark:bg-white/5 text-text-tertiary mb-6">
            <ImageIcon size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2">Empty Gallery</h3>
          <p className="text-text-tertiary">No images found for this category.</p>
        </div>
      )}
    </div>
  )
}

