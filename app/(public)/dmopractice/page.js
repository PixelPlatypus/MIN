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
  ChevronRight, 
  Sparkles,
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

    // Load history from local storage
    const saved = localStorage.getItem('min_exam_history')
    if (saved) {
      setHistory(JSON.parse(saved).sort((a,b) => new Date(b.date) - new Date(a.date)))
    }
  }, [])

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border border-primary/5"
          >
            <ShieldCheck size={16} />
            {settings?.dmopractice_badge || 'Official Practice Portal'}
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-gradient"
            >
              <span dangerouslySetInnerHTML={{ __html: settings?.dmopractice_title || 'Master the DMO <br />' }} />
              {settings?.dmopractice_subtitle ? (
                <span className="text-primary dark:text-secondary">{settings.dmopractice_subtitle}</span>
              ) : (
                <span className="text-primary dark:text-secondary">One Set at a Time.</span>
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto leading-relaxed font-medium"
            >
              {settings?.dmopractice_description || 'Experience a realistic competition environment with our curated mock exams, designed to push your problem-solving boundaries.'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          
          {/* Practice Sets List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4">
               <h2 className="text-3xl font-black tracking-tight">Available Mock Exams</h2>
               <div className="h-px flex-1 bg-border dark:bg-white/10" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(n => (
                  <div key={n} className="h-64 glass animate-pulse rounded-[2.5rem]" />
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
                    className="group"
                  >
                    <Link href={`/dmopractice/${set.id}`}>
                      <div className="glass h-full p-8 rounded-[2.5rem] border border-border dark:border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden flex flex-col justify-between group-hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/10 transition-colors" />
                        
                        <div className="relative z-10 space-y-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <Calculator size={24} />
                          </div>
                          <h3 className="text-2xl font-black tracking-tight leading-tight">{set.name}</h3>
                          <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                               <Clock size={14} className="text-primary" /> {set.time_limit} Minutes
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                               <ListOrdered size={14} className="text-secondary" /> {set.practice_questions?.[0]?.count || 0} Questions
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            Take Exam <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {sets.length === 0 && (
                  <div className="col-span-full py-24 text-center glass rounded-[3rem] border border-dashed border-border">
                     <Calculator size={48} className="mx-auto mb-4 opacity-10" />
                     <p className="text-xl font-bold text-text-tertiary">New practice sets coming soon!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Your Performance */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
               <h2 className="text-3xl font-black tracking-tight">Your Journey</h2>
               <div className="h-px flex-1 bg-border dark:bg-white/10" />
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-border dark:border-white/10 space-y-8">
               <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <History size={24} />
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-dynamic">Recent Attempts</h4>
                    {history.length > 0 && (
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to clear all your practice history? This action cannot be undone.')) {
                            localStorage.removeItem('min_exam_history');
                            setHistory([]);
                          }
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-coral hover:bg-coral/10 px-3 py-1.5 rounded-lg transition-colors border border-coral/20"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {history.slice(0, 5).map((entry, idx) => (
                      <div key={idx} className="rounded-2xl bg-bg-secondary/50 dark:bg-white/5 border border-border/50 overflow-hidden">
                        <button 
                          onClick={() => setExpandedHistory(expandedHistory === idx ? null : idx)}
                          className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">{entry.setName}</p>
                            <p className="text-[10px] text-text-tertiary font-bold uppercase">{new Date(entry.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <p className="text-lg font-black text-primary leading-tight">{entry.score}/{entry.total}</p>
                              <p className="text-[10px] text-text-tertiary font-bold uppercase">Marks</p>
                            </div>
                            <ChevronDown size={16} className={`text-text-tertiary transition-transform ${expandedHistory === idx ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {expandedHistory === idx && entry.wrongAnswers && entry.wrongAnswers.length > 0 && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-border/50 bg-black/5 dark:bg-white/5 p-4 space-y-3"
                            >
                              <p className="text-[10px] font-black uppercase tracking-widest text-coral">Incorrect Answers</p>
                              {entry.wrongAnswers.map((w, i) => (
                                <div key={i} className="text-xs space-y-1 p-2 rounded-xl bg-white dark:bg-[#111] border border-coral/20">
                                  <div className="font-semibold text-dynamic pr-4"><MathText text={w.text} /></div>
                                  <div className="flex items-center gap-4 text-[10px] font-bold">
                                    <span className="text-coral flex items-center gap-1">You: {w.userAnswer || 'None'} {w.userAnswer && w.options && <span className="opacity-70">(<MathText text={w.options[w.userAnswer.toLowerCase()]} />)</span>}</span>
                                    <span className="text-emerald-500 flex items-center gap-1">Correct: {w.correctAnswer} {w.options && <span className="opacity-70">(<MathText text={w.options[w.correctAnswer.toLowerCase()]} />)</span>}</span>
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
                              className="border-t border-border/50 bg-black/5 dark:bg-white/5 p-4"
                            >
                              <p className="text-xs font-bold text-emerald-500">Perfect score! No mistakes.</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <div className="py-8 text-center bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-border opacity-50">
                        <p className="text-xs font-bold uppercase tracking-widest">No history yet</p>
                      </div>
                    )}
                  </div>
               </div>

               {history.length > 0 && (
                 <div className="pt-4 p-4 rounded-3xl bg-primary text-white shadow-xl shadow-primary/20">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Total Practice Score</p>
                    <div className="flex items-end gap-2">
                       <span className="text-3xl font-black leading-none">{history.reduce((a,b) => a + b.score, 0)}</span>
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