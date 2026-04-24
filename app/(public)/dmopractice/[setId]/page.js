'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import DesmosCalculator from '@/components/ui/DesmosCalculator'
import { Layout, Maximize2, Minimize2 } from 'lucide-react'
import { 
  Clock, ChevronRight, ChevronLeft, Send, Calculator, 
  Award, RotateCcw, CheckCircle2, AlertTriangle, X, ShieldAlert, Grid3X3, XCircle, Zap
} from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

// --- Math rendering helper ---
function MathText({ text, className = '' }) {
  if (!text) return null
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('$$')) return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
        if (part.startsWith('$')) return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

// --- Submit Confirmation Modal ---
function SubmitModal({ questions, answers, onConfirm, onCancel }) {
  const unanswered = questions.filter(q => !answers[q.id])
  const answered = questions.length - unanswered.length

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 md:p-10 max-w-md w-full border border-border dark:border-white/10 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className={`w-20 h-20 rounded-[1.5rem] mx-auto flex items-center justify-center ${unanswered.length > 0 ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
              {unanswered.length > 0 
                ? <AlertTriangle size={40} className="text-amber-500" />
                : <Send size={40} className="text-primary" />
              }
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">
                {unanswered.length > 0 ? 'Missing Answers!' : 'Submit Exam?'}
              </h3>
              <p className="text-text-secondary text-sm">
                {unanswered.length > 0
                  ? `You have left ${unanswered.length} question${unanswered.length > 1 ? 's' : ''} unanswered.`
                  : 'You have answered all questions. Ready to submit?'
                }
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-emerald-600">{answered}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mt-1">Answered</p>
              </div>
              <div className={`border rounded-2xl p-4 text-center ${unanswered.length > 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-black/5 dark:bg-white/5 border-border'}`}>
                <p className={`text-2xl font-black ${unanswered.length > 0 ? 'text-amber-500' : 'text-text-tertiary'}`}>{unanswered.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mt-1">Unanswered</p>
              </div>
            </div>

            {/* Unanswered question numbers */}
            {unanswered.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 text-left space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Unanswered Questions</p>
                <div className="flex flex-wrap gap-2">
                  {unanswered.map(q => {
                    const idx = questions.findIndex(qq => qq.id === q.id)
                    return (
                      <span key={q.id} className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-black flex items-center justify-center border border-amber-500/20">
                        {idx + 1}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={onConfirm}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Send size={16} /> Yes, Submit Exam
              </button>
              <button
                onClick={onCancel}
                className="w-full glass border border-border py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                Go Back & Review
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// --- Main Exam Component ---
export default function ExamInterface() {
  const { setId } = useParams()
  const router = useRouter()
  
  const [set, setSet] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isSecurityBreach, setIsSecurityBreach] = useState(false)
  const [showSecurityNotice, setShowSecurityNotice] = useState(true)
  const [score, setScore] = useState(0)
  const [totalMarks, setTotalMarks] = useState(0)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showNavigator, setShowNavigator] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calcPosition, setCalcPosition] = useState('side')
  const [calcHeight, setCalcHeight] = useState(400)
  const [hasConsented, setHasConsented] = useState(false)

  // Security Logic: Auto-submit on tab switch or window blur
  useEffect(() => {
    if (isFinished || loading) return
    
    const handleSecurityBreach = () => {
      if (isFinished) return
      setIsSecurityBreach(true)
      handleFinishExam(true)
    }

    // Tab switching detection
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') handleSecurityBreach()
    }

    window.addEventListener('blur', handleSecurityBreach)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('blur', handleSecurityBreach)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [isFinished, loading])

  useEffect(() => {
    async function initExam() {
      try {
        const [setRes, questRes] = await Promise.all([
          fetch('/api/practice/sets').then(r => r.json()),
          fetch(`/api/practice/questions?set_id=${setId}`).then(r => r.json())
        ])
        const currentSet = setRes.find(s => s.id === setId)
        if (!currentSet || questRes.length === 0) { router.push('/dmopractice'); return }
        setSet(currentSet)
        setQuestions(questRes)
        setTotalMarks(questRes.reduce((acc, q) => acc + (q.marks || 1), 0))
        setTimeLeft(currentSet.time_limit * 60)
        setLoading(false)
      } catch { router.push('/dmopractice') }
    }
    initExam()
  }, [setId])



  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  
  const [isResizing, setIsResizing] = useState(false)
  const handleResize = useCallback((e) => {
    if (!isResizing) return
    const newHeight = window.innerHeight - e.clientY
    if (newHeight > 150 && newHeight < window.innerHeight * 0.8) {
      setCalcHeight(newHeight)
    }
  }, [isResizing])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize)
      window.addEventListener('mouseup', () => setIsResizing(false))
    }
    return () => {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', () => setIsResizing(false))
    }
  }, [isResizing, handleResize])



  const handleFinishExam = useCallback((auto = false) => {
    if (isFinished) return
    let currentScore = 0
    questions.forEach(q => { if (answers[q.id] === q.correct_option) currentScore += q.marks || 1 })
    setScore(currentScore)
    setIsFinished(true)
    setIsTimeUp(auto)
    setShowSubmitModal(false)
    setHasConsented(false) // Reset consent on finish
    const history = JSON.parse(localStorage.getItem('min_exam_history') || '[]')
    const breakdown = questions.map(q => ({
      text: q.question_text,
      userAnswer: answers[q.id] || null,
      correctAnswer: q.correct_option,
      isCorrect: answers[q.id] === q.correct_option,
      options: { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d }
    })).filter(q => !q.isCorrect) // Only store incorrect answers to save space
    
    history.push({ 
      setId, 
      setName: set.name, 
      score: currentScore, 
      total: questions.reduce((a, q) => a + (q.marks || 1), 0), 
      date: new Date().toISOString(),
      wrongAnswers: breakdown
    })
    localStorage.setItem('min_exam_history', JSON.stringify(history))
  }, [isFinished, questions, answers, set, setId])

  useEffect(() => {
    if (loading || isFinished || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleFinishExam(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [loading, isFinished, timeLeft, handleFinishExam])

  useEffect(() => {
    if (isFinished || loading) return
    const handleSecurityBreach = () => {
      if (isFinished) return
      setIsSecurityBreach(true)
      handleFinishExam(true)
    }
    window.addEventListener('blur', handleSecurityBreach)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') handleSecurityBreach()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('blur', handleSecurityBreach)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [isFinished, loading, handleFinishExam, hasConsented])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
          <Calculator size={28} className="absolute inset-0 m-auto text-primary/40" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-text-tertiary">Building Exam Environment...</p>
      </div>
    </div>
  )

  // Result Screen
  if (isFinished) {
    const pct = (score / totalMarks) * 100
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full glass rounded-[3rem] p-8 md:p-12 text-center space-y-8 border border-border dark:border-white/10 shadow-2xl relative overflow-hidden"
        >
          {isSecurityBreach && (
            <div className="absolute top-0 left-0 right-0 bg-rose-600 text-white py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldAlert size={12} /> Exam Security Activated: Auto-Submitted
            </div>
          )}
          {isTimeUp && !isSecurityBreach && (
            <div className="absolute top-0 left-0 right-0 bg-coral text-white py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <Clock size={12} /> Time is Up! Auto-Submitted
            </div>
          )}
          <div className={`w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl ${pct >= 80 ? 'bg-emerald-500' : pct >= 40 ? 'bg-primary' : 'bg-coral'}`}>
            <Award size={52} />
          </div>
          <div>
            <h2 className="text-4xl font-black">{pct >= 80 ? 'Excellent Work!' : pct >= 40 ? 'Good Effort!' : 'Keep Practicing!'}</h2>
            <p className="text-text-secondary mt-2">Completed: <span className="text-primary font-bold">{set.name}</span></p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-secondary dark:bg-white/5 p-6 rounded-2xl border border-border/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-2">Score</p>
              <p className="text-4xl font-black text-primary">{score}<span className="text-base opacity-40 ml-1">/ {totalMarks}</span></p>
            </div>
            <div className="bg-bg-secondary dark:bg-white/5 p-6 rounded-2xl border border-border/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-2">Accuracy</p>
              <p className="text-4xl font-black text-secondary">{Math.round(pct)}%</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.location.reload()} className="flex-1 glass border-primary/20 text-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
              <RotateCcw size={16} /> Retake
            </button>
            <button onClick={() => router.push('/dmopractice')} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
              Dashboard <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-bg-main dark:bg-[#050505] flex flex-col pt-[80px]">
      
      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <SubmitModal
          questions={questions}
          answers={answers}
          onConfirm={() => handleFinishExam(false)}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}

      
      
      {/* Mobile Navigator Drawer */}
      {/* Security Consent Modal */}
      <AnimatePresence>
        {!hasConsented && !loading && !isFinished && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/80 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass bg-white dark:bg-[#111] border-border dark:border-white/10 p-8 md:p-12 rounded-[3rem] text-center space-y-8 shadow-2xl"
            >
              <div className="w-20 h-20 bg-coral/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-coral">
                 <ShieldAlert size={40} />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tight">Exam Security Initialized</h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  To ensure a fair testing environment, exiting, refreshing, or <span className="text-coral font-bold underline">switching tabs</span> will trigger immediate auto-submission of your exam.
                </p>
              </div>

              <div className="p-6 bg-coral/5 border border-coral/10 rounded-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest text-coral/70 flex items-center justify-center gap-2">
                    <Zap size={14} /> Anti-Cheat Mode Active
                 </p>
              </div>

              <button 
                onClick={() => setHasConsented(true)}
                className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
              >
                I Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNavigator && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setShowNavigator(false)}
          >
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#111] rounded-t-[2.5rem] p-6 max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-black">Question Navigator</h4>
                <button onClick={() => setShowNavigator(false)} className="p-2 rounded-xl bg-black/5 dark:bg-white/5"><X size={20} /></button>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Answered</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary"><div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10"/>Pending</div>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {questions.map((q, i) => (
                  <button key={q.id} onClick={() => { setCurrentIdx(i); setShowNavigator(false) }}
                    className={`h-12 rounded-xl text-xs font-black transition-all border flex items-center justify-center ${
                      currentIdx === i ? 'bg-primary text-white border-primary shadow-lg scale-110' :
                      answers[q.id] ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      'glass border-border text-text-tertiary'
                    }`}
                  >{i + 1}</button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Progress Bar & Timer */}
      <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-30 glass backdrop-blur-3xl border border-border dark:border-white/10 shadow-2xl rounded-full px-4 h-14 flex items-center justify-center sm:justify-start gap-2 md:gap-3">
          {/* Progress & Set Info */}
          <div className="flex flex-col justify-center items-center sm:items-start min-w-0 flex-1 sm:flex-initial text-center sm:text-left">
             <p className="text-[9px] font-black uppercase tracking-widest text-text-tertiary truncate max-w-[150px] md:max-w-none">
               {set?.name || 'Loading Exam...'}
             </p>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                   <span className="text-sm font-black text-emerald-500 tabular-nums">{answeredCount}</span>
                   <span className="text-[8px] font-bold text-text-tertiary uppercase tracking-tighter">Done</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5">
                   <span className="text-sm font-black text-coral tabular-nums">{questions.length - answeredCount}</span>
                   <span className="text-[8px] font-bold text-text-tertiary uppercase tracking-tighter">Left</span>
                </div>
             </div>
          </div>

          <div className="flex-1 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mx-2 hidden sm:block">
            <motion.div animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full"
            />
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-black tabular-nums ${
            timeLeft < 120 ? 'bg-coral/10 border-coral text-coral animate-pulse' : 'glass border-border/50 text-dynamic'
          }`} title="Remaining Time">
            <Clock size={14} />
            {formatTime(timeLeft)}
          </div>

          <div className="h-6 w-px bg-border/50" />

          {/* Calculator Toggle */}
          <button 
            onClick={() => setShowCalculator(prev => !prev)}
            className={`p-2 rounded-xl transition-all ${showCalculator ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-[#16556D] dark:text-[#F6F094] active:scale-95'}`}
            title={showCalculator ? "Hide Scientific Calculator" : "Show Scientific Calculator"}
          >
            <Calculator size={18} />
          </button>

          {/* Mobile navigator toggle */}
          <button onClick={() => setShowNavigator(true)}
            className="lg:hidden p-2 rounded-xl glass border border-border/50 relative"
            title="Open Question Navigator"
          >
            <Grid3X3 size={18} />
            {answeredCount < questions.length && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {questions.length - answeredCount}
              </span>
            )}
          </button>
      </div>

      
      
      {/* Main Content */}
      <div className={`flex-1 container mx-auto px-4 py-6 mt-24 flex transition-all duration-500 ease-in-out ${
        showCalculator && calcPosition === 'side' ? 'flex-col lg:flex-row max-w-[1600px] w-full gap-6 lg:gap-8' : 
        'flex-col max-w-7xl gap-6'
      } ${showCalculator && (calcPosition === 'bottom' || (typeof window !== 'undefined' && window.innerWidth < 1024)) ? `pb-[${calcHeight}px]` : ''}`}>
        
        {/* SIDE SPLIT CALCULATOR */}
        <AnimatePresence>
          {showCalculator && calcPosition === 'side' && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }} 
              animate={{ width: '40%', opacity: 1 }} 
              exit={{ width: 0, opacity: 0 }} 
              className="hidden lg:flex flex-col relative rounded-[2rem] overflow-hidden border border-border dark:border-white/10 shadow-2xl bg-white dark:bg-[#111] min-h-[600px]"
            >
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <button onClick={() => setCalcPosition('bottom')} className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur shadow-sm rounded-lg hover:bg-primary hover:text-white transition-all" title="Dock Calculator to Bottom">
                  <Layout size={14} />
                </button>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <button onClick={() => setShowCalculator(false)} className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur shadow-sm rounded-lg hover:bg-rose-500 hover:text-white transition-all" title="Close Calculator">
                  <X size={14} />
                </button>
              </div>
              <DesmosCalculator />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Calculator will be rendered based on calcPosition */}
        
        {/* Question Area */}
        <div className="flex-1 flex flex-col gap-3">
          
          {/* Question Layout with Navigator on Right */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Question Card */}
            <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex-1 glass rounded-[2rem] p-6 md:p-10 border border-border dark:border-white/10 shadow-xl relative"
            >
              <div className="absolute top-4 right-4">
                <span className="bg-primary/5 dark:bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10" title="Weight of this question">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>

              <div className="space-y-8">
                {/* Question Text */}
                <div className="text-xl md:text-2xl font-bold text-dynamic leading-snug pr-16">
                  <MathText text={currentQuestion.question_text} />
                </div>

                {/* Question Image */}
                {currentQuestion.image_url && (
                  <div className="max-w-sm mx-auto rounded-2xl overflow-hidden border border-border dark:border-white/10 shadow-md">
                    <img src={currentQuestion.image_url} alt="Question figure" className="w-full h-auto object-contain" />
                  </div>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <button key={opt}
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt })}
                      className={`w-full p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-4 group ${
                        answers[currentQuestion.id] === opt
                          ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                          : 'glass border-border hover:border-primary/30 text-dynamic hover:-translate-y-0.5'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                        answers[currentQuestion.id] === opt ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-text-tertiary'
                      }`}>{opt}</div>
                      <div className="text-sm font-semibold flex-1">
                        <MathText text={currentQuestion[`option_${opt.toLowerCase()}`]} />
                      </div>
                      {answers[currentQuestion.id] === opt && <CheckCircle2 size={18} className="shrink-0 text-white/80" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Desktop Quick Navigator */}
            <div className="hidden lg:flex lg:w-72 flex-col gap-6">
              <div className="glass rounded-[2rem] p-6 border border-border dark:border-white/10 space-y-6">
                <div>
                  <h4 className="font-black text-dynamic text-sm mb-3">Quick Navigator</h4>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>Done</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-text-tertiary"><div className="w-1.5 h-1.5 rounded-full bg-black/10 dark:bg-white/10"/>Pending</div>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, i) => (
                    <button key={q.id} onClick={() => setCurrentIdx(i)}
                      className={`h-9 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center ${
                        currentIdx === i ? 'bg-primary text-white border-primary shadow-lg scale-110 z-10' :
                        answers[q.id] ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        'glass border-border text-text-tertiary hover:border-primary/30'
                      }`}
                      title={`Go to Question ${i + 1}`}
                    >{i + 1}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} disabled={currentIdx === 0}
              className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                currentIdx === 0 ? 'opacity-30 cursor-not-allowed text-text-tertiary bg-black/5 dark:bg-white/5' : 'glass border border-border text-dynamic hover:-translate-x-0.5'
              }`}
              title="Previous Question"
            >
              <ChevronLeft size={18} /> Prev
            </button>

            {/* Dot nav for desktop */}
            <div className="hidden md:flex items-center gap-1.5">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentIdx(i)}
                  className={`rounded-full transition-all ${
                    currentIdx === i ? 'bg-primary w-6 h-2.5' : answers[questions[i].id] ? 'bg-emerald-500 w-2.5 h-2.5' : 'bg-black/10 dark:bg-white/10 w-2.5 h-2.5 hover:bg-black/20'
                  }`}
                  title={`Jump to Question ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              
              
              {currentIdx === questions.length - 1 ? (
                <button 
                  onClick={() => setShowSubmitModal(true)}
                  className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  title="Finalize and Submit Exam"
                >
                  Submit <Send size={16} />
                </button>
              ) : (
                <button onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  title="Next Question"
                >
                  Next <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SPLIT CALCULATOR */}
        <AnimatePresence>
          {showCalculator && (calcPosition === 'bottom' || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: calcHeight, opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              style={{ height: calcHeight }}
              className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col bg-white dark:bg-[#0A0A0B] border-t border-border shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
            >
              {/* Resize Handle */}
              <div 
                onMouseDown={() => setIsResizing(true)}
                className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize z-50 hover:bg-primary/30 transition-colors"
                title="Drag to resize"
              />

              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-white/5 border-b border-border select-none">
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                     <Calculator size={14} /> Desmos Pro
                   </div>
                   <div className="h-4 w-px bg-border" />
                   <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setCalcPosition('side')} 
                        className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[9px] font-bold text-text-tertiary transition-all"
                      >
                        <Layout size={12} /> Split Side
                      </button>
                   </div>
                   <div className="text-[9px] font-bold text-text-tertiary opacity-50">
                     (Drag top edge to resize)
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => setShowCalculator(false)} className="p-1.5 hover:bg-rose-500/10 rounded-lg transition-all text-text-tertiary hover:text-rose-500">
                      <X size={16} />
                    </button>
                 </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <DesmosCalculator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>
  )
}
