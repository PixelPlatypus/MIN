import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import {
  Clock,
  ArrowLeft,
  CheckCircle,
  FileText,
  Link as LinkIcon,
  Sparkle,
  ArrowSquareOut,
  ShieldCheck
} from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: task } = await supabase
    .from('tasks')
    .select('title, description')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!task) return { title: 'Task Not Found — MIN Nepal' }

  return {
    title: `${task.title} — MIN Task Bank`,
    description: task.description || 'Practical selection task for Mathematics Initiatives in Nepal'
  }
}

export default async function TaskDetailPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: task, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !task) {
    notFound()
  }

  const rawDescHtml = task.description ? marked.parse(task.description) : ''
  const cleanDescHtml = sanitizeHtml(rawDescHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'h4', 'img', 'table', 'tbody', 'tr', 'td', 'th'])
  })

  return (
    <div className="min-h-screen bg-bg-dynamic text-dynamic pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Back Link */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-auto-tertiary hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to All Task Briefs
        </Link>

        {/* Task Card Header */}
        <div className="glass p-8 md:p-10 rounded-[3rem] border border-border dark:border-white/10 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-wider">
              {task.category}
            </span>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-auto-tertiary">
              <span>Difficulty: {task.difficulty || 'Intermediate'}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-dynamic tracking-tight leading-tight">
            {task.title}
          </h1>

          {/* Prominent Mentioned Deadline Bar */}
          <div className="p-5 bg-[#E8F4F8] dark:bg-white/5 rounded-2xl border border-[#D4EBF2] dark:border-white/10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                <Clock size={20} weight="bold" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary block">
                  Submission Deadline
                </span>
                <span className="text-sm font-black text-[#0D3D52] dark:text-white">
                  {task.deadline_type === 'fixed' && task.deadline_date
                    ? new Date(task.deadline_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                    : `${task.duration_days || 7} Days from when this task is assigned to you`}
                </span>
              </div>
            </div>

            {task.task_type === 'link' && task.external_url && (
              <a
                href={task.external_url}
                target="_blank"
                rel="noreferrer"
                className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <ArrowSquareOut size={16} weight="bold" />
                Open External Google Doc
              </a>
            )}
          </div>
        </div>

        {/* Task Details & Content */}
        <div className="glass p-8 md:p-10 rounded-[3rem] border border-border dark:border-white/10 space-y-8 shadow-sm">
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-dynamic tracking-tight">
              1. Project Overview & Requirements
            </h2>
            <div
              className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-auto-secondary"
              dangerouslySetInnerHTML={{ __html: cleanDescHtml }}
            />
          </div>

          {/* Expected Deliverables */}
          {task.deliverables && (
            <div className="space-y-4 pt-6 border-t border-border/60">
              <h2 className="text-xl font-black text-dynamic tracking-tight flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                2. Expected Deliverables
              </h2>
              <div className="p-6 bg-bg-secondary dark:bg-white/5 rounded-2xl border border-border text-xs leading-relaxed font-mono whitespace-pre-wrap text-dynamic">
                {task.deliverables}
              </div>
            </div>
          )}

          {/* Guidelines */}
          {task.guidelines && (
            <div className="space-y-4 pt-6 border-t border-border/60">
              <h2 className="text-xl font-black text-dynamic tracking-tight flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary" />
                3. Evaluation & Submission Guidelines
              </h2>
              <div className="p-6 bg-[#E8F4F8]/50 dark:bg-white/5 rounded-2xl border border-[#D4EBF2] dark:border-white/10 text-xs leading-relaxed font-mono whitespace-pre-wrap text-dynamic">
                {task.guidelines}
              </div>
            </div>
          )}

          {/* Submission Guidance Callout */}
          <div className="pt-6 border-t border-border/60 p-6 sm:p-8 bg-[#E8F4F8] dark:bg-white/5 rounded-3xl border border-[#D4EBF2] dark:border-white/10 space-y-4">
            <div>
              <h4 className="text-base font-black text-[#0D3D52] dark:text-white">🚀 How to Submit Your Completed Task</h4>
              <p className="text-xs text-auto-secondary mt-1">
                You can deliver your solution materials (Google Docs link, GitHub repository, Figma project, or PDF document) through either of these two methods:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-[#D4EBF2] dark:border-white/10 space-y-1">
                <span className="text-xs font-black text-primary uppercase tracking-wider block">1. Direct Email Reply</span>
                <p className="text-[11px] text-auto-secondary leading-relaxed">
                  Reply directly to your task invitation email (<strong className="text-dynamic">website@mathsinitiatives.org.np</strong>) with your project link or attachments.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-[#D4EBF2] dark:border-white/10 space-y-1">
                <span className="text-xs font-black text-primary uppercase tracking-wider block">2. MIN Communication Channel</span>
                <p className="text-[11px] text-auto-secondary leading-relaxed">
                  If you have been invited to our team <strong className="text-dynamic">Discord, Slack, or Telegram workspace</strong>, submit directly in the <strong className="text-primary">#task-submissions</strong> channel.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/tasks"
                className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider text-center hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
              >
                Browse Other Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
