import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createPublicClient } from '@/lib/supabase/server'
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


// Empty list = render each slug on first visit, then cache (ISR).
export async function generateStaticParams() { return [] }

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = createPublicClient()
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
  const supabase = createPublicClient()
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
    <div className="relative isolate min-h-screen text-dynamic pt-36 md:pt-40 pb-24 px-6 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[36rem] -z-10 hero-glow pointer-events-none" />
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Back Link */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-sm font-bold text-auto-tertiary hover:text-primary dark:hover:text-secondary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to All Task Briefs
        </Link>

        {/* Task Card Header */}
        <div className="card-brand rounded-[2.5rem] p-6 sm:p-8 md:p-10 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="eyebrow">
              {task.category}
            </span>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-auto-tertiary">
              <span>Difficulty: {task.difficulty || 'Intermediate'}</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-[1.05] text-gradient-brand pb-1 break-words">
            {task.title}
          </h1>

          {/* Prominent Mentioned Deadline Bar */}
          <div className="p-5 panel-brand-tint flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white dark:bg-secondary dark:text-primary-dark flex items-center justify-center shadow-md shrink-0">
                <Clock size={20} weight="bold" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wide text-auto-tertiary block">
                  Submission Deadline
                </span>
                <span className="text-sm font-bold text-primary-dark dark:text-white">
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
                className="btn-brand btn-brand-sm"
              >
                <ArrowSquareOut size={16} weight="bold" />
                Open External Google Doc
              </a>
            )}
          </div>
        </div>

        {/* Task Details & Content */}
        <div className="card-brand rounded-[2.5rem] p-6 sm:p-8 md:p-10 space-y-8">
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-dynamic tracking-tight">
              1. Project Overview & Requirements
            </h2>
            <div
              className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-auto-secondary prose-a:text-primary dark:prose-a:text-secondary prose-headings:tracking-tight"
              dangerouslySetInnerHTML={{ __html: cleanDescHtml }}
            />
          </div>

          {/* Expected Deliverables */}
          {task.deliverables && (
            <div className="space-y-4 pt-6 border-t border-primary/10 dark:border-white/10">
              <h2 className="text-xl font-black text-dynamic tracking-tight flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                2. Expected Deliverables
              </h2>
              <div className="p-6 panel-brand-tint text-xs leading-relaxed font-mono whitespace-pre-wrap break-words text-dynamic">
                {task.deliverables}
              </div>
            </div>
          )}

          {/* Guidelines */}
          {task.guidelines && (
            <div className="space-y-4 pt-6 border-t border-primary/10 dark:border-white/10">
              <h2 className="text-xl font-black text-dynamic tracking-tight flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary dark:text-secondary shrink-0" />
                3. Evaluation & Submission Guidelines
              </h2>
              <div className="p-6 panel-brand-tint text-xs leading-relaxed font-mono whitespace-pre-wrap break-words text-dynamic">
                {task.guidelines}
              </div>
            </div>
          )}

          {/* Submission Guidance Callout */}
          <div className="p-6 sm:p-8 bg-secondary/25 dark:bg-white/5 rounded-3xl border border-secondary-dark/30 dark:border-secondary/20 space-y-4">
            <div>
              <h4 className="text-base font-black text-primary-dark dark:text-white">🚀 How to Submit Your Completed Task</h4>
              <p className="text-xs text-auto-secondary mt-1">
                You can deliver your solution materials (Google Docs link, GitHub repository, Figma project, or PDF document) through either of these two methods:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/80 dark:bg-white/5 rounded-2xl border border-primary/10 dark:border-white/10 space-y-1">
                <span className="text-xs font-black text-primary dark:text-secondary tracking-wide block">1. Direct Email Reply</span>
                <p className="text-[11px] text-auto-secondary leading-relaxed">
                  Reply directly to your task invitation email (<strong className="text-dynamic break-all">website@mathsinitiatives.org.np</strong>) with your project link or attachments.
                </p>
              </div>

              <div className="p-4 bg-white/80 dark:bg-white/5 rounded-2xl border border-primary/10 dark:border-white/10 space-y-1">
                <span className="text-xs font-black text-primary dark:text-secondary tracking-wide block">2. MIN Communication Channel</span>
                <p className="text-[11px] text-auto-secondary leading-relaxed">
                  If you have been invited to our team <strong className="text-dynamic">Discord, Slack, or Telegram workspace</strong>, submit directly in the <strong className="text-primary dark:text-secondary">#task-submissions</strong> channel.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/tasks"
                className="btn-brand btn-brand-sm"
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
