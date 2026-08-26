'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardText,
  Clock,
  ArrowSquareOut,
  Sparkle,
  CheckCircle,
  MagnifyingGlass,
  ArrowRight,
  FileText,
  Link as LinkIcon,
  Tag,
  ShieldCheck,
  Compass
} from '@phosphor-icons/react'

const CATEGORIES = [
  'All',
  'Mathematical Content',
  'Problem Writing',
  'Graphic Design',
  'Web & Technology',
  'Community & Outreach',
  'Video & Media'
]

export default function PublicTasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data)
      })
      .catch(err => console.error('Failed to load public tasks:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory
      const matchSearch =
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [tasks, selectedCategory, search])

  return (
    <div className="min-h-screen bg-bg-dynamic text-dynamic pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest">
            <Sparkle size={14} weight="fill" />
            MIN Selection Pool
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-dynamic">
            Collaborative Task Bank
          </h1>
          <p className="text-base text-auto-secondary leading-relaxed">
            Welcome to the practical problem-solving round! Choose <strong>one project brief</strong> that best aligns with your strengths and passion. Quality, depth of thought, and authenticity are what make submissions shine.
          </p>
        </div>

        {/* Filters */}
        <div className="glass p-5 rounded-[2.5rem] border border-border dark:border-white/10 space-y-4 max-w-4xl mx-auto shadow-sm">
          <div className="flex items-center gap-2 bg-bg-secondary dark:bg-white/5 px-4 py-3 rounded-2xl border border-border/50">
            <MagnifyingGlass size={18} className="text-auto-tertiary" />
            <input
              type="text"
              placeholder="Search by topic, track, or project keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none text-sm font-bold w-full outline-none placeholder:text-auto-tertiary/60"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-bg-secondary dark:bg-white/5 text-auto-tertiary border-border/50 hover:border-primary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass p-8 rounded-[2.5rem] border border-border animate-pulse space-y-4">
                <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/3" />
                <div className="h-6 bg-black/10 dark:bg-white/10 rounded w-3/4" />
                <div className="h-20 bg-black/5 dark:bg-white/5 rounded w-full" />
              </div>
            ))
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="glass p-8 rounded-[2.5rem] border border-border dark:border-white/10 flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 group"
              >
                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-wider">
                      {task.category}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-auto-tertiary">
                      {task.difficulty || 'Intermediate'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-dynamic tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    {task.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-auto-secondary leading-relaxed line-clamp-4 font-medium">
                    {task.description || (task.task_type === 'link' ? 'External Google Docs task specification. Click below to view the full prompt and guidelines.' : 'Practical project brief.')}
                  </p>

                  {/* Prominent Mentioned Deadline Badge */}
                  <div className="p-4 bg-[#E8F4F8] dark:bg-white/5 rounded-2xl border border-[#D4EBF2] dark:border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Clock size={18} weight="bold" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-auto-tertiary block">
                        Submission Deadline
                      </span>
                      <span className="text-xs font-black text-[#0D3D52] dark:text-white">
                        {task.deadline_type === 'fixed' && task.deadline_date
                          ? new Date(task.deadline_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : `${task.duration_days || 7} Days from when assigned to you`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  {task.task_type === 'link' && task.external_url ? (
                    <a
                      href={task.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group-hover:scale-[1.02]"
                    >
                      <ArrowSquareOut size={16} weight="bold" />
                      Open Google Doc Brief
                    </a>
                  ) : (
                    <Link
                      href={`/tasks/${task.slug}`}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group-hover:scale-[1.02]"
                    >
                      <span>View Full Task Details</span>
                      <ArrowRight size={16} weight="bold" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass rounded-[3rem] border border-dashed border-border space-y-3">
              <ClipboardText size={48} className="mx-auto text-primary opacity-30" />
              <h3 className="text-lg font-bold">No active task briefs in this category</h3>
              <p className="text-xs text-auto-tertiary">Try selecting "All" or search for another mathematical topic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
