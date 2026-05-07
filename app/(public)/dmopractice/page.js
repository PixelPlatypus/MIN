'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import Link from 'next/link'
import {
  Calculator,
  Clock,
  ListOrdered,
  ArrowRight,
  ShieldCheck,
  History,
  ChevronDown
} from 'lucide-react'


function MathText({ text, className = '' }) {
  if (!text) return null
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
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
      setHistory(JSON.parse(saved).sort((a,b) => new Date(b.date) - new Date(a.date)))
    }
  }, [])

  return (
    <div className="pt-32 pb-24 space-y-24">
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 pill px-6 py-2.5 text-xs font-institutional tracking-[0.2em] text-text-secondary-dynamic">
            <ShieldCheck size={16} className="text-marigold" />
            {loading ? 'DMO Practice' : settings?.dmopractice_badge || 'DMO Practice'}
          </div>

          <div className="space-y-6">
            <h1 className="text-headline text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85]">
              {loading ? 'Practice for Olympiad' : settings?.dmopractice_title || 'Practice for Olympiad'}
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary-dynamic leading-relaxed font-medium max-w-2xl mx-auto">
              {loading ? '' : settings?.dmopractice_description || 'Sharpen your skills with timed mock exams designed to simulate real olympiad conditions.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">

          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4">
               <h2 className="text-headline text-3xl font-bold tracking-tight">Available Mock Exams</h2>
               <div className="h-px flex-1 bg-border" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(n => (
                  <div key={n} className="h-64 bg-surface border border-border animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sets.map((set, i) => (
                  <motion.div
                    key={set.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/dmopractice/${set.id}`}>
                      <div className="bg-surface h-full p-8 rounded-2xl border border-border hover:border-border-strong transition-all duration-500 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center">
                            <Calculator size={24} className="text-marigold" />
                          </div>
                          <h3 className="text-headline text-2xl font-bold tracking-tight leading-tight">{set.name}</h3>
                          <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-[10px] font-institutional tracking-[0.2em] text-text-tertiary-dynamic">
                               <Clock size={14} className="text-marigold" /> {set.time_limit} Minutes
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-institutional tracking-[0.2em] text-text-tertiary-dynamic">
                               <ListOrdered size={14} className="text-marigold" /> {set.practice_questions?.[0]?.count || 0} Questions
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 flex items-center justify-between">
                          <span className="text-xs font-institutional tracking-[0.2em] text-headline flex items-center gap-2">
                            Take Exam <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {sets.length === 0 && (
                  <div className="col-span-full py-24 text-center bg-surface rounded-3xl border border-dashed border-border">
                     <Calculator size={48} className="mx-auto mb-4 text-text-tertiary-dynamic" />
                     <p className="text-xl font-bold text-text-tertiary-dynamic">New practice sets coming soon!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
               <h2 className="text-headline text-3xl font-bold tracking-tight">Your Journey</h2>
               <div className="h-px flex-1 bg-border" />
            </div>

            <div className="bg-surface p-8 rounded-2xl border border-border space-y-8">
               <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center">
                    <History size={24} className="text-marigold" />
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-lg font-bold text-text-primary-dynamic">Recent Attempts</h4>
                     {history.length > 0 && (
                       <button
                         onClick={() => {
                           if (window.confirm('Are you sure you want to clear all your practice history? This action cannot be undone.')) {
                             localStorage.removeItem('min_exam_history');
                             setHistory([]);
                           }
                         }}
                         className="text-[10px] font-institutional tracking-[0.2em] text-sari-red hover:bg-sari-red/5 px-3 py-1.5 rounded-lg transition-colors border border-sari-red/20"
                       >
                         Clear All
                       </button>
                     )}
                  </div>
                  <div className="space-y-4">
                    {history.slice(0, 5).map((entry, idx) => (
                      <div key={idx} className="rounded-xl bg-bg-secondary border border-border overflow-hidden">
                        <button
                          onClick={() => setExpandedHistory(expandedHistory === idx ? null : idx)}
                          className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors text-left"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-text-primary-dynamic truncate">{entry.setName}</p>
                            <p className="text-[10px] text-text-tertiary-dynamic font-institutional tracking-[0.2em]">{new Date(entry.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <p className="text-lg font-bold text-headline leading-tight">{entry.score}/{entry.total}</p>
                              <p className="text-[10px] text-text-tertiary-dynamic font-institutional tracking-[0.2em]">Marks</p>
                            </div>
                            <ChevronDown size={16} className={`text-text-tertiary-dynamic transition-transform ${expandedHistory === idx ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedHistory === idx && entry.wrongAnswers && entry.wrongAnswers.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-border bg-bg-secondary p-4 space-y-3"
                            >
                              <p className="text-[10px] font-institutional tracking-[0.2em] text-sari-red">Incorrect Answers</p>
                              {entry.wrongAnswers.map((w, i) => (
                                <div key={i} className="text-xs space-y-1 p-2 rounded-xl bg-surface border border-sari-red/20">
                                  <div className="font-semibold text-text-primary-dynamic pr-4"><MathText text={w.text} /></div>
                                  <div className="flex items-center gap-4 text-[10px] font-bold">
                                    <span className="text-sari-red flex items-center gap-1">You: {w.userAnswer || 'None'} {w.userAnswer && w.options && <span className="opacity-70">(<MathText text={w.options[w.userAnswer.toLowerCase()]} />)</span>}</span>
                                    <span className="text-marigold flex items-center gap-1">Correct: {w.correctAnswer} {w.options && <span className="opacity-70">(<MathText text={w.options[w.correctAnswer.toLowerCase()]} />)</span>}</span>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                          {expandedHistory === idx && (!entry.wrongAnswers || entry.wrongAnswers.length === 0) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-border bg-bg-secondary p-4"
                            >
                              <p className="text-xs font-bold text-marigold">Perfect score! No mistakes.</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <div className="py-8 text-center bg-bg-secondary rounded-xl border border-dashed border-border">
                        <p className="text-xs font-institutional tracking-[0.2em] text-text-tertiary-dynamic">No history yet</p>
                      </div>
                    )}
                  </div>
               </div>

               {history.length > 0 && (
                 <div className="pt-4 p-4 rounded-2xl bg-headline text-bg">
                    <p className="text-[10px] font-institutional tracking-[0.2em] opacity-80 mb-2">Total Practice Score</p>
                    <div className="flex items-end gap-2">
                       <span className="text-3xl font-bold leading-none">{history.reduce((a,b) => a + b.score, 0)}</span>
                       <span className="text-sm font-bold opacity-60">Total Marks</span>
                    </div>
                 </div>
               )}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
