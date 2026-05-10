'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import DesmosCalculator from '@/components/ui/DesmosCalculator'
import {
  Clock, ChevronRight, ChevronLeft, Send, Calculator, Trophy, RotateCcw,
  CheckCircle2, AlertTriangle, X, ShieldAlert, LayoutGrid, Zap, Layout,
} from 'lucide-react'
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-md"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="bg-bg-dynamic border border-border rounded-2xl p-8 md:p-10 max-w-md w-full"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <div className="h-14 w-14 mx-auto grid place-items-center rounded-full border border-border text-text-primary-dynamic">
              {unanswered.length > 0 ? <AlertTriangle size={22} strokeWidth={1.5} /> : <Send size={22} strokeWidth={1.5} />}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tighter text-headline">
                {unanswered.length > 0 ? 'Missing answers' : 'Submit exam?'}
              </h3>
              <p className="text-text-secondary-dynamic text-sm">
                {unanswered.length > 0
                  ? `${unanswered.length} question${unanswered.length > 1 ? 's' : ''} still unanswered.`
                  : 'You’ve answered every question. Ready to submit?'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-marigold/20 bg-marigold/5 rounded-xl p-4">
                <p className="text-2xl font-black text-marigold">{answered}</p>
                <p className="text-[10px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic mt-1">Answered</p>
              </div>
              <div className={`border rounded-xl p-4 ${unanswered.length > 0 ? 'border-lotus-pink/20 bg-lotus-pink/5' : 'border-border bg-surface'}`}>
                <p className={`text-2xl font-black ${unanswered.length > 0 ? 'text-lotus-pink' : 'text-text-tertiary-dynamic'}`}>{unanswered.length}</p>
                <p className="text-[10px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic mt-1">Unanswered</p>
              </div>
            </div>

            {unanswered.length > 0 && (
              <div className="border border-border rounded-xl p-4 text-left space-y-2">
                <p className="text-[10px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic">Unanswered</p>
                <div className="flex flex-wrap gap-1.5">
                  {unanswered.map(q => {
                    const idx = questions.findIndex(qq => qq.id === q.id)
                    return (
                      <span key={q.id} className="h-7 w-7 rounded-md border border-border text-xs font-mono grid place-items-center text-text-secondary-dynamic">
                        {idx + 1}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={onConfirm}
                className="w-full px-6 py-3.5 rounded-full bg-headline text-bg text-xs font-institutional uppercase tracking-[0.24em] hover:bg-headline/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={14} /> Yes, submit
              </button>
              <button
                onClick={onCancel}
                className="w-full px-6 py-3.5 rounded-full border border-border text-xs font-institutional uppercase tracking-[0.24em] text-text-primary-dynamic hover:text-headline hover:border-headline/40 transition-colors"
              >
                Go back &amp; review
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
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
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    async function initExam() {
      try {
        const [setRes, questRes] = await Promise.all([
          fetch('/api/practice/sets').then(r => r.json()),
          fetch(`/api/practice/questions?set_id=${setId}`).then(r => r.json()),
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
  }, [setId, router])

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const handleResize = useCallback((e) => {
    if (!isResizing) return
    const newHeight = window.innerHeight - e.clientY
    if (newHeight > 150 && newHeight < window.innerHeight * 0.8) setCalcHeight(newHeight)
  }, [isResizing])

  useEffect(() => {
    if (!isResizing) return
    const stop = () => setIsResizing(false)
    window.addEventListener('mousemove', handleResize)
    window.addEventListener('mouseup', stop)
    return () => {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', stop)
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
    setHasConsented(false)
    const history = JSON.parse(localStorage.getItem('min_exam_history') || '[]')
    const breakdown = questions.map(q => ({
      text: q.question_text,
      userAnswer: answers[q.id] || null,
      correctAnswer: q.correct_option,
      isCorrect: answers[q.id] === q.correct_option,
      options: { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d },
    })).filter(q => !q.isCorrect)
    history.push({
      setId,
      setName: set.name,
      score: currentScore,
      total: questions.reduce((a, q) => a + (q.marks || 1), 0),
      date: new Date().toISOString(),
      wrongAnswers: breakdown,
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
    if (isFinished || loading || !hasConsented) return
    const breach = () => {
      if (isFinished) return
      setIsSecurityBreach(true)
      handleFinishExam(true)
    }
    const onVisibility = () => { if (document.visibilityState === 'hidden') breach() }
    window.addEventListener('blur', breach)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('blur', breach)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [isFinished, loading, handleFinishExam, hasConsented])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Calculator size={22} className="text-text-tertiary-dynamic animate-pulse" />
          <p className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic">Loading exam</p>
        </div>
      </div>
    )
  }

  if (isFinished) {
    const pct = totalMarks > 0 ? (score / totalMarks) * 100 : 0
    const verdict = pct >= 80 ? 'Excellent work' : pct >= 40 ? 'Good effort' : 'Keep practicing'
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full p-10 rounded-2xl border border-border bg-bg-dynamic relative overflow-hidden text-center space-y-8"
        >
          {(isSecurityBreach || isTimeUp) && (
            <div className="absolute top-0 inset-x-0 px-4 py-1.5 bg-lotus-pink/10 text-lotus-pink text-[10px] font-institutional uppercase tracking-[0.24em] flex items-center justify-center gap-2 border-b border-lotus-pink/20">
              {isSecurityBreach ? <><ShieldAlert size={12} /> Security trigger — auto-submitted</> : <><Clock size={12} /> Time up — auto-submitted</>}
            </div>
          )}

          <div className="h-16 w-16 mx-auto grid place-items-center rounded-full border border-marigold/30 text-marigold mt-4">
            <Trophy size={26} strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-headline">{verdict}</h2>
            <p className="text-text-secondary-dynamic">{set?.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border rounded-xl p-5">
              <p className="text-[10px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic mb-2">Score</p>
              <p className="text-3xl font-black text-headline tabular-nums">
                {score}<span className="text-base text-text-tertiary-dynamic ml-1">/ {totalMarks}</span>
              </p>
            </div>
            <div className="border border-border rounded-xl p-5">
              <p className="text-[10px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic mb-2">Accuracy</p>
              <p className="text-3xl font-black text-headline tabular-nums">{Math.round(pct)}%</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-5 py-3 rounded-full border border-border text-text-primary-dynamic hover:text-headline hover:border-headline/40 text-xs font-institutional uppercase tracking-[0.24em] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Retake
            </button>
            <button
              onClick={() => router.push('/dmopractice')}
              className="flex-1 px-5 py-3 rounded-full bg-headline text-bg text-xs font-institutional uppercase tracking-[0.24em] hover:bg-headline/90 transition-colors flex items-center justify-center gap-2"
            >
              Dashboard <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  const currentQuestion = questions[currentIdx]
  const answeredCount = Object.keys(answers).length
  const isCalcBottom = showCalculator && (calcPosition === 'bottom' || (typeof window !== 'undefined' && window.innerWidth < 1024))

  return (
    <div className="min-h-screen flex flex-col pt-[80px]">
      {showSubmitModal && (
        <SubmitModal questions={questions} answers={answers} onConfirm={() => handleFinishExam(false)} onCancel={() => setShowSubmitModal(false)} />
      )}

      <AnimatePresence>
        {!hasConsented && !loading && !isFinished && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-bg/85 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-bg-dynamic border border-border p-8 md:p-10 rounded-2xl text-center space-y-7"
            >
              <div className="h-16 w-16 mx-auto grid place-items-center rounded-full border border-lotus-pink/30 text-lotus-pink">
                <ShieldAlert size={26} strokeWidth={1.5} />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-headline">Exam security initialized</h2>
                <p className="text-text-secondary-dynamic text-sm leading-relaxed">
                  To keep things fair, exiting, refreshing, or <span className="text-headline font-semibold">switching tabs</span> will auto-submit the exam.
                </p>
              </div>

              <div className="px-4 py-3 rounded-xl border border-border text-text-tertiary-dynamic text-[10px] font-institutional uppercase tracking-[0.24em] flex items-center justify-center gap-2">
                <Zap size={12} /> Anti-cheat mode active
              </div>

              <button
                onClick={() => setHasConsented(true)}
                className="w-full px-6 py-3.5 rounded-full bg-headline text-bg text-xs font-institutional uppercase tracking-[0.24em] hover:bg-headline/90 transition-colors"
              >
                I understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNavigator && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm lg:hidden"
            onClick={() => setShowNavigator(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 bg-bg-dynamic border-t border-border rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-sm font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic">Question Navigator</h4>
                <button onClick={() => setShowNavigator(false)} className="h-8 w-8 grid place-items-center rounded-full border border-border text-text-tertiary-dynamic hover:text-headline">
                  <X size={14} />
                </button>
              </div>
              <div className="flex gap-4 mb-4 text-[10px] font-institutional uppercase tracking-[0.24em]">
                <span className="flex items-center gap-2 text-marigold"><span className="w-1.5 h-1.5 rounded-full bg-marigold" />Answered</span>
                <span className="flex items-center gap-2 text-text-tertiary-dynamic"><span className="w-1.5 h-1.5 rounded-full bg-border-dynamic" />Pending</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentIdx(i); setShowNavigator(false) }}
                    className={`h-11 rounded-md text-xs font-mono transition-colors border flex items-center justify-center ${
                      currentIdx === i ? 'bg-headline text-bg border-headline' :
                      answers[q.id] ? 'border-marigold/30 text-marigold bg-marigold/5' :
                      'border-border text-text-tertiary-dynamic hover:text-headline hover:border-headline/40'
                    }`}
                  >{i + 1}</button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-30 bg-bg-dynamic/85 backdrop-blur-md border border-border rounded-full px-4 h-14 flex items-center gap-3">
        <div className="flex flex-col justify-center min-w-0 flex-1 sm:flex-initial">
          <p className="text-[9px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic truncate max-w-[160px]">{set?.name || 'Loading'}</p>
          <div className="flex items-center gap-2 text-[10px] tabular-nums">
            <span className="text-marigold font-semibold">{answeredCount} done</span>
            <span className="text-border-dynamic">·</span>
            <span className="text-lotus-pink font-semibold">{questions.length - answeredCount} left</span>
          </div>
        </div>

        <div className="flex-1 h-1 bg-border/60 rounded-full overflow-hidden mx-2 hidden sm:block">
          <motion.div animate={{ width: `${(answeredCount / questions.length) * 100}%` }} className="h-full bg-headline" />
        </div>

        <div
          className={`flex items-center gap-2 px-3 h-9 rounded-full border text-xs font-mono tabular-nums ${timeLeft < 120 ? 'border-lotus-pink text-lotus-pink animate-pulse' : 'border-border text-text-primary-dynamic'}`}
          title="Remaining time"
        >
          <Clock size={12} />
          {formatTime(timeLeft)}
        </div>

        <span className="h-5 w-px bg-border-dynamic" />

        <button
          onClick={() => setShowCalculator(p => !p)}
          className={`h-9 w-9 grid place-items-center rounded-full transition-colors ${showCalculator ? 'bg-headline text-bg' : 'border border-border text-text-primary-dynamic hover:text-headline hover:border-headline/40'}`}
          title={showCalculator ? 'Hide calculator' : 'Show calculator'}
        >
          <Calculator size={14} />
        </button>

        <button
          onClick={() => setShowNavigator(true)}
          className="lg:hidden relative h-9 w-9 grid place-items-center rounded-full border border-border text-text-primary-dynamic hover:text-headline hover:border-headline/40 transition-colors"
          title="Open navigator"
        >
          <LayoutGrid size={14} />
          {answeredCount < questions.length && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-lotus-pink text-bg text-[9px] font-bold grid place-items-center">
              {questions.length - answeredCount}
            </span>
          )}
        </button>
      </div>

      <div className={`flex-1 mx-auto px-4 py-6 mt-24 flex transition-all duration-500 ${
        showCalculator && calcPosition === 'side' ? 'flex-col lg:flex-row max-w-[1600px] w-full gap-6 lg:gap-8' : 'flex-col max-w-7xl w-full gap-6'
      } ${isCalcBottom ? `pb-[${calcHeight}px]` : ''}`}>

        <AnimatePresence>
          {showCalculator && calcPosition === 'side' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }} animate={{ width: '40%', opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col relative rounded-2xl overflow-hidden border border-border bg-bg-dynamic min-h-[600px]"
            >
              <div className="absolute top-3 left-3 z-20 flex gap-2">
                <button onClick={() => setCalcPosition('bottom')} className="h-8 w-8 grid place-items-center rounded-full border border-border bg-bg-dynamic/85 text-text-primary-dynamic hover:text-headline hover:border-headline/40 transition-colors" title="Dock to bottom">
                  <Layout size={12} />
                </button>
              </div>
              <div className="absolute top-3 right-3 z-20">
                <button onClick={() => setShowCalculator(false)} className="h-8 w-8 grid place-items-center rounded-full border border-border bg-bg-dynamic/85 text-text-primary-dynamic hover:text-lotus-pink hover:border-lotus-pink/40 transition-colors" title="Close">
                  <X size={12} />
                </button>
              </div>
              <DesmosCalculator />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row gap-6">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 rounded-2xl border border-border bg-bg-dynamic p-6 md:p-10 relative"
            >
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full border border-border text-[10px] font-institutional uppercase tracking-[0.2em] text-text-tertiary-dynamic">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                </span>
              </div>

              <div className="space-y-7">
                <div className="text-xl md:text-2xl font-medium leading-snug text-text-primary-dynamic pr-16">
                  <MathText text={currentQuestion.question_text} />
                </div>

                {currentQuestion.image_url && (
                  <div className="max-w-sm mx-auto rounded-xl overflow-hidden border border-border">
                    <img src={currentQuestion.image_url} alt="Question figure" className="w-full h-auto object-contain" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const selected = answers[currentQuestion.id] === opt
                    return (
                      <button
                        key={opt}
                        onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt })}
                        className={`text-left p-4 md:p-5 rounded-xl border transition-colors flex items-center gap-4 ${
                          selected ? 'border-headline bg-headline/5' : 'border-border hover:border-headline/40'
                        }`}
                      >
                        <span className={`h-8 w-8 grid place-items-center rounded-full font-mono text-xs shrink-0 ${selected ? 'bg-headline text-bg' : 'border border-border text-text-tertiary-dynamic'}`}>
                          {opt}
                        </span>
                        <span className="text-sm flex-1 text-text-primary-dynamic">
                          <MathText text={currentQuestion[`option_${opt.toLowerCase()}`]} />
                        </span>
                        {selected && <CheckCircle2 size={16} className="shrink-0 text-headline" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            <aside className="hidden lg:flex lg:w-64 flex-col gap-4">
              <div className="rounded-2xl border border-border bg-bg-dynamic p-5 space-y-4">
                <div>
                  <h4 className="text-[10px] font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic mb-2">Quick navigator</h4>
                  <div className="flex flex-wrap gap-3 text-[9px] font-institutional uppercase tracking-[0.24em]">
                    <span className="flex items-center gap-1.5 text-marigold"><span className="w-1.5 h-1.5 rounded-full bg-marigold" />Done</span>
                    <span className="flex items-center gap-1.5 text-text-tertiary-dynamic"><span className="w-1.5 h-1.5 rounded-full bg-border-dynamic" />Pending</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-9 rounded-md text-[10px] font-mono transition-colors border ${
                        currentIdx === i ? 'bg-headline text-bg border-headline' :
                        answers[q.id] ? 'border-marigold/30 text-marigold bg-marigold/5' :
                        'border-border text-text-tertiary-dynamic hover:text-headline hover:border-headline/40'
                      }`}
                      title={`Question ${i + 1}`}
                    >{i + 1}</button>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className={`px-5 py-3 rounded-full text-xs font-institutional uppercase tracking-[0.24em] flex items-center gap-2 transition-colors ${
                currentIdx === 0 ? 'opacity-40 cursor-not-allowed border border-border text-text-tertiary-dynamic' : 'border border-border text-text-primary-dynamic hover:text-headline hover:border-headline/40'
              }`}
            >
              <ChevronLeft size={14} /> Prev
            </button>

            <div className="hidden md:flex items-center gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`rounded-full transition-all ${
                    currentIdx === i ? 'bg-headline w-6 h-2' :
                    answers[questions[i].id] ? 'bg-marigold w-2 h-2' :
                    'bg-border-dynamic w-2 h-2 hover:bg-text-tertiary-dynamic'
                  }`}
                  title={`Jump to question ${i + 1}`}
                />
              ))}
            </div>

            {currentIdx === questions.length - 1 ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-7 py-3 rounded-full bg-headline text-bg text-xs font-institutional uppercase tracking-[0.24em] hover:bg-headline/90 transition-colors flex items-center gap-2"
              >
                Submit <Send size={14} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-7 py-3 rounded-full border border-border text-xs font-institutional uppercase tracking-[0.24em] text-text-primary-dynamic hover:text-headline hover:border-headline/40 transition-colors flex items-center gap-2"
              >
                Next <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isCalcBottom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: calcHeight, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ height: calcHeight }}
              className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col bg-bg-dynamic border-t border-border"
            >
              <div
                onMouseDown={() => setIsResizing(true)}
                className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize z-50 hover:bg-headline/20 transition-colors"
                title="Drag to resize"
              />
              <div className="flex items-center justify-between px-4 py-2 border-b border-border select-none">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic">
                    <Calculator size={12} /> Desmos
                  </div>
                  <span className="h-3 w-px bg-border-dynamic" />
                  <button
                    onClick={() => setCalcPosition('side')}
                    className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-institutional uppercase tracking-[0.24em] text-text-tertiary-dynamic hover:text-headline transition-colors"
                  >
                    <Layout size={11} /> Split side
                  </button>
                </div>
                <button onClick={() => setShowCalculator(false)} className="h-7 w-7 grid place-items-center rounded-full text-text-tertiary-dynamic hover:text-lotus-pink transition-colors">
                  <X size={14} />
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
