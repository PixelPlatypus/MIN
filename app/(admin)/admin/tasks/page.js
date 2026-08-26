'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardText,
  Plus,
  MagnifyingGlass,
  ArrowSquareOut,
  Clock,
  CheckCircle,
  FileText,
  Link as LinkIcon,
  Trash,
  PencilSimple,
  Copy,
  Check,
  CircleNotch,
  Calendar,
  Sparkle,
  Eye,
  Tag,
  Funnel,
  WarningCircle,
  X
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

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  // Modal / Drawer State
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  // Form State
  const [formType, setFormType] = useState('link') // 'link' | 'manual'
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('Mathematical Content')
  const [externalUrl, setExternalUrl] = useState('')
  const [description, setDescription] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [guidelines, setGuidelines] = useState('')
  const [deadlineType, setDeadlineType] = useState('fixed') // 'fixed' | 'rolling'
  const [deadlineDate, setDeadlineDate] = useState('')
  const [durationDays, setDurationDays] = useState('7')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [status, setStatus] = useState('published')
  const [submissionUrl, setSubmissionUrl] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (err) {
      console.error('Failed to load tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingTask(null)
    setFormType('link')
    setTitle('')
    setSlug('')
    setCategory('Mathematical Content')
    setExternalUrl('')
    setDescription('')
    setDeliverables('')
    setGuidelines('')
    setDeadlineType('fixed')
    setDeadlineDate('')
    setDurationDays('7')
    setDifficulty('Intermediate')
    setStatus('published')
    setSubmissionUrl('')
    setErrorMsg(null)
  }

  function openCreateModal() {
    resetForm()
    setShowDrawer(true)
  }

  function openEditModal(task) {
    setEditingTask(task)
    setFormType(task.task_type || 'link')
    setTitle(task.title || '')
    setSlug(task.slug || '')
    setCategory(task.category || 'Mathematical Content')
    setExternalUrl(task.external_url || '')
    setDescription(task.description || '')
    setDeliverables(task.deliverables || '')
    setGuidelines(task.guidelines || '')
    setDeadlineType(task.deadline_type || 'fixed')
    setDeadlineDate(task.deadline_date ? new Date(task.deadline_date).toISOString().slice(0, 16) : '')
    setDurationDays(task.duration_days ? String(task.duration_days) : '7')
    setDifficulty(task.difficulty || 'Intermediate')
    setStatus(task.status || 'published')
    setSubmissionUrl(task.submission_url || '')
    setErrorMsg(null)
    setShowDrawer(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMsg('Task heading/title is required')
      return
    }

    if (formType === 'link' && !externalUrl.trim()) {
      setErrorMsg('External document link (Google Docs / Figma / Notion) is required')
      return
    }

    setSaving(true)
    setErrorMsg(null)

    const payload = {
      title,
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      task_type: formType,
      external_url: formType === 'link' ? externalUrl : null,
      description,
      deliverables,
      guidelines,
      deadline_type: deadlineType,
      deadline_date: deadlineType === 'fixed' && deadlineDate ? new Date(deadlineDate).toISOString() : null,
      duration_days: parseInt(durationDays) || 7,
      difficulty,
      status,
      submission_url: submissionUrl
    }

    try {
      const url = editingTask ? `/api/admin/tasks/${editingTask.id}` : '/api/admin/tasks'
      const method = editingTask ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setShowDrawer(false)
        resetForm()
        await fetchTasks()
      } else {
        const err = await res.json()
        setErrorMsg(err.error || 'Failed to save task')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(task) {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return

    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, { method: 'DELETE' })
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== task.id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory
      const matchStatus = selectedStatus === 'All' || t.status === selectedStatus
      const matchSearch =
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchStatus && matchSearch
    })
  }, [tasks, selectedCategory, selectedStatus, search])

  const copyTaskLink = (task) => {
    const origin = window.location.origin
    const url = task.task_type === 'link' && task.external_url ? task.external_url : `${origin}/tasks/${task.slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(task.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ClipboardText size={22} weight="duotone" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-dynamic">Task Bank & Assignments</h2>
          </div>
          <p className="text-auto-secondary text-sm">
            Manage practical task challenges for applicant selection, with Google Docs links, rich briefs, and clear deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/tasks"
            target="_blank"
            className="glass border border-primary/30 text-primary hover:bg-primary hover:text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Eye size={16} />
            Public Task Bank
          </a>
          <button
            onClick={openCreateModal}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={16} weight="bold" />
            Create Task
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-5 rounded-[2rem] border border-border dark:border-white/5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-bg-secondary dark:bg-white/5 px-4 py-2.5 rounded-xl border border-border/50 flex-1 max-w-md">
            <MagnifyingGlass size={16} className="text-auto-tertiary" />
            <input
              type="text"
              placeholder="Search tasks, headings, or topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none text-xs font-bold w-full outline-none placeholder:text-auto-tertiary/60"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-bg-secondary dark:bg-white/5 border border-border/50 text-xs font-bold px-3 py-2 rounded-xl outline-none text-dynamic"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                  : 'bg-bg-secondary dark:bg-white/5 text-auto-tertiary border-border/50 hover:border-primary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass p-6 rounded-[2rem] border border-border animate-pulse space-y-4">
              <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/3" />
              <div className="h-6 bg-black/10 dark:bg-white/10 rounded w-3/4" />
              <div className="h-16 bg-black/5 dark:bg-white/5 rounded w-full" />
            </div>
          ))
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className="glass p-6 rounded-[2rem] border border-border dark:border-white/10 space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
            >
              <div className="space-y-3">
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-wider">
                    {task.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {task.task_type === 'link' ? (
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <LinkIcon size={10} /> Google Doc
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <FileText size={10} /> Rich Brief
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      task.status === 'published' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-dynamic tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                  {task.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-auto-secondary leading-relaxed line-clamp-3 font-medium">
                  {task.description || (task.task_type === 'link' ? 'External document task brief. Click below to view the full document.' : 'No description provided.')}
                </p>

                {/* Deadline Mention Badge */}
                <div className="p-3 bg-[#E8F4F8] dark:bg-white/5 rounded-xl border border-[#D4EBF2] dark:border-white/10 flex items-center gap-2.5">
                  <Clock size={16} className="text-primary shrink-0" weight="bold" />
                  <div className="text-[11px] leading-tight">
                    <span className="text-[9px] font-black uppercase tracking-wider text-auto-tertiary block">
                      Mentioned Deadline
                    </span>
                    <span className="font-bold text-[#0D3D52] dark:text-white">
                      {task.deadline_type === 'fixed' && task.deadline_date
                        ? new Date(task.deadline_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : `${task.duration_days || 7} Days from assignment`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {task.task_type === 'link' && task.external_url ? (
                    <a
                      href={task.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-xs flex items-center gap-1 font-bold"
                      title="Open Google Doc"
                    >
                      <ArrowSquareOut size={15} /> Doc
                    </a>
                  ) : null}
                  <button
                    onClick={() => copyTaskLink(task)}
                    className="p-2 rounded-xl glass hover:bg-black/5 dark:hover:bg-white/5 text-auto-tertiary hover:text-primary transition-all text-xs flex items-center gap-1"
                    title="Copy Link for Candidate"
                  >
                    {copiedId === task.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-auto-secondary hover:text-primary transition-all"
                    title="Edit Task"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task)}
                    className="p-2 rounded-xl hover:bg-rose-500/10 text-auto-tertiary hover:text-rose-600 transition-all"
                    title="Delete Task"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 glass rounded-[2.5rem] border border-dashed border-border text-center space-y-3">
            <ClipboardText size={36} className="mx-auto text-primary opacity-40" />
            <h4 className="text-base font-bold">No Tasks Found</h4>
            <p className="text-xs text-auto-tertiary">Create your first task or clear your search filters.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Task Drawer Modal */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowDrawer(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 md:p-8 max-w-2xl w-full border border-border dark:border-white/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ClipboardText size={22} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-dynamic">
                      {editingTask ? 'Edit Task Brief' : 'Create New Task Brief'}
                    </h3>
                    <p className="text-[10px] font-bold text-auto-tertiary uppercase tracking-widest">
                      Task Bank & Shortlisted Candidate Assignments
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-auto-tertiary"
                >
                  <X size={18} />
                </button>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2">
                  <WarningCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Task Type Switcher */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                    Task Format Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-bg-secondary dark:bg-white/5 rounded-2xl border border-border">
                    <button
                      type="button"
                      onClick={() => setFormType('link')}
                      className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        formType === 'link' ? 'bg-primary text-white shadow-md' : 'text-auto-tertiary hover:text-dynamic'
                      }`}
                    >
                      <LinkIcon size={16} /> Google Docs / Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType('manual')}
                      className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        formType === 'manual' ? 'bg-primary text-white shadow-md' : 'text-auto-tertiary hover:text-dynamic'
                      }`}
                    >
                      <FileText size={16} /> Manual Rich Brief
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                    Task Heading / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Olympiad Geometry & Combinatorics Problem Design"
                    className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm font-bold text-dynamic outline-none focus:border-primary transition-all shadow-inner"
                  />
                </div>

                {/* Category & Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                      Category Track
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-xs font-bold text-dynamic outline-none focus:border-primary transition-all"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value)}
                      className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-xs font-bold text-dynamic outline-none focus:border-primary transition-all"
                    >
                      {DIFFICULTIES.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* External URL (If link type) */}
                {formType === 'link' && (
                  <div className="space-y-1.5 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <LinkIcon size={14} /> Google Docs / External Brief URL *
                    </label>
                    <input
                      type="url"
                      required={formType === 'link'}
                      value={externalUrl}
                      onChange={e => setExternalUrl(e.target.value)}
                      placeholder="https://docs.google.com/document/d/.../edit?usp=sharing"
                      className="w-full bg-white dark:bg-white/10 border border-border rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-dynamic outline-none focus:border-primary transition-all"
                    />
                    <p className="text-[10px] text-auto-tertiary">
                      Ensure your Google Doc link is set to "Anyone with the link can view".
                    </p>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                    Task Description & Objectives (Markdown Supported)
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide a clear, detailed overview of what candidates are expected to create..."
                    className="w-full bg-white dark:bg-white/5 border border-border rounded-xl p-4 text-xs font-mono leading-relaxed text-dynamic outline-none focus:border-primary transition-all resize-y"
                  />
                </div>

                {/* Deliverables & Guidelines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                      Expected Deliverables
                    </label>
                    <textarea
                      rows={3}
                      value={deliverables}
                      onChange={e => setDeliverables(e.target.value)}
                      placeholder="1. Written solution PDF&#10;2. TikZ diagram..."
                      className="w-full bg-white dark:bg-white/5 border border-border rounded-xl p-3 text-xs font-mono leading-relaxed text-dynamic outline-none focus:border-primary transition-all resize-y"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                      Rules & Guidelines
                    </label>
                    <textarea
                      rows={3}
                      value={guidelines}
                      onChange={e => setGuidelines(e.target.value)}
                      placeholder="Ensure originality; citations required..."
                      className="w-full bg-white dark:bg-white/5 border border-border rounded-xl p-3 text-xs font-mono leading-relaxed text-dynamic outline-none focus:border-primary transition-all resize-y"
                    />
                  </div>
                </div>

                {/* Deadline Configuration System */}
                <div className="p-4 bg-bg-secondary dark:bg-white/5 rounded-2xl border border-border space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <Clock size={14} /> Deadline Mention Feature
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-auto-tertiary uppercase">Deadline Format</label>
                      <select
                        value={deadlineType}
                        onChange={e => setDeadlineType(e.target.value)}
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-xl px-3 py-2 text-xs font-bold text-dynamic outline-none"
                      >
                        <option value="fixed">Fixed Specific Date</option>
                        <option value="rolling">Rolling Days from Assignment</option>
                      </select>
                    </div>

                    {deadlineType === 'fixed' ? (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-auto-tertiary uppercase">Target Date</label>
                        <input
                          type="datetime-local"
                          value={deadlineDate}
                          onChange={e => setDeadlineDate(e.target.value)}
                          className="w-full bg-white dark:bg-white/10 border border-border rounded-xl px-3 py-2 text-xs font-bold text-dynamic outline-none"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-auto-tertiary uppercase">Duration (Days)</label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={durationDays}
                          onChange={e => setDurationDays(e.target.value)}
                          className="w-full bg-white dark:bg-white/10 border border-border rounded-xl px-3 py-2 text-xs font-bold text-dynamic outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-3 bg-bg-secondary dark:bg-white/5 rounded-xl border border-border">
                  <span className="text-xs font-bold text-dynamic">Task Status</span>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="bg-white dark:bg-white/10 border border-border rounded-lg px-3 py-1 text-xs font-bold text-dynamic outline-none"
                  >
                    <option value="published">Published (Visible in Task Bank)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <CircleNotch size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    {saving ? 'Saving Task...' : editingTask ? 'Update Task' : 'Publish Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    className="px-6 py-3.5 rounded-2xl glass text-xs font-black uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
