'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

function FloatingSymbol({ symbol, style }) {
  return (
    <motion.span
      className="absolute select-none pointer-events-none font-black text-primary/[0.07] dark:text-primary/[0.06]"
      style={style}
      animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
    >
      {symbol}
    </motion.span>
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

const CARD_PALETTES = [
  { gradient: 'from-blue-500/8 to-indigo-500/4', iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', ring: 'group-hover:shadow-blue-500/15' },
  { gradient: 'from-violet-500/8 to-purple-500/4', iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400', ring: 'group-hover:shadow-violet-500/15' },
  { gradient: 'from-emerald-500/8 to-teal-500/4', iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', ring: 'group-hover:shadow-emerald-500/15' },
  { gradient: 'from-amber-500/8 to-orange-500/4', iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', ring: 'group-hover:shadow-amber-500/15' },
  { gradient: 'from-rose-500/8 to-pink-500/4', iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400', ring: 'group-hover:shadow-rose-500/15' },
  { gradient: 'from-cyan-500/8 to-sky-500/4', iconBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400', ring: 'group-hover:shadow-cyan-500/15' },
]

function ScoreRing({ pct, size = 44, strokeWidth = 4 }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#3b82f6' : '#f97316'
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-black/8 dark:text-white/8" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

export default function DMOPracticePage() {
  const [sets, setSets] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState([])
  const [expandedHistory, setExpandedHistory] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/practice/sets').then(res => res.json()),
      fetch('/api/settings').then(res => res.json()).catch(() => ({}))
    ])
    .then(([setsData, settingsData]) => {
      setSets(setsData)
      setSettings(settingsData)
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false))

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
    <div className="pt-28 pb-32 space-y-20">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="container mx-auto px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {MATH_SYMBOLS.map((s, i) => <FloatingSymbol key={i} {...s} />)}
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border border-primary/20"
          >
            <ShieldCheck size={15} weight="bold" />
            {loading ? <Skeleton className="w-32 h-3" /> : (settings?.dmopractice_badge || 'DMO Exam Practice')}
          </motion.div>

          <div className="space-y-6">
            {loading ? (
              <Skeleton className="w-[70%] h-24 mx-auto" />
            ) : (
              <motion.h1
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-gradient"
              >
                <span dangerouslySetInnerHTML={{ __html: settings?.dmopractice_title }} />
                {settings?.dmopractice_subtitle && (
                  <span className="text-primary dark:text-secondary"> {settings.dmopractice_subtitle}</span>
                )}
              </motion.h1>
            )}
            <div className="max-w-2xl mx-auto">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" /><Skeleton className="w-5/6 h-4 mx-auto" />
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl text-auto-secondary leading-relaxed font-medium"
                >
                  {settings?.dmopractice_description}
                </motion.p>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: <ListOrdered size={14} />, label: 'Sets', value: loading ? '—' : sets.length },
              { icon: <Target size={14} />, label: 'Questions', value: loading ? '—' : totalQuestions },
              { icon: <Clock size={14} />, label: 'Avg Time', value: loading || !sets.length ? '—' : `${avgTime}m` },
              { icon: <Flame size={14} />, label: 'Attempts', value: history.length },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-2.5 glass border border-border dark:border-white/8 px-5 py-3 rounded-2xl shadow-sm"
              >
                <span className="text-primary">{s.icon}</span>
                <span className="text-xl font-black tabular-nums">{s.value}</span>
                <span className="text-[10px] text-auto-tertiary font-black uppercase tracking-widest">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Main Grid ────────────────────────────────────── */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">

          {/* Practice Sets */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tight whitespace-nowrap">Available Mock Exams</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent dark:from-white/10" />
              {!loading && sets.length > 0 && (
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl shrink-0">
                  {sets.length} Set{sets.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(n => <div key={n} className="h-64 glass animate-pulse rounded-[2.5rem]" />)}
              </div>
            ) : sets.length === 0 ? (
              <div className="py-28 text-center glass rounded-[3rem] border border-dashed border-border flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary/30">
                  <Calculator size={40} />
                </div>
                <p className="text-xl font-bold text-auto-tertiary">New practice sets coming soon!</p>
                <p className="text-sm text-auto-tertiary/60 max-w-xs">Our team is preparing new DMO mock exams. Check back soon.</p>
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
                    <motion.div
                      key={set.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, type: 'spring', stiffness: 220, damping: 20 }}
                      className="group"
                    >
                      <Link href={`/dmopractice/${set.id}`}>
                        <div className={`relative h-full p-7 rounded-[2.5rem] border border-border dark:border-white/8 bg-gradient-to-br ${pal.gradient} hover:border-primary/30 transition-all duration-500 hover:shadow-2xl ${pal.ring} hover:-translate-y-2 overflow-hidden flex flex-col justify-between glass`}>

                          {/* Glow orb */}
                          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-primary/5 blur-[60px] group-hover:bg-primary/12 transition-colors duration-700 pointer-events-none" />

                          {/* Index badge */}
                          <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/60 dark:bg-white/5 border border-border/50 flex items-center justify-center font-black text-auto-tertiary text-sm shadow-sm">
                            {String(i + 1).padStart(2, '0')}
                          </div>

                          <div className="space-y-4 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm ${pal.iconBg}`}>
                              <Calculator size={22} weight="bold" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black tracking-tight leading-tight pr-12">{set.name}</h3>
                              <div className="flex flex-wrap gap-3 mt-3">
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                                  <Clock size={11} className="text-primary" /> {set.time_limit} min
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                                  <ListOrdered size={11} className="text-secondary" /> {qCount} Q{qCount !== 1 ? 's' : ''}
                                </span>
                                {setHistory.length > 0 && (
                                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500">
                                    <Flame size={11} /> {setHistory.length} attempt{setHistory.length > 1 ? 's' : ''}
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
                                  <p className="text-[9px] text-auto-tertiary font-bold uppercase tracking-widest">Best Score</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-auto-tertiary/50">
                                <Target size={11} /> Not attempted
                              </div>
                            )}

                            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shrink-0">
                              Start <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tight whitespace-nowrap">Your Journey</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent dark:from-white/10" />
            </div>

            {/* Summary cards */}
            {history.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
                <div className="glass p-4 rounded-2xl border border-border dark:border-white/8 text-center space-y-1">
                  <p className="text-2xl font-black text-primary tabular-nums">{history.length}</p>
                  <p className="text-[9px] text-auto-tertiary font-black uppercase tracking-widest">Attempts</p>
                </div>
                <div className="glass p-4 rounded-2xl border border-border dark:border-white/8 text-center space-y-1">
                  <p className="text-2xl font-black text-emerald-500 tabular-nums">{bestPct ?? 0}%</p>
                  <p className="text-[9px] text-auto-tertiary font-black uppercase tracking-widest">Best Score</p>
                </div>
                <div className="col-span-2 bg-gradient-to-r from-primary to-secondary p-4 rounded-2xl text-white text-center shadow-xl shadow-primary/20">
                  <p className="text-3xl font-black tabular-nums">{history.reduce((a,b) => a + b.score, 0)}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-75 mt-0.5">Total Marks Earned</p>
                </div>
              </motion.div>
            )}

            {/* History */}
            <div className="glass p-6 rounded-[2rem] border border-border dark:border-white/8 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
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
                    className="text-[9px] font-black uppercase tracking-widest text-coral hover:bg-coral/10 px-2.5 py-1.5 rounded-lg transition-colors border border-coral/20"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {history.slice(0, 5).map((entry, idx) => {
                  const pct = Math.round((entry.score / entry.total) * 100)
                  return (
                    <div key={idx} className="rounded-2xl bg-bg-secondary/60 dark:bg-white/5 border border-border/50 overflow-hidden">
                      <button
                        onClick={() => setExpandedHistory(expandedHistory === idx ? null : idx)}
                        className="w-full flex items-center gap-3 p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                      >
                        <ScoreRing pct={pct} size={40} strokeWidth={3.5} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate leading-tight">{entry.setName}</p>
                          <p className="text-[9px] text-auto-tertiary font-bold uppercase mt-0.5">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-primary leading-tight tabular-nums">{pct}%</p>
                          <p className="text-[9px] text-auto-tertiary font-bold">{entry.score}/{entry.total}</p>
                        </div>
                        <ChevronDown size={13} className={`text-auto-tertiary transition-transform shrink-0 ${expandedHistory === idx ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {expandedHistory === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border/50 bg-black/5 dark:bg-white/5 p-4 space-y-3"
                          >
                            {entry.wrongAnswers && entry.wrongAnswers.length > 0 ? (
                              <>
                                <p className="text-[9px] font-black uppercase tracking-widest text-coral flex items-center gap-1.5">
                                  <XCircle size={11} /> {entry.wrongAnswers.length} Incorrect
                                </p>
                                {entry.wrongAnswers.slice(0, 3).map((w, i) => (
                                  <div key={i} className="text-xs p-3 rounded-xl bg-white dark:bg-[#111] border border-coral/15 space-y-1">
                                    <div className="font-semibold text-dynamic line-clamp-2"><MathText text={w.text} /></div>
                                    <div className="flex items-center gap-3 text-[9px] font-bold">
                                      <span className="text-coral">You: {w.userAnswer || 'None'}</span>
                                      <span className="text-emerald-500">Correct: {w.correctAnswer}</span>
                                    </div>
                                    {w.youtube_url && (
                                      <a href={w.youtube_url} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary hover:underline pt-0.5"
                                      >
                                        <YoutubeLogo size={11} className="text-rose-500" /> Watch Explanation
                                      </a>
                                    )}
                                  </div>
                                ))}
                                {entry.wrongAnswers.length > 3 && (
                                  <p className="text-[9px] text-auto-tertiary font-bold text-center">+{entry.wrongAnswers.length - 3} more</p>
                                )}
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-emerald-500">
                                <CheckCircle size={13} weight="bold" />
                                <p className="text-xs font-bold">Perfect score — no mistakes!</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}

                {history.length === 0 && (
                  <div className="py-10 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto text-auto-tertiary/25">
                      <Trophy size={28} />
                    </div>
                    <p className="text-xs font-bold text-auto-tertiary">No attempts yet</p>
                    <p className="text-[10px] text-auto-tertiary/60 max-w-[180px] mx-auto leading-relaxed">
                      Complete a practice set to start tracking your progress here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="glass p-6 rounded-[2rem] border border-secondary/20 bg-secondary/5 space-y-4">
              <div className="flex items-center gap-2.5">
                <Lightning size={15} weight="fill" className="text-secondary" />
                <h5 className="text-xs font-black uppercase tracking-widest text-secondary">Exam Tips</h5>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Switching tabs auto-submits your exam',
                  'A scientific calculator is available inside',
                  'Your history is stored locally — private to you',
                  'Unanswered questions show a warning before submit',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-auto-secondary">
                    <span className="w-4 h-4 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-[8px] font-black shrink-0 mt-0.5">{i+1}</span>
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