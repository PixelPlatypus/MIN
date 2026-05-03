'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import Link from 'next/link'
import { Plus, MagnifyingGlass as Search, Trash as Trash2, Funnel as Filter, Image as ImageIcon, UploadSimple as Upload, X, FloppyDisk as Save, PencilSimple as Pencil, DotsSixVertical as GripVertical, Check } from '@phosphor-icons/react'
import { ContentGridSkeleton } from '@/components/shared/Skeletons'

export default function AdminGalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [albumFilter, setAlbumFilter] = useState('ALL')
  const [hasChanged, setHasChanged] = useState(false)
  const [isSorting, setIsSorting] = useState(false)

  useEffect(() => {
    async function fetchGallery() {
      setLoading(true)
      const res = await fetch(`/api/gallery?album=${albumFilter}`)
      const data = await res.json()
      setImages(Array.isArray(data) ? data : [])
      setLoading(false)
      setHasChanged(false)
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

  const handleReorder = (newOrder) => {
    setImages(newOrder)
    setHasChanged(true)
  }

  const saveNewOrder = async () => {
    setLoading(true)
    const updates = images.map((img, index) => ({
      id: img.id,
      image_url: img.image_url || img.url,
      display_order: index + 1
    }))
    
    const res = await fetch('/api/gallery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    
    if (res.ok) {
      setHasChanged(false)
      setIsSorting(false)
      alert('Gallery layout confirmed and saved!')
    } else {
      let errorMsg = 'Unknown error'
      try {
        const errData = await res.json()
        errorMsg = errData.error || errorMsg
      } catch (e) {}
      alert(`Failed to save layout: ${errorMsg}`)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Gallery Management</h2>
          <p className="text-auto-secondary text-sm">
            {isSorting ? 'Drag images vertically to set the new order.' : 'Upload and organize photos from MIN events and programs.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanged && (
            <button
              onClick={saveNewOrder}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-green-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Check size={18} />
              Confirm Layout
            </button>
          )}
          <button
            onClick={() => setIsSorting(!isSorting)}
            className={`${isSorting ? 'bg-secondary text-primary' : 'bg-bg-secondary dark:bg-white/10 text-text-main dark:text-white'} px-6 py-3 rounded-2xl text-sm font-black shadow-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95 border border-border dark:border-white/10`}
          >
            {isSorting ? <X size={18} /> : <GripVertical size={18} />}
            {isSorting ? 'Exit Sort Mode' : 'Reorder Gallery'}
          </button>
          <Link 
            href="/admin/gallery/new"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            Upload Photos
          </Link>
        </div>
      </div>

      {!isSorting && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-border dark:border-border-dark focus-within:ring-2 ring-primary/20 transition-all">
            <Search size={18} className="text-auto-tertiary" />
            <input 
              type="text" 
              placeholder="Search by caption or album..." 
              className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-auto-tertiary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-auto-tertiary" />
            <select 
              className="glass px-5 py-3 rounded-2xl text-sm font-bold border border-border dark:border-border-dark outline-none bg-transparent cursor-pointer"
              value={albumFilter}
              onChange={(e) => setAlbumFilter(e.target.value)}
            >
              {albums.map(a => <option key={a} value={a}>{a === 'ALL' ? 'All Albums' : a}</option>)}
            </select>
          </div>
        </div>
      )}

      {filteredImages.length > 0 ? (
        isSorting ? (
          <Reorder.Group 
            axis="y" 
            values={images} 
            onReorder={handleReorder}
            className="space-y-4 max-w-2xl mx-auto"
          >
            {images.map((img) => (
              <Reorder.Item
                key={img.id}
                value={img}
                className="bg-white dark:bg-white/5 border border-border dark:border-white/10 p-4 rounded-3xl flex items-center gap-6 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-auto-tertiary">
                  <GripVertical size={20} />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border dark:border-white/10 shrink-0">
                  <img src={img.image_url || img.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{img.caption || 'No caption'}</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary font-black mt-1">{img.album}</p>
                </div>
                <div className="text-[10px] font-black opacity-30">
                  #{images.indexOf(img) + 1}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
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
                        href={`` + `/admin/gallery/${img.id}`}
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
        )
      ) : (
        <div className="text-center py-24 glass rounded-[3rem] border border-dashed border-border dark:border-border-dark">
          <div className="inline-flex p-6 rounded-[2rem] bg-bg-secondary dark:bg-white/5 text-auto-tertiary mb-6">
            <ImageIcon size={48} />
          </div>
          <h3 className="text-xl font-bold mb-2">Empty Gallery</h3>
          <p className="text-auto-tertiary">No images found for this category.</p>
        </div>
      )}
    </div>
  )
}


