'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import DesmosCalculator from '@/components/ui/DesmosCalculator'
import { 
  Clock, CaretRight as ChevronRight, CaretLeft as ChevronLeft, PaperPlaneTilt as Send, Calculator, 
  Trophy as Award, ArrowsClockwise as RotateCcw, CheckCircle as CheckCircle2, Warning as AlertTriangle, 
  X, ShieldWarning as ShieldAlert, SquaresFour as Grid3X3, XCircle, Lightning as Zap, Layout,
  MagnifyingGlassPlus, ArrowLeft, YoutubeLogo, Star, SealCheck, House,
} from '@phosphor-icons/react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

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

function SubmitModal({ questions, answers, onConfirm, onCancel }) {
  const unanswered = questions.filter(q => !answers[q.id])
  const answered = questions.length - unanswered.length
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            <div className={`w-20 h-20 rounded-[1.5rem] mx-auto flex items-center justify-center ${unanswered.length > 0 ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
              {unanswered.length > 0 ? <AlertTriangle size={40} className="text-amber-500" /> : <Send size={40} className="text-primary" />}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">
                {unanswered.length > 0 ? 'Missing Answers!' : 'Submit Exam?'}
              </h3>
              <p className="text-auto-secondary text-sm">
                {unanswered.length > 0
                  ? `You have left ${unanswered.length} question${unanswered.length > 1 ? 's' : ''} unanswered.`
                  : 'You have answered all questions. Ready to submit?'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-emerald-600">{answered}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary mt-1">Answered</p>
              </div>
              <div className={`border rounded-2xl p-4 text-center ${unanswered.length > 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-black/5 dark:bg-white/5 border-border'}`}>
                <p className={`text-2xl font-black ${unanswered.length > 0 ? 'text-amber-500' : 'text-auto-tertiary'}`}>{unanswered.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary mt-1">Unanswered</p>
              </div>
            </div>
            {unanswered.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 text-left space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Skipped Questions</p>
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
            <div className="flex flex-col gap-3 pt-2">
              <button onClick={onConfirm} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <Send size={16} /> Yes, Submit Exam
              </button>
              <button onClick={onCancel} className="w-full glass border border-border py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Go Back & Review
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Animated score counter
function AnimatedNumber({ target, duration = 1200 }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(ease * target))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return <>{current}</>
}

export default function ExamInterface() {
  const { setId } = useParams()
  const router = useRouter()

  const [set, setSet] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [startTime] = useState(Date.now())
  const [isFinished, setIsFinished] = useState(false)
  const [isSecurityBreach, setIsSecurityBreach] = useState(false)
  const [score, setScore] = useState(0)
  const [totalMarks, setTotalMarks] = useState(0)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showNavigator, setShowNavigator] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calcPosition, setCalcPosition] = useState('side')
  const [calcHeight, setCalcHeight] = useState(400)
  const [hasConsented, setHasConsented] = useState(false)
  const [zoomedImage, setZoomedImage] = useState(null)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)

  const [isResizing, setIsResizing] = useState(false)
  const handleResize = useCallback((e) => {
    if (!isResizing) return
    const newHeight = window.innerHeight - e.clientY
    if (newHeight > 150 && newHeight < window.innerHeight * 0.8) setCalcHeight(newHeight)
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

  const handleFinishExam = useCallback((auto = false) => {
    if (isFinished) return
    const taken = Math.floor((Date.now() - startTime) / 1000)
    setTimeTaken(taken)
    let currentScore = 0
    questions.forEach(q => { if (answers[q.id] === q.correct_option) currentScore += q.marks || 1 })
    setScore(currentScore)
    setIsFinished(true)
    setIsTimeUp(auto)
    setShowSubmitModal(false)
    setHasConsented(false)
    const history = JSON.parse(localStorage.getItem('min_exam_history') || '[]')
    const breakdown = questions.map(q => ({
      text: q.question_text,
      userAnswer: answers[q.id] || null,
      correctAnswer: q.correct_option,
      isCorrect: answers[q.id] === q.correct_option,
      options: { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d },
      youtube_url: q.youtube_url || null
    })).filter(q => !q.isCorrect)
    history.push({ setId, setName: set.name, score: currentScore, total: questions.reduce((a, q) => a + (q.marks || 1), 0), date: new Date().toISOString(), wrongAnswers: breakdown })
    localStorage.setItem('min_exam_history', JSON.stringify(history))
  }, [isFinished, questions, answers, set, setId, startTime])

  // Timer
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

  // Security
  useEffect(() => {
    if (isFinished || loading) return
    const handleSecurityBreach = () => {
      if (isFinished) return
      setIsSecurityBreach(true)
      handleFinishExam(true)
    }
    const handleVisibility = () => { if (document.visibilityState === 'hidden') handleSecurityBreach() }
    window.addEventListener('blur', handleSecurityBreach)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('blur', handleSecurityBreach)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [isFinished, loading, handleFinishExam, hasConsented])

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
          <Calculator size={28} className="absolute inset-0 m-auto text-primary/40" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-auto-tertiary animate-pulse">Building Exam Environment...</p>
      </div>
    </div>
  )

  // ── Result Screen ────────────────────────────────────────────────────────────
  if (isFinished) {
    const pct = Math.round((score / totalMarks) * 100)
    const isExcellent = pct >= 80
    const isGood = pct >= 50
    const correctCount = questions.filter(q => answers[q.id] === q.correct_option).length
    const wrongCount = questions.length - correctCount
    const minutesTaken = Math.floor(timeTaken / 60)
    const secondsTaken = timeTaken % 60

    return (
      <div className="min-h-screen flex items-center justify-center p-6 pt-28">
        {/* Image zoom modal */}
        <AnimatePresence>
          {zoomedImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-6"
              onClick={() => setZoomedImage(null)}
            >
              <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full rounded-2xl object-contain" />
              <button className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-2xl space-y-6">
          {/* Status banner */}
          {(isSecurityBreach || isTimeUp) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-white text-xs font-black uppercase tracking-widest ${isSecurityBreach ? 'bg-rose-600' : 'bg-amber-500'}`}
            >
              {isSecurityBreach ? <><ShieldAlert size={14} /> Exam Security Activated — Auto-Submitted</> : <><Clock size={14} /> Time's Up — Auto-Submitted</>}
            </motion.div>
          )}

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="glass rounded-[3rem] p-8 md:p-12 text-center space-y-8 border border-border dark:border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Background glow */}
            <div className={`absolute inset-0 blur-[80px] opacity-20 pointer-events-none ${isExcellent ? 'bg-emerald-500' : isGood ? 'bg-primary' : 'bg-coral'}`} />

            {/* Trophy icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
              className={`w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-2xl relative z-10 ${isExcellent ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : isGood ? 'bg-gradient-to-br from-primary to-blue-600' : 'bg-gradient-to-br from-coral to-rose-600'}`}
            >
              <Award size={52} weight="fill" />
            </motion.div>

            <div className="relative z-10 space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black tracking-tight"
              >
                {isExcellent ? '🎉 Excellent Work!' : isGood ? '👍 Good Effort!' : '💪 Keep Practicing!'}
              </motion.h2>
              <p className="text-auto-secondary">
                Completed: <span className="text-primary font-bold">{set.name}</span>
              </p>
            </div>

            {/* Score stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10"
            >
              {[
                { label: 'Score', value: <><AnimatedNumber target={score} /><span className="text-lg opacity-40 ml-1">/{totalMarks}</span></>, color: 'text-primary' },
                { label: 'Accuracy', value: <><AnimatedNumber target={pct} />%</>, color: isExcellent ? 'text-emerald-500' : isGood ? 'text-primary' : 'text-coral' },
                { label: 'Correct', value: correctCount, color: 'text-emerald-500' },
                { label: 'Wrong', value: wrongCount, color: wrongCount > 0 ? 'text-coral' : 'text-auto-tertiary' },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-secondary dark:bg-white/5 p-4 rounded-2xl border border-border/50 text-center">
                  <p className={`text-3xl font-black ${stat.color} tabular-nums`}>{stat.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-auto-tertiary mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Time taken */}
            {timeTaken > 0 && (
              <p className="text-xs text-auto-tertiary font-bold relative z-10">
                Time taken: {minutesTaken > 0 ? `${minutesTaken}m ` : ''}{secondsTaken}s
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 glass border border-primary/30 text-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
              >
                <RotateCcw size={15} /> Retake
              </button>
              <button
                onClick={() => setShowBreakdown(prev => !prev)}
                className="flex-1 glass border border-border py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                {showBreakdown ? 'Hide' : 'Review'} Answers
              </button>
              <button
                onClick={() => router.push('/dmopractice')}
                className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
              >
                <House size={15} /> Dashboard
              </button>
            </div>
          </motion.div>

          {/* Answer Breakdown */}
          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-black text-dynamic px-2">Question Breakdown</h3>
                {questions.map((q, idx) => {
                  const userAns = answers[q.id]
                  const isCorrect = userAns === q.correct_option
                  return (
                    <div key={q.id} className={`glass rounded-[2rem] p-6 border transition-all ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-coral/20 bg-coral/5'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-black ${isCorrect ? 'bg-emerald-500' : 'bg-coral'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="text-sm font-bold text-dynamic">
                            <MathText text={q.question_text} />
                          </div>
                          {q.image_url && (
                            <img
                              src={q.image_url} alt="Figure"
                              className="max-h-28 rounded-xl object-contain border border-border/50 cursor-zoom-in"
                              onClick={() => setZoomedImage(q.image_url)}
                            />
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            {['A','B','C','D'].map(opt => {
                              const optKey = `option_${opt.toLowerCase()}`
                              const isSelected = userAns === opt
                              const isRight = q.correct_option === opt
                              return (
                                <div key={opt} className={`text-xs px-3 py-2 rounded-xl flex items-center gap-2 border ${
                                  isRight ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' :
                                  isSelected && !isRight ? 'bg-coral/10 border-coral/30 text-coral' :
                                  'bg-black/5 dark:bg-white/5 border-transparent opacity-50'
                                }`}>
                                  <span className="text-[9px] font-black opacity-60 shrink-0">{opt}:</span>
                                  <span className="truncate font-medium"><MathText text={q[optKey]} /></span>
                                  {isRight && <SealCheck size={12} className="shrink-0 ml-auto" />}
                                  {isSelected && !isRight && <XCircle size={12} className="shrink-0 ml-auto" />}
                                </div>
                              )
                            })}
                          </div>
                          {!userAns && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">⚠ Not answered</p>
                          )}
                          {q.youtube_url && (
                            <a href={q.youtube_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                            >
                              <YoutubeLogo size={13} className="text-rose-500" /> Watch Explanation
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-bg-main dark:bg-bg-main-dark flex flex-col pt-[80px]">

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-6"
            onClick={() => setZoomedImage(null)}
          >
            <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full rounded-2xl object-contain" />
            <button className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showSubmitModal && (
        <SubmitModal questions={questions} answers={answers} onConfirm={() => handleFinishExam(false)} onCancel={() => setShowSubmitModal(false)} />
      )}

      {/* Security Consent */}
      <AnimatePresence>
        {!hasConsented && !loading && !isFinished && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/80 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass bg-white dark:bg-[#111] border-border dark:border-white/10 p-8 md:p-12 rounded-[3rem] text-center space-y-8 shadow-2xl"
            >
              <div className="w-20 h-20 bg-coral/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-coral">
                <ShieldAlert size={40} />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tight">Exam Security Initialized</h2>
                <p className="text-auto-secondary text-sm leading-relaxed">
                  To ensure a fair testing environment, exiting or <span className="text-coral font-bold underline">switching tabs</span> will trigger immediate auto-submission of your exam.
                </p>
              </div>
              <div className="p-5 bg-coral/5 border border-coral/10 rounded-2xl flex items-center justify-center gap-2">
                <Zap size={14} className="text-coral" />
                <p className="text-[10px] font-black uppercase tracking-widest text-coral/70">Anti-Cheat Mode Active</p>
              </div>
              <button
                onClick={() => setHasConsented(true)}
                className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
              >
                I Understand — Start Exam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigator Drawer */}
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
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-auto-tertiary"><div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10"/>Pending</div>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {questions.map((q, i) => (
                  <button key={q.id} onClick={() => { setCurrentIdx(i); setShowNavigator(false) }}
                    className={`h-12 rounded-xl text-xs font-black transition-all border flex items-center justify-center ${
                      currentIdx === i ? 'bg-primary text-white border-primary shadow-lg scale-110' :
                      answers[q.id] ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      'glass border-border text-auto-tertiary'
                    }`}
                  >{i + 1}</button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating HUD ───────────────────────────────── */}
      <div className="fixed top-[92px] left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-30 glass backdrop-blur-3xl border border-border dark:border-white/10 shadow-2xl rounded-full px-4 h-14 flex items-center gap-2 md:gap-3">
        <div className="flex flex-col justify-center items-start min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-auto-tertiary truncate max-w-[120px] md:max-w-[200px]">
            {set?.name || '...'}
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-black text-emerald-500 tabular-nums">{answeredCount}</span>
            <span className="text-[8px] font-bold text-auto-tertiary uppercase">Done</span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-sm font-black text-coral tabular-nums">{questions.length - answeredCount}</span>
            <span className="text-[8px] font-bold text-auto-tertiary uppercase">Left</span>
          </div>
        </div>

        <div className="flex-1 h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mx-2 hidden sm:block">
          <motion.div
            animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full"
          />
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-black tabular-nums shrink-0 ${
          timeLeft < 120 ? 'bg-coral/10 border-coral text-coral animate-pulse' : 'glass border-border/50 text-dynamic'
        }`} title="Remaining Time">
          <Clock size={13} /> {formatTime(timeLeft)}
        </div>

        <div className="h-5 w-px bg-border/50 shrink-0" />

        <button
          onClick={() => setShowCalculator(prev => !prev)}
          className={`p-2 rounded-xl transition-all shrink-0 ${showCalculator ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-primary'}`}
          title="Toggle Calculator"
        >
          <Calculator size={17} />
        </button>

        <button onClick={() => setShowNavigator(true)}
          className="lg:hidden p-2 rounded-xl glass border border-border/50 relative shrink-0"
          title="Open Navigator"
        >
          <Grid3X3 size={17} />
          {answeredCount < questions.length && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
              {questions.length - answeredCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Main Content ───────────────────────────────── */}
      <div className={`flex-1 container mx-auto px-4 py-6 mt-24 flex transition-all duration-500 ease-in-out ${
        showCalculator && calcPosition === 'side' ? 'flex-col lg:flex-row max-w-[1600px] w-full gap-6 lg:gap-8' : 'flex-col max-w-7xl gap-6'
      } ${showCalculator && calcPosition === 'bottom' ? `pb-[${calcHeight}px]` : ''}`}>

        {/* Side Calculator */}
        <AnimatePresence>
          {showCalculator && calcPosition === 'side' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '40%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col relative rounded-[2rem] overflow-hidden border border-border dark:border-white/10 shadow-2xl bg-white dark:bg-[#111] min-h-[600px]"
            >
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <button onClick={() => setCalcPosition('bottom')} className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur shadow-sm rounded-lg hover:bg-primary hover:text-white transition-all" title="Dock to Bottom">
                  <Layout size={14} />
                </button>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <button onClick={() => setShowCalculator(false)} className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur shadow-sm rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                  <X size={14} />
                </button>
              </div>
              <DesmosCalculator />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Question Card */}
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 glass rounded-[2rem] p-6 md:p-10 border border-border dark:border-white/10 shadow-xl"
            >
              {/* Question header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                    {currentIdx + 1}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                    of {questions.length}
                  </span>
                </div>
                <span className="bg-primary/8 dark:bg-white/5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/15">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>

              <div className="space-y-7">
                {/* Question text */}
                <div className="text-xl md:text-2xl font-bold text-dynamic leading-snug">
                  <MathText text={currentQuestion.question_text} />
                </div>

                {/* Question image */}
                {currentQuestion.image_url && (
                  <div
                    className="relative max-w-sm group cursor-zoom-in"
                    onClick={() => setZoomedImage(currentQuestion.image_url)}
                  >
                    <img
                      src={currentQuestion.image_url}
                      alt="Question figure"
                      className="w-full h-auto rounded-2xl border border-border dark:border-white/10 shadow-md object-contain max-h-64"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-2xl">
                      <div className="bg-white/90 dark:bg-black/80 rounded-xl p-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                        <MagnifyingGlassPlus size={14} /> Zoom
                      </div>
                    </div>
                  </div>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A','B','C','D'].map(opt => (
                    <button key={opt}
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt })}
                      className={`w-full p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-4 group ${
                        answers[currentQuestion.id] === opt
                          ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                          : 'glass border-border hover:border-primary/40 text-dynamic hover:-translate-y-0.5'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                        answers[currentQuestion.id] === opt ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-auto-tertiary'
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

            {/* Desktop Navigator */}
            <div className="hidden lg:flex lg:w-64 flex-col gap-4">
              <div className="glass rounded-[2rem] p-5 border border-border dark:border-white/10 space-y-5">
                <div>
                  <h4 className="font-black text-dynamic text-sm mb-3">Navigator</h4>
                  <div className="flex flex-wrap gap-2.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>Done</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-auto-tertiary"><div className="w-1.5 h-1.5 rounded-full bg-black/10 dark:bg-white/10"/>Pending</div>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, i) => (
                    <button key={q.id} onClick={() => setCurrentIdx(i)}
                      className={`h-9 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center ${
                        currentIdx === i ? 'bg-primary text-white border-primary shadow-lg scale-110 z-10' :
                        answers[q.id] ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        'glass border-border text-auto-tertiary hover:border-primary/30'
                      }`}
                      title={`Q${i + 1}`}
                    >{i + 1}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                currentIdx === 0 ? 'opacity-30 cursor-not-allowed text-auto-tertiary bg-black/5 dark:bg-white/5' : 'glass border border-border text-dynamic hover:-translate-x-0.5'
              }`}
            >
              <ChevronLeft size={17} /> Prev
            </button>

            {/* Dot progress (desktop) */}
            <div className="hidden md:flex items-center gap-1.5">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentIdx(i)}
                  className={`rounded-full transition-all ${
                    currentIdx === i ? 'bg-primary w-6 h-2.5' : answers[questions[i].id] ? 'bg-emerald-500 w-2.5 h-2.5' : 'bg-black/10 dark:bg-white/10 w-2.5 h-2.5 hover:bg-black/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentIdx === questions.length - 1 ? (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Submit <Send size={15} />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Next <ChevronRight size={17} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Calculator */}
        <AnimatePresence>
          {showCalculator && (calcPosition === 'bottom' || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: calcHeight, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ height: calcHeight }}
              className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col bg-white dark:bg-[#0A0A0B] border-t border-border shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
            >
              <div onMouseDown={() => setIsResizing(true)} className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize z-50 hover:bg-primary/30 transition-colors" title="Drag to resize" />
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-white/5 border-b border-border select-none">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                    <Calculator size={13} /> Desmos Pro
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <button onClick={() => setCalcPosition('side')} className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[9px] font-bold text-auto-tertiary transition-all">
                    <Layout size={11} /> Split Side
                  </button>
                  <span className="text-[9px] font-bold text-auto-tertiary/50">(Drag top edge to resize)</span>
                </div>
                <button onClick={() => setShowCalculator(false)} className="p-1.5 hover:bg-rose-500/10 rounded-lg transition-all text-auto-tertiary hover:text-rose-500">
                  <X size={15} />
                </button>
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
