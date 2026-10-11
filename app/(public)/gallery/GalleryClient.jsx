'use client'
import { useState, useEffect, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import LayoutMotion from '@/components/shared/LayoutMotion'
import { Image as ImageIcon, Funnel as Filter, CornersOut as Maximize2 } from '@phosphor-icons/react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
// Lightbox is dynamically loaded to reduce main-thread work
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })
import 'yet-another-react-lightbox/styles.css'
import { captureEvent } from '@/lib/analytics'
import { Skeleton } from '@/components/ui/Skeleton'
import PageHero from '@/components/public/PageHero'

const PILL_ACTIVE = 'pill-brand-active'
const PILL_IDLE = 'pill-brand'

export default function GalleryClient({ initialSettings = null, initialImages = [] }) {
  const [activeAlbum, setActiveAlbum] = useState('ALL')
  const [activeTag, setActiveTag] = useState('ALL')
  const [index, setIndex] = useState(-1)
  const [settings, setSettings] = useState(initialSettings)
  const [settingsLoading, setSettingsLoading] = useState(!initialSettings)

  // Filter options come from the full set, so they stay put when a filter is active
  const availableAlbums = useMemo(() => ['ALL', ...new Set(initialImages.map(img => img.album).filter(Boolean))], [initialImages])
  const availableTags = useMemo(() => ['ALL', ...new Set(initialImages.flatMap(img => img.tags || []).filter(Boolean))], [initialImages])
  const images = useMemo(() => initialImages.filter(img =>
    (activeAlbum === 'ALL' || img.album === activeAlbum) &&
    (activeTag === 'ALL' || (img.tags || []).includes(activeTag))
  ), [initialImages, activeAlbum, activeTag])

  useEffect(() => {
    if (!initialSettings) fetch('/api/settings')
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
    captureEvent('gallery_filter_changed', { album: activeAlbum, tag: activeTag })
  }, [activeAlbum, activeTag])


  return (
    <div className="pb-24">
      <PageHero
        eyebrow={settings?.gallery_title}
        icon={<ImageIcon size={14} weight="bold" />}
        title={settings?.gallery_subtitle}
        description={settings?.gallery_description}
        loading={settingsLoading}
      />

      {/* Filters */}
      <section className="container mx-auto px-6 space-y-8">
        {/* Album Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {availableAlbums.map((album) => (
              <button
                key={album}
                onClick={() => setActiveAlbum(album)}
                className={`px-6 md:px-7 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                  activeAlbum === album ? PILL_ACTIVE : `${PILL_IDLE} hover:-translate-y-0.5`
                }`}
              >
                {album === 'ALL' ? 'All Albums' : album}
              </button>
          ))}
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {availableTags.length > 1 && availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  activeTag === tag ? PILL_ACTIVE : PILL_IDLE
                }`}
              >
                #{tag}
              </button>
          ))}
        </div>

        {images.length > 0 ? (
          <>
            <LayoutMotion>
              <m.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {/* initial={false}: first render paints from the server HTML; animations only on filter changes */}
                <AnimatePresence mode="popLayout" initial={false}>
                  {images.map((image, i) => (
                    <m.div
                      key={image.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="card-brand relative group cursor-pointer rounded-[2.5rem] overflow-hidden aspect-[4/3]"
                      onClick={() => {
                        setIndex(i)
                        captureEvent('gallery_image_opened', { caption: image.caption, album: image.album })
                      }}
                    >
                      <Image
                        loading={i < 3 ? 'eager' : 'lazy'}
                        fetchPriority={i < 3 ? 'high' : 'auto'}
                        src={image.image_url || image.url} 
                        alt={image.caption || 'Gallery Image'} 
                        fill
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 space-y-3">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {image.tags?.map(t => (
                            <span key={t} className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-bold">#{t}</span>
                          ))}
                        </div>
                        <p className="text-white font-bold text-xl leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          {image.caption}
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
                    </m.div>
                  ))}
                </AnimatePresence>
              </m.div>
            </LayoutMotion>

            <Lightbox
              index={index}
              open={index >= 0}
              close={() => setIndex(-1)}
              slides={images.map(img => ({ src: img.image_url || img.url, title: img.caption, description: img.album }))}
            />
          </>
        ) : (
          <div className="text-center py-24 px-6 card-brand rounded-[2.5rem]">
            <p className="text-xl text-auto-tertiary">No images found matching your selection.</p>
          </div>
        )}
      </section>
    </div>
  )
}
