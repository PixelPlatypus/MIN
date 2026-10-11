'use client'
import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import LayoutMotion from '@/components/shared/LayoutMotion'
import ContentCard from '@/components/public/ContentCard'
import { MagnifyingGlass as Search } from '@phosphor-icons/react'
import { ContentGridSkeleton } from '@/components/shared/Skeletons'

const contentTypes = [
  { label: 'All', value: 'ALL' },
  { label: 'Articles', value: 'ARTICLE' },
  { label: 'Problems', value: 'PROBLEM' },
  { label: 'Blog', value: 'BLOG' },
  { label: 'Resources', value: 'RESOURCE' },
  { label: 'Video', value: 'VIDEO' },
]

export default function ContentLibraryView({ initialContent, initialType = 'ALL', fallbackImage }) {
  const [content, setContent] = useState(initialContent || [])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState(initialType)
  const [search, setSearch] = useState('')
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => {
    // Prevent fetching on first mount if we have initial data
    if (isFirstMount) {
      setIsFirstMount(false)
      return
    }

    async function fetchContent() {
      setLoading(true)
      try {
        const res = await fetch(`/api/content?status=PUBLISHED&type=${activeType}`)
        const data = await res.json()
        setContent(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch content:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [activeType])

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <section className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto mb-10">
        <div className="flex-1 card-brand rounded-2xl px-6 py-4 flex items-center gap-3 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:focus-within:border-secondary/60 dark:focus-within:ring-secondary/10">
          <Search size={20} className="text-primary/60 dark:text-secondary/70 shrink-0" />
          <input 
            type="text" 
            placeholder="Search by title, excerpt, or tags..." 
            className="bg-transparent border-none text-base focus:outline-none w-full placeholder:text-auto-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
        {contentTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setActiveType(type.value)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
              activeType === type.value 
                ? 'pill-brand-active' 
                : 'pill-brand'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ContentGridSkeleton count={6} />
      ) : filteredContent.length > 0 ? (
        <LayoutMotion>
          <m.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* initial={false}: first render paints from the server HTML; animations only on filter changes */}
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredContent.map((item, i) => (
                <ContentCard key={item.id} item={item} index={i} fallbackImage={fallbackImage} />
              ))}
            </AnimatePresence>
          </m.div>
        </LayoutMotion>
      ) : (
        <div className="text-center py-24 card-brand rounded-[2.5rem]">
          <p className="text-xl text-auto-tertiary">No content found matching your criteria.</p>
        </div>
      )}
    </section>
  )
}
