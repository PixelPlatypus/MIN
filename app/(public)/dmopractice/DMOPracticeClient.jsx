'use client'
import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  ListNumbers as ListOrdered, 
  CaretRight as ChevronRight, 
  ArrowRight,
  ShieldCheck,
  ClockCounterClockwise as History,
  CaretDown as ChevronDown,
  YoutubeLogo,
  Trophy,
  Target,
  Lightning,
  Percent,
  CheckCircle,
  XCircle,
  Flame,
} from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/Skeleton'
import PageHero from '@/components/public/PageHero'

function MathText({ text, className = '' }) {
  if (!text) return null
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
        if (part.startsWith('$') && part.endsWith('$')) return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

// CSS float (compositor thread) instead of an infinite framer loop per symbol; fixed per-index
// delays also avoid Math.random() in render, which differed between server and client.
function FloatingSymbol({ symbol, style, index }) {
  return (
    <span
      aria-hidden
      className="absolute select-none pointer-events-none font-black text-primary/[0.07] dark:text-secondary/[0.07] animate-float-glyph"
      style={{ ...style, animationDelay: `${(index * 0.7) % 3}s`, animationDuration: `${6 + (index % 3)}s` }}
    >
      {symbol}
    </span>
  )
}

const MATH_SYMBOLS = [
  { symbol: '∑', style: { top: '8%', left: '4%', fontSize: '3.5rem' } },
  { symbol: 'π', style: { top: '18%', left: '91%', fontSize: '4.5rem' } },
  { symbol: '∫', style: { top: '65%', left: '2%', fontSize: '4rem' } },
  { symbol: '√', style: { top: '55%', left: '93%', fontSize: '3.5rem' } },
  { symbol: '∞', style: { top: '82%', left: '12%', fontSize: '3rem' } },
  { symbol: 'Δ', style: { top: '12%', left: '48%', fontSize: '2.5rem' } },
  { symbol: '÷', style: { top: '78%', left: '72%', fontSize: '3rem' } },
  { symbol: 'θ', style: { top: '38%', left: '6%', fontSize: '2.5rem' } },
  { symbol: '≈', style: { top: '32%', left: '89%', fontSize: '3rem' } },
  { symbol: 'α', style: { top: '50%', left: '50%', fontSize: '2rem' } },
]

// Accent tints for the set icons only; card surfaces stay on the brand skin
const CARD_PALETTES = [
  { iconBg: 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary' },
  { iconBg: 'bg-cyan/15 text-primary dark:text-cyan' },
  { iconBg: 'bg-purple/10 text-purple dark:bg-purple/25 dark:text-white' },
  { iconBg: 'bg-green/20 text-primary dark:text-green' },
  { iconBg: 'bg-orange/15 text-primary dark:text-orange' },
  { iconBg: 'bg-coral/15 text-primary dark:text-coral' },
]

function ScoreRing({ pct, size = 44, strokeWidth = 4 }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  // emerald = strong, brand teal/yellow = fair, amber = needs work
  const colorClass = pct >= 80 ? 'text-emerald-500' : pct >= 50 ? 'text-primary-light dark:text-secondary' : 'text-amber-500'
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-primary/10 dark:text-white/10" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={colorClass}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

// Sets and settings arrive from the server page (in the HTML); only exam history is browser-local
export default function DMOPracticeClient({ initialSets = [], initialSettings = null }) {
  const sets = initialSets
  const settings = initialSettings
  const loading = false
  const [history, setHistory] = useState([])
  const [expandedHistory, setExpandedHistory] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('min_exam_history')
    if (saved) {
      setHistory(JSON.parse(saved).sort((a, b) => new Date(b.date) - new Date(a.date)))
    }
  }, [])

  const historyBySet = history.reduce((acc, h) => {
    if (!acc[h.setId]) acc[h.setId] = []
    acc[h.setId].push(h)
    return acc
  }, {})

  const totalQuestions = sets.reduce((a, s) => a + (s.practice_questions?.[0]?.count || 0), 0)
  const avgTime = sets.length ? Math.round(sets.reduce((a, s) => a + s.time_limit, 0) / sets.length) : 0
  const bestPct = history.length ? Math.max(...history.map(h => Math.round((h.score / h.total) * 100))) : null

  return (
    <div className="pb-32 space-y-12 md:space-y-16">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {MATH_SYMBOLS.map((s, i) => <FloatingSymbol key={i} index={i} {...s} />)}
        </div>

        <PageHero
          loading={loading}
          eyebrow={settings?.dmopractice_badge || 'DMO Exam Practice'}
          icon={<ShieldCheck size={15} weight="bold" />}
          title={
            <>
              <span dangerouslySetInnerHTML={{ __html: settings?.dmopractice_title }} />
              {settings?.dmopractice_subtitle && <span> {settings.dmopractice_subtitle}</span>}
            </>
          }
          description={settings?.dmopractice_description}
          className="pb-10 md:pb-12"
        >
          {/* Stats strip */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: <ListOrdered size={14} />, label: 'Sets', value: loading ? '—' : sets.length },
              { icon: <Target size={14} />, label: 'Questions', value: loading ? '—' : totalQuestions },
              { icon: <Clock size={14} />, label: 'Avg Time', value: loading || !sets.length ? '—' : `${avgTime}m` },
              { icon: <Flame size={14} />, label: 'Attempts', value: history.length },
            ].map((s, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="card-brand rounded-2xl flex items-center gap-2.5 px-5 py-3"
              >
                <span className="text-primary dark:text-secondary">{s.icon}</span>
                <span className="text-xl font-black tabular-nums">{s.value}</span>
                <span className="text-xs text-auto-tertiary font-bold tracking-wide">{s.label}</span>
              </m.div>
            ))}
          </div>
        </PageHero>
      </div>

      {/* ── Main Grid ────────────────────────────────────── */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">

          {/* Practice Sets */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Available Mock Exams</h2>
              <div className="h-px flex-1 min-w-4 bg-gradient-to-r from-primary/20 to-transparent dark:from-white/15" />
              {!loading && sets.length > 0 && (
                <span className="eyebrow shrink-0">
                  {sets.length} Set{sets.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(n => <div key={n} className="h-64 card-brand animate-pulse rounded-[2.5rem]" />)}
              </div>
            ) : sets.length === 0 ? (
              <div className="card-brand rounded-[2.5rem] border-dashed py-28 px-6 text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center text-primary/40 dark:text-secondary/50">
                  <Calculator size={40} />
                </div>
                <p className="text-xl font-bold text-auto-tertiary">New practice sets coming soon!</p>
                <p className="text-sm text-auto-tertiary opacity-80 max-w-xs">Our team is preparing new DMO mock exams. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sets.map((set, i) => {
                  const pal = CARD_PALETTES[i % CARD_PALETTES.length]
                  const setHistory = historyBySet[set.id] || []
                  const bestAttempt = setHistory.length
                    ? setHistory.reduce((best, h) => (h.score / h.total) > (best.score / best.total) ? h : best, setHistory[0])
                    : null
                  const bestPctSet = bestAttempt ? Math.round((bestAttempt.score / bestAttempt.total) * 100) : null
                  const qCount = set.practice_questions?.[0]?.count || 0

                  return (
                    <m.div
                      key={set.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, type: 'spring', stiffness: 220, damping: 20 }}
                      className="group h-full"
                    >
                      <Link href={`/dmopractice/${set.id}`} className="block h-full">
                        <div className="card-brand card-brand-hover relative h-full p-7 rounded-[2.5rem] overflow-hidden flex flex-col justify-between">

                          {/* Glow orb */}
                          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-secondary/0 blur-[60px] group-hover:bg-secondary/30 dark:group-hover:bg-secondary/10 transition-colors duration-700 pointer-events-none" />

                          {/* Index badge */}
                          <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10 flex items-center justify-center font-black text-auto-tertiary text-sm">
                            {String(i + 1).padStart(2, '0')}
                          </div>

                          <div className="space-y-4 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${pal.iconBg}`}>
                              <Calculator size={22} weight="bold" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black tracking-tight leading-tight pr-12">{set.name}</h3>
                              <div className="flex flex-wrap gap-3 mt-3">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-auto-tertiary">
                                  <Clock size={12} className="text-primary dark:text-secondary" /> {set.time_limit} min
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-auto-tertiary">
                                  <ListOrdered size={12} className="text-primary dark:text-secondary" /> {qCount} Q{qCount !== 1 ? 's' : ''}
                                </span>
                                {setHistory.length > 0 && (
                                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300">
                                    <Flame size={12} /> {setHistory.length} attempt{setHistory.length > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between pt-6 relative z-10">
                            {bestPctSet !== null ? (
                              <div className="flex items-center gap-3">
                                <ScoreRing pct={bestPctSet} size={44} strokeWidth={4} />
                                <div>
                                  <p className="text-sm font-black text-dynamic leading-tight">{bestPctSet}%</p>
                                  <p className="text-[11px] text-auto-tertiary font-semibold">Best Score</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-auto-tertiary opacity-70">
                                <Target size={11} /> Not attempted
                              </div>
                            )}

                            <span className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary dark:text-secondary dark:bg-secondary/10 dark:border-secondary/25 dark:group-hover:bg-secondary dark:group-hover:text-primary-dark transition-all duration-300 shrink-0">
                              Start <ArrowRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </m.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight whitespace-nowrap">Your Progress</h2>
              <div className="h-px flex-1 min-w-4 bg-gradient-to-r from-primary/20 to-transparent dark:from-white/15" />
            </div>

            {/* Summary cards */}
            {history.length > 0 && (
              <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                <div className="card-brand rounded-2xl p-4 text-center space-y-1">
                  <p className="text-2xl font-black text-primary dark:text-secondary tabular-nums">{history.length}</p>
                  <p className="text-[11px] text-auto-tertiary font-semibold">Attempts</p>
                </div>
                <div className="card-brand rounded-2xl p-4 text-center space-y-1">
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{bestPct ?? 0}%</p>
                  <p className="text-[11px] text-auto-tertiary font-semibold">Best Score</p>
                </div>
                <div className="col-span-2 bg-primary dark:bg-secondary p-4 rounded-2xl text-white dark:text-primary-dark text-center shadow-xl shadow-primary/20 dark:shadow-black/20">
                  <p className="text-3xl font-black tabular-nums">{history.reduce((a,b) => a + b.score, 0)}</p>
                  <p className="text-[11px] font-semibold opacity-80 mt-0.5">Total Marks Earned</p>
                </div>
              </m.div>
            )}

            {/* History */}
            <div className="card-brand p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-secondary/50 text-primary-dark dark:bg-secondary/15 dark:text-secondary flex items-center justify-center">
                    <History size={16} />
                  </div>
                  <h4 className="text-sm font-black text-dynamic">Recent Attempts</h4>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all practice history? This cannot be undone.')) {
                        localStorage.removeItem('min_exam_history')
                        setHistory([])
                      }
                    }}
                    className="text-[11px] font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-500/25"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {history.slice(0, 5).map((entry, idx) => {
                  const pct = Math.round((entry.score / entry.total) * 100)
                  return (
                    <div key={idx} className="rounded-2xl bg-primary/[0.03] dark:bg-white/5 border border-primary/10 dark:border-white/10 overflow-hidden">
                      <button
                        onClick={() => setExpandedHistory(expandedHistory === idx ? null : idx)}
                        className="w-full flex items-center gap-3 p-3.5 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors text-left"
                      >
                        <ScoreRing pct={pct} size={40} strokeWidth={3.5} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate leading-tight">{entry.setName}</p>
                          <p className="text-[11px] text-auto-tertiary font-semibold mt-0.5">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-primary dark:text-secondary leading-tight tabular-nums">{pct}%</p>
                          <p className="text-[11px] text-auto-tertiary font-bold">{entry.score}/{entry.total}</p>
                        </div>
                        <ChevronDown size={13} className={`text-auto-tertiary transition-transform shrink-0 ${expandedHistory === idx ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {expandedHistory === idx && (
                          <m.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-primary/10 dark:border-white/10 bg-primary/[0.03] dark:bg-white/5 p-4 space-y-3"
                          >
                            {entry.wrongAnswers && entry.wrongAnswers.length > 0 ? (
                              <>
                                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-300 flex items-center gap-1.5">
                                  <XCircle size={11} /> {entry.wrongAnswers.length} Incorrect
                                </p>
                                {entry.wrongAnswers.slice(0, 3).map((w, i) => (
                                  <div key={i} className="text-xs p-3 rounded-xl bg-white/80 dark:bg-white/5 border border-rose-500/20 space-y-1">
                                    <div className="font-semibold text-dynamic line-clamp-2"><MathText text={w.text} /></div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold">
                                      <span className="text-rose-600 dark:text-rose-300">You: {w.userAnswer || 'None'}</span>
                                      <span className="text-emerald-600 dark:text-emerald-400">Correct: {w.correctAnswer}</span>
                                    </div>
                                    {w.youtube_url && (
                                      <a href={w.youtube_url} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary dark:text-secondary hover:underline pt-0.5"
                                      >
                                        <YoutubeLogo size={11} className="text-rose-500" /> Watch Explanation
                                      </a>
                                    )}
                                  </div>
                                ))}
                                {entry.wrongAnswers.length > 3 && (
                                  <p className="text-[11px] text-auto-tertiary font-bold text-center">+{entry.wrongAnswers.length - 3} more</p>
                                )}
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle size={13} weight="bold" />
                                <p className="text-xs font-bold">Perfect score — no mistakes!</p>
                              </div>
                            )}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}

                {history.length === 0 && (
                  <div className="py-10 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-primary/5 dark:bg-white/5 flex items-center justify-center mx-auto text-primary/30 dark:text-secondary/70">
                      <Trophy size={28} />
                    </div>
                    <p className="text-xs font-bold text-auto-tertiary">No attempts yet</p>
                    <p className="text-xs text-auto-tertiary opacity-80 max-w-[200px] mx-auto leading-relaxed">
                      Complete a practice set to start tracking your progress here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="card-brand p-6 space-y-4 border-secondary-dark/40 bg-secondary-light/70 dark:border-secondary/25 dark:bg-secondary/5">
              <div className="flex items-center gap-2.5">
                <Lightning size={15} weight="fill" className="text-primary dark:text-secondary" />
                <h5 className="text-sm font-black text-primary dark:text-secondary">Exam Tips</h5>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Switching tabs auto-submits your exam',
                  'A scientific calculator is available inside',
                  'Your history is stored locally — private to you',
                  'Unanswered questions show a warning before submit',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-auto-secondary">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i+1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}