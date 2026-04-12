'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, MoreVertical, Edit2, Trash2, Filter, Loader2, FileText, FileDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminContentPage() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const router = useRouter()

  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      const res = await fetch(`/api/content?type=${typeFilter}`)
      const data = await res.json()
      setContent(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchContent()
  }, [typeFilter])

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.author_name?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || item.status === filter
    return matchesSearch && matchesFilter
  })

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this content?')) return

    const res = await fetch(`/api/content/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setContent(content.filter(c => c.id !== id))
    } else {
      const err = await res.json()
      alert(err.error || "Failed to delete content.")
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Content Library</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Manage your articles, problems, blog posts, and resources.
          </p>
        </div>
        <Link 
          href="/admin/content/new" 
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          New Content
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 glass px-4 py-2 rounded-xl flex items-center gap-3 border border-border dark:border-border-dark group-focus-within:border-primary transition-all">
          <Search size={18} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search content..." 
            className="bg-transparent border-none text-sm focus:outline-none w-full placeholder:text-text-tertiary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            className="glass px-4 py-2 rounded-xl text-sm font-medium border border-border dark:border-border-dark focus:outline-none focus:border-primary transition-all bg-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="ARTICLE">Articles</option>
            <option value="PROBLEM">Problems</option>
            <option value="BLOG">Blog</option>
            <option value="RESOURCE">Resources</option>
          </select>
          <select 
            className="glass px-4 py-2 rounded-xl text-sm font-medium border border-border dark:border-border-dark focus:outline-none focus:border-primary transition-all bg-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-sm border border-border dark:border-border-dark">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary dark:bg-white/5 text-text-tertiary dark:text-text-tertiary-dark text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-secondary/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.content_type === 'PDF' ? 'bg-coral/10 text-coral' : 'bg-primary/10 text-primary'
                        }`}>
                          {item.content_type === 'PDF' ? <FileDown size={18} /> : <FileText size={18} />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold truncate">{item.title}</span>
                          <span className="text-xs text-text-tertiary truncate">{item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">{item.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary dark:text-text-secondary-dark">{item.author_name || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        item.status === 'PUBLISHED' 
                          ? 'bg-green/10 text-green border-green/10' 
                          : item.status === 'DRAFT'
                            ? 'bg-primary/10 text-primary border-primary/10'
                            : 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/10'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/content/${item.id}`}
                          className="p-2 rounded-xl text-text-tertiary hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl text-text-tertiary hover:text-coral hover:bg-coral/10 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-text-tertiary">No content found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
