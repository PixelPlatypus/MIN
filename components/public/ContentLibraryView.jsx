'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContentCard from '@/components/public/ContentCard'
import { Search } from 'lucide-react'
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
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto mb-16">
        <div className="flex-1 glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-primary/10 group-focus-within:border-primary transition-all shadow-sm">
          <Search size={20} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by title, excerpt, or tags..." 
            className="bg-transparent border-none text-base focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        {contentTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setActiveType(type.value)}
            className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
              activeType === type.value 
                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                : 'glass border-transparent hover:border-primary/20 text-text-secondary hover:text-primary'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ContentGridSkeleton count={6} />
      ) : filteredContent.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredContent.map((item, i) => (
              <ContentCard key={item.id} item={item} index={i} fallbackImage={fallbackImage} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24 glass rounded-[3rem]">
          <p className="text-xl text-text-tertiary">No content found matching your criteria.</p>
        </div>
      )}
    </section>
  )
}
