'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContentCard from '@/components/public/ContentCard'
import { Search } from 'lucide-react'
import { ContentGridSkeleton } from '@/components/shared/Skeletons'

const contentTypes = [
  { label: 'All', value: 'ALL' }, { label: 'Articles', value: 'ARTICLE' }, { label: 'Problems', value: 'PROBLEM' },
  { label: 'Blog', value: 'BLOG' }, { label: 'Resources', value: 'RESOURCE' }, { label: 'Video', value: 'VIDEO' },
]

export default function ContentLibraryView({ initialContent, initialType = 'ALL', fallbackImage }) {
  const [content, setContent] = useState(initialContent || [])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState(initialType)
  const [search, setSearch] = useState('')
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => { if (isFirstMount) { setIsFirstMount(false); return }; async function f() { setLoading(true); try { const r = await fetch(`/api/content?status=PUBLISHED&type=${activeType}`); setContent(Array.isArray(await r.json()) ? await r.json() : []) } catch {} finally { setLoading(false) } } f() }, [activeType])

  const filtered = content.filter(item => item.title.toLowerCase().includes(search.toLowerCase()) || item.excerpt?.toLowerCase().includes(search.toLowerCase()) || item.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())))

  return (
    <section className="px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto mb-12">
        <div className="rounded-xl border border-border bg-bg-secondary flex items-center gap-3 px-5 py-3.5"><Search size={18} className="text-text-tertiary-dynamic" /><input type="text" placeholder="Search by title, excerpt, or tags..." className="bg-transparent border-none text-sm focus:outline-none w-full text-text-primary-dynamic placeholder:text-text-tertiary-dynamic" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {contentTypes.map((type) => (
          <button key={type.value} onClick={() => setActiveType(type.value)} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeType === type.value ? 'bg-headline text-bg' : 'border border-border text-text-secondary-dynamic hover:text-headline hover:border-headline/40'}`}>{type.label}</button>
        ))}
      </div>
      {loading ? <ContentGridSkeleton count={6} /> : filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><AnimatePresence mode="popLayout">{filtered.map((item, i) => <ContentCard key={item.id} item={item} index={i} fallbackImage={fallbackImage} />)}</AnimatePresence></motion.div>
      ) : <div className="text-center py-24 rounded-2xl border border-border bg-surface"><p className="text-lg text-text-secondary-dynamic">No content found matching your criteria.</p></div>}
    </section>
  )
}
