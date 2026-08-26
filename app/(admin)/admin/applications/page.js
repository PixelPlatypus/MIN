'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserPlus, 
  MagnifyingGlass as Search, 
  FileText,
  Envelope as Mail, 
  Phone, 
  Calendar, 
  CheckCircle as CheckCircle2, 
  XCircle, 
  Clock, 
  CaretRight as ChevronRight,
  Funnel as Filter,
  Trash as Trash2,
  ArrowSquareOut as ExternalLink,
  Wrench,
  ChatTeardropText as MessageSquare,
  ClockCounterClockwise as History,
  Check,
  ArrowRight,
  Link as LinkIcon,
  Users,
  Student,
  CircleNotch as Loader2,
  Sparkle,
  ClipboardText,
  ArrowBendDownRight,
  ArrowsClockwise
} from '@phosphor-icons/react'
import { TableSkeleton } from '@/components/shared/Skeletons'

const PIPELINE_STAGES = [
  { id: 'ALL', label: 'All Candidates' },
  { id: 'PENDING', label: 'Applied', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { id: 'REVIEWED', label: 'Reviewed', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'ACCEPTED', label: 'Shortlisted', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { id: 'TASK_ASSIGNED', label: 'Task Round', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  { id: 'INTERVIEW', label: 'Interview', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { id: 'ONBOARDED', label: 'Onboarded', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'REJECTED', label: 'Not Selected', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' }
]

const PIPELINE_ORDER = ['PENDING', 'REVIEWED', 'ACCEPTED', 'TASK_ASSIGNED', 'INTERVIEW', 'ONBOARDED']
const PIPELINE_LABELS = {
  PENDING: 'Applied',
  REVIEWED: 'Reviewed',
  ACCEPTED: 'Shortlisted',
  TASK_ASSIGNED: 'Task Round',
  INTERVIEW: 'Interview',
  ONBOARDED: 'Onboarded'
}

function PipelineTracker({ status }) {
  const normalizedStatus = status === 'APPROVED' ? 'ACCEPTED' : status
  const isRejected = normalizedStatus === 'REJECTED'
  const currentIdx = isRejected ? -1 : PIPELINE_ORDER.indexOf(normalizedStatus)

  return (
    <div className="flex items-center gap-1 w-full">
      {PIPELINE_ORDER.map((stage, i) => {
        const isCompleted = !isRejected && i <= currentIdx
        const isCurrent = !isRejected && i === currentIdx
        return (
          <div key={stage} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                isCurrent ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' :
                isCompleted ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-black/5 dark:bg-white/10 text-auto-tertiary'
              }`}>
                {isCompleted && !isCurrent ? <Check size={12} weight="bold" /> : i + 1}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest mt-1.5 truncate ${
                isCurrent ? 'text-primary' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-auto-tertiary opacity-50'
              }`}>
                {PIPELINE_LABELS[stage]}
              </span>
            </div>
            {i < PIPELINE_ORDER.length - 1 && (
              <div className={`h-[2px] w-full min-w-[8px] mx-0.5 rounded-full ${
                !isRejected && i < currentIdx ? 'bg-emerald-500/40' : 'bg-black/5 dark:bg-white/10'
              }`} />
            )}
          </div>
        )
      })}
      {isRejected && (
        <div className="flex flex-col items-center ml-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-rose-500/20 text-rose-500">
            <XCircle size={14} weight="bold" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest mt-1.5 text-rose-500">Not Selected</span>
        </div>
      )}
    </div>
  )
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('ALL')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [selectedApp, setSelectedApp] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [processingStatus, setProcessingStatus] = useState(null)
  
  // Transition Form State
  const [selectedTaskSlug, setSelectedTaskSlug] = useState('')
  const [taskBankUrl, setTaskBankUrl] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [schedulingUrl, setSchedulingUrl] = useState('')
  const [buddyName, setBuddyName] = useState('')
  const [buddyEmail, setBuddyEmail] = useState('')
  const [teamName, setTeamName] = useState('')

  useEffect(() => {
    fetchApplications()
    fetchTasks()
  }, [])

  async function fetchApplications() {
    setLoading(true)
    try {
      const res = await fetch('/api/applications/admin')
      if (res.ok) {
        const data = await res.json()
        setApps(data)
      }
    } catch (err) {
      console.error('Failed to load applications:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchTasks() {
    try {
      const res = await fetch('/api/admin/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (err) {
      console.error('Failed to load tasks:', err)
    }
  }

  function openAppDetails(app) {
    setSelectedApp(app)
    setAdminNote(app.notes || '')
    // Reset smart defaults based on current application
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.mathsinitiatives.org.np'
    setTaskBankUrl(`${origin}/tasks`)
    setTaskDeadline('7 days from assignment')
    setSchedulingUrl('https://cal.com/min-nepal/interview')
    setBuddyName('')
    setBuddyEmail('')
    setTeamName(app.form_definitions?.title || 'MIN Core Operations Wing')
  }

  // Handle stage transition
  async function updateStatus(newStatus) {
    if (!selectedApp) return
    setProcessingStatus(newStatus)

    try {
      const payload = {
        status: newStatus,
        notes: adminNote,
        task_bank_url: selectedTaskSlug ? `${window.location.origin}/tasks/${selectedTaskSlug}` : taskBankUrl,
        task_deadline: taskDeadline,
        scheduling_url: schedulingUrl,
        buddy_name: buddyName,
        buddy_email: buddyEmail,
        team_name: teamName
      }

      const res = await fetch(`/api/applications/admin/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const updated = await res.json()
        setApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, ...updated, status: updated.status } : a))
        setSelectedApp(prev => ({ ...prev, ...updated, status: updated.status }))
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to update status')
      }
    } catch (err) {
      alert('Network error updating status')
    } finally {
      setProcessingStatus(null)
    }
  }

  // Stage Count Mapping
  const stageCounts = useMemo(() => {
    const counts = { ALL: apps.length }
    PIPELINE_STAGES.forEach(s => {
      if (s.id !== 'ALL') {
        const count = apps.filter(a => {
          const st = a.status === 'APPROVED' ? 'ACCEPTED' : a.status
          return st === s.id
        }).length
        counts[s.id] = count
      }
    })
    return counts
  }, [apps])

  // Filtered Applications List
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const normalizedStatus = app.status === 'APPROVED' ? 'ACCEPTED' : app.status
      const matchesStage = filterStage === 'ALL' || normalizedStatus === filterStage
      const cat = (app.form_definitions?.category || app.type || '').toUpperCase()
      const matchesCategory = filterCategory === 'ALL' || cat.includes(filterCategory)

      const subData = app.data || app.form_data || {}
      const name = (subData.Name || subData['Full Name'] || subData.name || app.name || '').toLowerCase()
      const email = (app.email || subData.Email || subData['Email Address'] || subData.email || '').toLowerCase()
      const title = (app.form_definitions?.title || app.type || '').toLowerCase()

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase()) ||
        title.includes(search.toLowerCase())

      return matchesStage && matchesCategory && matchesSearch
    })
  }, [apps, filterStage, filterCategory, search])

  const getStatusBadge = (status) => {
    const normalized = status === 'APPROVED' ? 'ACCEPTED' : status
    const stage = PIPELINE_STAGES.find(s => s.id === normalized)
    return stage?.color || 'text-slate-500 bg-slate-500/10 border-slate-500/20'
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <UserPlus size={22} weight="duotone" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-dynamic">Applicants Pipeline & Review Hub</h2>
          </div>
          <p className="text-auto-secondary text-sm">
            Holistic applicant tracking, multi-stage progression, Task Bank assignments, and empathetic candidate communication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplications}
            className="glass border border-border px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest text-auto-secondary hover:text-primary transition-all flex items-center gap-2"
          >
            <ArrowsClockwise size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Interactive Kanban / Stage Navigator */}
      <div className="glass p-3 rounded-[2rem] border border-border dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {PIPELINE_STAGES.map(stage => {
            const count = stageCounts[stage.id] || 0
            const isSelected = filterStage === stage.id
            return (
              <button
                key={stage.id}
                onClick={() => setFilterStage(stage.id)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-bg-secondary dark:bg-white/5 text-auto-tertiary border-border/50 hover:border-primary/40'
                }`}
              >
                <span>{stage.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-auto-tertiary'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-bg-secondary dark:bg-white/5 px-4 py-3 rounded-2xl border border-border/50 flex-1 max-w-md">
          <Search size={18} className="text-auto-tertiary" />
          <input
            type="text"
            placeholder="Search candidate name, email, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none text-xs font-bold w-full outline-none placeholder:text-auto-tertiary/60"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'VOLUNTEER', 'ORGANIZATION', 'AMBASSADOR'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                filterCategory === cat
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-bg-secondary dark:bg-white/5 text-auto-tertiary border-border/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass p-6 rounded-[2rem] border border-border animate-pulse space-y-4">
              <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/3" />
              <div className="h-6 bg-black/10 dark:bg-white/10 rounded w-3/4" />
              <div className="h-10 bg-black/5 dark:bg-white/5 rounded w-full" />
            </div>
          ))
        ) : filteredApps.length > 0 ? (
          filteredApps.map(app => {
            const subData = app.data || app.form_data || {}
            const name = subData.Name || subData['Full Name'] || subData.name || app.name || 'Anonymous Applicant'
            const email = app.email || subData.Email || subData['Email Address'] || subData.email || 'No email provided'
            const roleTitle = app.form_definitions?.title || app.type || 'Join Us Intake'
            const normalizedStatus = app.status === 'APPROVED' ? 'ACCEPTED' : app.status
            const badgeClass = getStatusBadge(normalizedStatus)

            return (
              <div
                key={app.id}
                onClick={() => openAppDetails(app)}
                className="glass p-6 rounded-[2rem] border border-border dark:border-white/10 space-y-5 hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 truncate max-w-[180px]">
                      {roleTitle}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${badgeClass}`}>
                      {PIPELINE_LABELS[normalizedStatus] || normalizedStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-dynamic tracking-tight group-hover:text-primary transition-colors">
                      {name}
                    </h3>
                    <p className="text-xs text-auto-secondary font-medium truncate flex items-center gap-1 mt-0.5">
                      <Mail size={12} className="text-auto-tertiary" /> {email}
                    </p>
                  </div>

                  {/* Submission date */}
                  <div className="text-[10px] text-auto-tertiary flex items-center gap-1 font-mono">
                    <Calendar size={12} />
                    <span>{new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {/* Mini Pipeline Preview */}
                  <div className="pt-2">
                    <PipelineTracker status={app.status} />
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Review Profile & Actions</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-[3rem] border border-dashed border-border space-y-3">
            <UserPlus size={48} className="mx-auto text-primary opacity-30" />
            <h3 className="text-lg font-bold">No candidates found</h3>
            <p className="text-xs text-auto-tertiary">Try changing the stage filter or clearing your search.</p>
          </div>
        )}
      </div>

      {/* Candidate Profile & Stage Action Drawer */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 md:p-10 max-w-3xl w-full border border-border dark:border-white/10 shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer Top Bar */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                    {selectedApp.form_definitions?.title || selectedApp.type || 'Role'}
                  </span>
                  <h2 className="text-2xl font-black text-dynamic tracking-tight mt-2">
                    {selectedApp.data?.Name || selectedApp.data?.['Full Name'] || selectedApp.name || 'Candidate'}
                  </h2>
                  <p className="text-xs text-auto-secondary flex items-center gap-1.5">
                    <Mail size={14} /> {selectedApp.email || selectedApp.data?.Email || selectedApp.data?.email || 'N/A'}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-auto-tertiary"
                >
                  ✕
                </button>
              </div>

              {/* Full Stage Pipeline Tracker */}
              <div className="p-6 bg-bg-secondary dark:bg-white/5 rounded-3xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                    Current Candidate Stage
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${getStatusBadge(selectedApp.status)}`}>
                    {PIPELINE_LABELS[selectedApp.status === 'APPROVED' ? 'ACCEPTED' : selectedApp.status] || selectedApp.status}
                  </span>
                </div>
                <PipelineTracker status={selectedApp.status} />
              </div>

              {/* Quick Action Matrix: Send to Next Stage or Reject */}
              <div className="p-6 bg-[#E8F4F8] dark:bg-white/5 rounded-3xl border border-[#D4EBF2] dark:border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#0D3D52] dark:text-white flex items-center gap-2">
                    <Sparkle size={14} className="text-primary" /> Stage Actions & Automated Email Dispatch
                  </h4>
                  <span className="text-[10px] text-auto-tertiary">Select next stage to trigger</span>
                </div>

                {/* Stage Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    disabled={processingStatus}
                    onClick={() => updateStatus('REVIEWED')}
                    className={`py-3 px-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                      selectedApp.status === 'REVIEWED'
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                        : 'bg-white dark:bg-white/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/40 hover:bg-cyan-50'
                    }`}
                  >
                    {processingStatus === 'REVIEWED' ? <Loader2 size={12} className="animate-spin" /> : '1. Reviewed'}
                  </button>

                  <button
                    disabled={processingStatus}
                    onClick={() => updateStatus('ACCEPTED')}
                    className={`py-3 px-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                      selectedApp.status === 'ACCEPTED' || selectedApp.status === 'APPROVED'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-white dark:bg-white/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40 hover:bg-purple-50'
                    }`}
                  >
                    {processingStatus === 'ACCEPTED' ? <Loader2 size={12} className="animate-spin" /> : '2. Shortlist'}
                  </button>

                  <button
                    disabled={processingStatus}
                    onClick={() => updateStatus('TASK_ASSIGNED')}
                    className={`py-3 px-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                      selectedApp.status === 'TASK_ASSIGNED'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white dark:bg-white/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40 hover:bg-indigo-50'
                    }`}
                  >
                    {processingStatus === 'TASK_ASSIGNED' ? <Loader2 size={12} className="animate-spin" /> : '3. Assign Task'}
                  </button>

                  <button
                    disabled={processingStatus}
                    onClick={() => updateStatus('INTERVIEW')}
                    className={`py-3 px-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                      selectedApp.status === 'INTERVIEW'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white dark:bg-white/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40 hover:bg-blue-50'
                    }`}
                  >
                    {processingStatus === 'INTERVIEW' ? <Loader2 size={12} className="animate-spin" /> : '4. Interview'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    disabled={processingStatus}
                    onClick={() => updateStatus('ONBOARDED')}
                    className={`py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                      selectedApp.status === 'ONBOARDED'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20'
                        : 'bg-white dark:bg-white/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900/40 hover:bg-emerald-50'
                    }`}
                  >
                    {processingStatus === 'ONBOARDED' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    5. Mark as Onboarded
                  </button>

                  <button
                    disabled={processingStatus}
                    onClick={() => {
                      if (confirm(`Are you sure you want to send an empathetic disposition note to ${selectedApp.data?.Name || 'this candidate'}?`)) {
                        updateStatus('REJECTED')
                      }
                    }}
                    className={`py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                      selectedApp.status === 'REJECTED'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/20'
                        : 'bg-white dark:bg-white/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-900/40 hover:bg-rose-50'
                    }`}
                  >
                    {processingStatus === 'REJECTED' ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={16} />}
                    Respectful Disposition (Reject)
                  </button>
                </div>

                {/* Stage Dynamic Parameter Configuration */}
                <div className="p-4 bg-white/60 dark:bg-black/40 rounded-2xl border border-[#D4EBF2] dark:border-white/10 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#16556D] dark:text-cyan-400 block">
                    Dynamic Parameter Overrides for Outgoing Email
                  </span>

                  {/* Task Bank Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-auto-tertiary uppercase">Select Task Brief</label>
                      <select
                        value={selectedTaskSlug}
                        onChange={e => setSelectedTaskSlug(e.target.value)}
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-xl px-3 py-2 text-xs font-bold text-dynamic outline-none"
                      >
                        <option value="">General Task Bank Portal (/tasks)</option>
                        {tasks.map(t => (
                          <option key={t.id} value={t.slug}>{t.title} ({t.category})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-auto-tertiary uppercase">Task Deadline Wording</label>
                      <input
                        type="text"
                        value={taskDeadline}
                        onChange={e => setTaskDeadline(e.target.value)}
                        placeholder="e.g. 7 days from assignment / Oct 15"
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-xl px-3 py-2 text-xs font-bold text-dynamic outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-auto-tertiary uppercase">Interview Booking URL</label>
                      <input
                        type="url"
                        value={schedulingUrl}
                        onChange={e => setSchedulingUrl(e.target.value)}
                        placeholder="https://cal.com/min-nepal/interview"
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-xl px-3 py-2 text-xs font-mono font-bold text-dynamic outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-auto-tertiary uppercase">Assigned Buddy Name</label>
                      <input
                        type="text"
                        value={buddyName}
                        onChange={e => setBuddyName(e.target.value)}
                        placeholder="e.g. Rajan Shrestha"
                        className="w-full bg-white dark:bg-white/10 border border-border rounded-xl px-3 py-2 text-xs font-bold text-dynamic outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Form Answers */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-auto-tertiary">
                  Application Submission Data
                </h4>
                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto p-4 bg-bg-secondary dark:bg-white/5 rounded-3xl border border-border">
                  {Object.entries(selectedApp.data || selectedApp.form_data || {}).map(([key, val]) => {
                    const isLink = typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))
                    return (
                      <div key={key} className="p-3.5 bg-white dark:bg-white/5 rounded-2xl border border-border space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-auto-tertiary block">
                          {key}
                        </span>
                        {isLink ? (
                          <a
                            href={val}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 break-all"
                          >
                            <ExternalLink size={14} /> Open Document / Link
                          </a>
                        ) : (
                          <p className="text-xs font-medium text-dynamic whitespace-pre-wrap leading-relaxed">
                            {String(val || 'N/A')}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Reviewer Internal Notes */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary flex items-center gap-1.5">
                  <MessageSquare size={14} /> Internal Reviewer Notes (Private to HR/Admins)
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Record evaluation insights, rating, strengths, or interview notes..."
                  className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl p-4 text-xs font-medium leading-relaxed text-dynamic outline-none focus:border-primary transition-all resize-y shadow-inner"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
