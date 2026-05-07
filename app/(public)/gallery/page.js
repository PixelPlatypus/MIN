'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })
import 'yet-another-react-lightbox/styles.css'
import { captureEvent } from '@/lib/analytics'

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeAlbum, setActiveAlbum] = useState('ALL')
  const [activeTag, setActiveTag] = useState('ALL')
  const [index, setIndex] = useState(-1)
  const [settings, setSettings] = useState(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    setSettingsLoading(true)
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setSettingsLoading(false)
      })
      .catch(err => {
        console.error('Gallery settings load error', err)
        setSettingsLoading(false)
      })
  }, [])

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
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 pill px-4 py-2 text-xs font-institutional tracking-[0.2em] text-text-secondary-dynamic">
            <ImageIcon size={16} className="text-marigold" />
            {settingsLoading ? 'Gallery' : settings?.gallery_title || 'Gallery'}
          </div>
          <h1 className="text-headline text-5xl md:text-7xl font-bold tracking-tight">
            {settingsLoading ? 'Our Moments' : settings?.gallery_subtitle || 'Our Moments'}
          </h1>
          <p className="text-xl text-text-secondary-dynamic leading-relaxed max-w-3xl mx-auto">
            {settingsLoading ? '' : settings?.gallery_description || 'Explore moments from our events, workshops, and community gatherings.'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setActiveAlbum(album)}
              className={`pill px-8 py-3 text-sm font-bold transition-all ${
                activeAlbum === album
                  ? 'bg-headline text-bg border-headline'
                  : 'text-text-secondary-dynamic border-border hover:border-border-strong'
              }`}
            >
              {album === 'ALL' ? 'All Albums' : album}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`pill px-4 py-1.5 text-xs font-bold transition-all ${
                activeTag === tag
                  ? 'bg-headline text-bg border-headline'
                  : 'text-text-tertiary-dynamic border-border hover:border-border-strong'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-bg-secondary animate-pulse" />
            ))}
          </div>
        ) : images.length > 0 ? (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
                    className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[4/3] border border-border"
                    onClick={() => {
                      setIndex(i)
                      captureEvent('gallery_image_opened', { caption: image.caption, album: image.album })
                    }}
                  >
                    <Image
                      src={image.image_url || image.url}
                      alt={image.caption || 'Gallery Image'}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 space-y-3">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {image.tags?.map(t => (
                          <span key={t} className="pill px-2 py-0.5 text-[10px] font-bold text-text-primary-dynamic bg-bg/40">#{t}</span>
                        ))}
                      </div>
                      <p className="text-headline font-bold text-xl leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {image.caption}
                      </p>
                      {image.album && (
                        <div className="flex items-center gap-2 text-marigold text-xs font-institutional tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                          <ImageIcon size={12} />
                          {image.album}
                        </div>
                      )}
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
          <div className="text-center py-24 bg-surface rounded-3xl border border-border">
            <p className="text-xl text-text-tertiary-dynamic">No images found matching your selection.</p>
          </div>
        )}
      </section>
    </div>
  )
}
