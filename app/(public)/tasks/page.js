'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { m, AnimatePresence } from 'framer-motion'
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
import PageHero from '@/components/public/PageHero'

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
    <div className="min-h-screen text-dynamic pb-24">
      {/* Hero Section */}
      <PageHero
        eyebrow="MIN Selection Pool"
        icon={<Sparkle size={14} weight="fill" />}
        title="Collaborative Task Bank"
        description={<>Welcome to the practical problem-solving round! Choose <strong className="text-dynamic">one project brief</strong> that best aligns with your strengths and passion. Quality, depth of thought, and authenticity are what make submissions shine.</>}
      />

      <div className="container mx-auto px-6 space-y-12">
        {/* Filters */}
        <div className="card-brand p-4 sm:p-5 space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-4 py-3 rounded-2xl border border-primary/15 dark:border-white/15 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 dark:focus-within:border-secondary/60 dark:focus-within:ring-secondary/10">
            <MagnifyingGlass size={18} className="text-primary/60 dark:text-secondary/70 shrink-0" />
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
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all border ${
                  selectedCategory === cat
                    ? 'pill-brand-active'
                    : 'pill-brand'
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
              <div key={i} className="card-brand p-8 animate-pulse space-y-4">
                <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/3" />
                <div className="h-6 bg-black/10 dark:bg-white/10 rounded w-3/4" />
                <div className="h-20 bg-black/5 dark:bg-white/5 rounded w-full" />
              </div>
            ))
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="card-brand card-brand-hover p-8 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15 dark:bg-secondary/10 dark:text-secondary dark:border-secondary/25 text-[11px] font-bold tracking-wide">
                      {task.category}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-auto-tertiary">
                      {task.difficulty || 'Intermediate'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-dynamic tracking-tight group-hover:text-primary dark:group-hover:text-secondary transition-colors line-clamp-2">
                    {task.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-auto-secondary leading-relaxed line-clamp-4">
                    {task.description || (task.task_type === 'link' ? 'External Google Docs task specification. Click below to view the full prompt and guidelines.' : 'Practical project brief.')}
                  </p>

                  {/* Prominent Mentioned Deadline Badge */}
                  <div className="p-4 panel-brand-tint flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-secondary/15 flex items-center justify-center text-primary dark:text-secondary shrink-0">
                      <Clock size={18} weight="bold" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wide text-auto-tertiary block">
                        Submission Deadline
                      </span>
                      <span className="text-xs font-bold text-primary-dark dark:text-white">
                        {task.deadline_type === 'fixed' && task.deadline_date
                          ? new Date(task.deadline_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : `${task.duration_days || 7} Days from when assigned to you`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="pt-4 border-t border-primary/10 dark:border-white/10 flex items-center justify-between">
                  {task.task_type === 'link' && task.external_url ? (
                    <a
                      href={task.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-brand w-full py-3.5 px-5 text-sm"
                    >
                      <ArrowSquareOut size={16} weight="bold" />
                      Open Google Doc Brief
                    </a>
                  ) : (
                    <Link
                      href={`/tasks/${task.slug}`}
                      className="btn-brand w-full py-3.5 px-5 text-sm"
                    >
                      <span>View Full Task Details</span>
                      <ArrowRight size={16} weight="bold" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 px-6 text-center card-brand rounded-[2.5rem] border-dashed space-y-3">
              <ClipboardText size={48} className="mx-auto text-primary dark:text-secondary opacity-40" />
              <h3 className="text-lg font-bold">No active task briefs in this category</h3>
              <p className="text-xs text-auto-tertiary">Try selecting "All" or search for another mathematical topic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
