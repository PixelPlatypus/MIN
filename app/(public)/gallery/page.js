'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Loader2, Filter, Maximize2 } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { captureEvent } from '@/lib/analytics'

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeAlbum, setActiveAlbum] = useState('ALL')
  const [activeTag, setActiveTag] = useState('ALL')
  const [index, setIndex] = useState(-1)

  useEffect(() => {
    async function fetchGallery() {
      setLoading(true)
      const url = new URL('/api/gallery', window.location.origin)
      if (activeAlbum !== 'ALL') url.searchParams.set('album', activeAlbum)
      if (activeTag !== 'ALL') url.searchParams.set('tag', activeTag)
      
      const res = await fetch(url)
      const data = await res.json()
      setImages(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchGallery()
    captureEvent('gallery_filter_changed', { album: activeAlbum, tag: activeTag })
  }, [activeAlbum, activeTag])

  const albums = ['ALL', ...new Set(images.map(img => img.album).filter(Boolean))]
  const allTags = ['ALL', ...new Set(images.flatMap(img => img.tags || []).filter(Boolean))]

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
          >
            <ImageIcon size={16} />
            Gallery
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Captured Moments
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed max-w-3xl mx-auto"
          >
            A visual journey through our camps, workshops, and the vibrant MIN community.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-6 space-y-8">
        {/* Album Filter */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setActiveAlbum(album)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                activeAlbum === album 
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                  : 'glass border-transparent hover:border-primary/20 text-text-secondary hover:text-primary'
              }`}
            >
              {album === 'ALL' ? 'All Albums' : album}
            </button>
          ))}
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeTag === tag 
                  ? 'bg-text-main text-bg-main border-text-main dark:bg-white dark:text-black' 
                  : 'glass border-transparent hover:border-text-main/20 text-text-tertiary'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
        ) : images.length > 0 ? (
          <>
            <motion.div 
              layout
              className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
            >
              <AnimatePresence mode="popLayout">
                {images.map((image, i) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="relative group cursor-pointer break-inside-avoid rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/5 dark:border-white/5"
                    onClick={() => {
                      setIndex(i)
                      captureEvent('gallery_image_opened', { caption: image.caption, album: image.album })
                    }}
                  >
                    <img 
                      src={image.image_url || image.url} 
                      alt={image.caption || 'Gallery Image'} 
                      className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 space-y-3">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {image.tags?.map(t => (
                          <span key={t} className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-bold">#{t}</span>
                        ))}
                      </div>
                      <p className="text-white font-bold text-xl leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {image.caption || 'Mathematics Initiative'}
                      </p>
                      {image.album && (
                        <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                          <Filter size={12} />
                          {image.album}
                        </div>
                      )}
                      <div className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Maximize2 size={24} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <Lightbox
              index={index}
              open={index >= 0}
              close={() => setIndex(-1)}
              slides={images.map(img => ({ src: img.image_url || img.url, title: img.caption, description: img.album }))}
            />
          </>
        ) : (
          <div className="text-center py-24 glass rounded-[3rem]">
            <p className="text-xl text-text-tertiary">No images found matching your selection.</p>
          </div>
        )}
      </section>
    </div>
  )
}
