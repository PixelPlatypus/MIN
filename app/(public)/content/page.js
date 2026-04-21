'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ContentCard from '@/components/public/ContentCard'
import { Sparkles, Loader2, Library, Filter, Search } from 'lucide-react'

const contentTypes = [
  { label: 'All', value: 'ALL' },
  { label: 'Articles', value: 'ARTICLE' },
  { label: 'Problems', value: 'PROBLEM' },
  { label: 'Blog', value: 'BLOG' },
  { label: 'Resources', value: 'RESOURCE' },
  { label: 'Video', value: 'VIDEO' },
]

export default function ContentLibraryPage() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('ALL')
  const [search, setSearch] = useState('')
  const [fallbackImage, setFallbackImage] = useState(null)

  useEffect(() => {
    // Fetch settings once for the whole page — avoids N+1 per card
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setFallbackImage(data?.default_notice_image || null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      const res = await fetch(`/api/content?status=PUBLISHED&type=${activeType}`)
      const data = await res.json()
      setContent(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchContent()
  }, [activeType])

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  )

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
            <Library size={16} />
            Library
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Knowledge & Resources
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed max-w-3xl mx-auto"
          >
            Discover a wealth of mathematical articles, challenging problems, 
            and educational resources curated for students and teachers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <Link 
              href="/submit-content"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center gap-2"
            >
              <Sparkles size={18} />
              Contribute Your Knowledge
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
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
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
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
    </div>
  )
}
