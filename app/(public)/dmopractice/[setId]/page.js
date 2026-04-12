'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { 
  BarChart3, Clock, ChevronRight, ChevronLeft, 
  Send, Calculator, Award, RotateCcw, 
  CheckCircle2, AlertCircle, X, ShieldAlert
} from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function ExamInterface() {
  const { setId } = useParams()
  const router = useRouter()
  
  const [set, setSet] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: 'A' }
  const [timeLeft, setTimeLeft] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [totalMarks, setTotalMarks] = useState(0)
  const [isTimeUp, setIsTimeUp] = useState(false)

  // Fetch Data
  useEffect(() => {
    async function initExam() {
      try {
        const [setRes, questRes] = await Promise.all([
          fetch(`/api/practice/sets`).then(r => r.json()),
          fetch(`/api/practice/questions?set_id=${setId}`).then(r => r.json())
        ])
        
        const currentSet = setRes.find(s => s.id === setId)
        if (!currentSet || questRes.length === 0) {
          router.push('/dmopractice')
          return
        }
        
        setSet(currentSet)
        setQuestions(questRes)
        setTotalMarks(questRes.reduce((acc, q) => acc + (q.marks || 1), 0))
        setTimeLeft(currentSet.time_limit * 60)
        setLoading(false)
      } catch (err) {
        console.error(err)
        router.push('/dmopractice')
      }
    }
    initExam()
  }, [setId])

  // Timer
  useEffect(() => {
    if (loading || isFinished || timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinishExam(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [loading, isFinished, timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleFinishExam = useCallback((auto = false) => {
    if (isFinished) return
    
    let currentScore = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option) {
        currentScore += q.marks || 1
      }
    })
    
    setScore(currentScore)
    setIsFinished(true)
    setIsTimeUp(auto)
    
    // Save to local storage
    const history = JSON.parse(localStorage.getItem('min_exam_history') || '[]')
    history.push({
      setId: setId,
      setName: set.name,
      score: currentScore,
      total: questions.reduce((acc, q) => acc + (q.marks || 1), 0),
      date: new Date().toISOString()
    })
    localStorage.setItem('min_exam_history', JSON.stringify(history))
  }, [isFinished, questions, answers, set, setId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main dark:bg-bg-dark">
         <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
              <Calculator size={32} className="absolute inset-0 m-auto text-primary/40" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-text-tertiary">Building Exam Environment...</p>
         </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]
  const progress = ((Object.keys(answers).length) / questions.length) * 100

  // Result Screen
  if (isFinished) {
    const percentage = (score / totalMarks) * 100
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg-main dark:bg-bg-dark">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full glass rounded-[4rem] p-12 text-center space-y-12 border border-border dark:border-white/10 shadow-huge shadow-primary/10 relative overflow-hidden"
        >
          {isTimeUp && (
            <div className="absolute top-0 left-0 right-0 bg-coral text-white py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <Clock size={12} /> Time is Up! Exam Auto-Submitted
            </div>
          )}

          <div className="relative">
            <div className={`w-32 h-32 rounded-[2rem] mx-auto flex items-center justify-center text-white mb-6 transform rotate-6 shadow-2xl ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 40 ? 'bg-primary' : 'bg-coral'}`}>
               <Award size={64} />
            </div>
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg border-4 border-emerald-500"
            >
               <CheckCircle2 size={24} className="text-emerald-500" />
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tight">{percentage >= 80 ? 'Excellent Work!' : percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!'}</h2>
            <p className="text-text-secondary dark:text-text-tertiary font-medium">You have completed the <span className="text-primary">{set.name}</span>.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="bg-bg-secondary/50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-2">Marks Obtained</p>
                <div className="flex items-end justify-center gap-2">
                   <span className="text-5xl font-black text-primary leading-none">{score}</span>
                   <span className="text-sm font-bold opacity-40">/ {totalMarks}</span>
                </div>
             </div>
             <div className="bg-bg-secondary/50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-2">Accuracy Rate</p>
                <div className="flex items-end justify-center gap-2">
                   <span className="text-5xl font-black text-secondary leading-none">{Math.round(percentage)}%</span>
                </div>
             </div>
          </div>

          <div className="flex gap-4">
             <button 
              onClick={() => window.location.reload()}
              className="flex-1 glass border-primary/20 text-primary py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/5 transition-all shadow-lg"
             >
                <RotateCcw size={18} /> Retake Exam
             </button>
             <button 
              onClick={() => router.push('/dmopractice')}
              className="flex-1 bg-primary text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
             >
                Dashboard <ChevronRight size={18} />
             </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Exam Screen
  return (
    <div className="min-h-screen bg-bg-main dark:bg-[#050505] flex flex-col pt-[80px]">
      
      {/* Top Fixed Progress Bar */}
      <div className="fixed top-[80px] left-0 right-0 z-40 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-border dark:border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-6 flex-1 max-w-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Progress</span>
                <span className="text-sm font-black text-dynamic">{currentIdx + 1} of {questions.length}</span>
              </div>
              <div className="flex-1 h-3 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-black/5">
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                 />
              </div>
           </div>

           <div className={`ml-8 flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all ${timeLeft < 120 ? 'bg-coral/10 border-coral text-coral animate-pulse' : 'glass border-border text-dynamic'}`}>
              <Clock size={20} />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Remaining</span>
                <span className="text-lg font-black leading-none tabular-nums">{formatTime(timeLeft)}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 mt-16">
        
        {/* Left: Question Area */}
        <div className="flex-1 space-y-8">
           <motion.div 
             key={currentQuestion.id}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass rounded-[3rem] p-12 md:p-16 border border-border dark:border-white/10 shadow-2xl relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8">
                 <div className="bg-primary/5 dark:bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                   {currentQuestion.marks} Marks
                 </div>
              </div>
              
              <div className="space-y-12 min-h-[300px] flex flex-col justify-center">
                 <div className="text-2xl md:text-3xl font-black text-dynamic leading-tight prose-xl dark:prose-invert max-w-none">
                    {currentQuestion.question_text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/).map((part, i) => {
                      if (part.startsWith('$$')) return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
                      if (part.startsWith('$')) return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
                      return <span key={i}>{part}</span>
                    })}
                 </div>

                 {currentQuestion.image_url && (
                    <div className="max-w-xl mx-auto rounded-[2rem] overflow-hidden border border-border dark:border-white/10 shadow-lg">
                       <img src={currentQuestion.image_url} alt="Question figure" className="w-full h-auto object-contain" />
                    </div>
                 )}

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setAnswers({...answers, [currentQuestion.id]: opt})}
                        className={`w-full p-6 md:p-8 rounded-[2rem] border-2 text-left transition-all duration-300 flex items-center gap-6 group relative overflow-hidden ${
                          answers[currentQuestion.id] === opt 
                            ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/20 scale-[1.02]' 
                            : 'glass border-border hover:border-primary/40 text-dynamic hover:-translate-y-1'
                        }`}
                      >
                         <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors shrink-0 ${
                            answers[currentQuestion.id] === opt 
                              ? 'bg-white/20 text-white' 
                              : 'bg-black/5 dark:bg-white/5 text-text-tertiary'
                         }`}>
                           {opt}
                         </div>
                         <div className="text-lg font-bold flex-1 truncate prose dark:prose-invert">
                            {currentQuestion[`option_${opt.toLowerCase()}`].split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/).map((part, i) => {
                                if (part.startsWith('$$')) return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
                                if (part.startsWith('$')) return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
                                return <span key={i}>{part}</span>
                              })}
                         </div>
                         <div className={`opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${answers[currentQuestion.id] === opt ? 'opacity-100' : ''}`}>
                            <CheckCircle2 size={24} />
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
           </motion.div>

           <div className="flex items-center justify-between gap-6 overflow-hidden">
              <button 
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className={`px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
                  currentIdx === 0 ? 'opacity-20 cursor-not-allowed text-text-tertiary' : 'glass border-border text-dynamic hover:-translate-x-1'
                }`}
              >
                <ChevronLeft size={20} /> Previous
              </button>

              <div className="hidden md:flex items-center gap-2">
                 {questions.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentIdx(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentIdx === i ? 'bg-primary w-8' : answers[questions[i].id] ? 'bg-secondary' : 'bg-black/10 dark:bg-white/10 hover:bg-black/20'
                      }`}
                    />
                 ))}
              </div>

              {currentIdx === questions.length - 1 ? (
                <button 
                  onClick={() => handleFinishExam()}
                  className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1"
                >
                  <Send size={18} /> Finish Exam
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:-translate-y-1"
                >
                  Next Question <ChevronRight size={20} />
                </button>
              )}
           </div>
        </div>

        {/* Right: Status Sidebar */}
        <div className="lg:w-96 space-y-8">
           <div className="glass rounded-[3rem] p-10 border border-border dark:border-white/10 space-y-10">
              <div className="space-y-4">
                 <h4 className="text-xl font-black text-dynamic">Question Navigator</h4>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Answered</div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary"><div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10"/> Pending</div>
                 </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-3">
                 {questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-12 rounded-xl text-xs font-black transition-all border flex items-center justify-center ${
                        currentIdx === i 
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110 z-10' 
                          : answers[q.id]
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'glass border-border text-text-tertiary'
                      }`}
                    >
                       {i + 1}
                    </button>
                 ))}
              </div>

              <div className="p-6 rounded-[2rem] bg-coral/5 border border-coral/10 space-y-4">
                 <div className="flex items-center gap-3 text-coral">
                    <ShieldAlert size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">Exam Security</span>
                 </div>
                 <p className="text-[10px] font-bold text-coral/80 leading-relaxed">
                   Exiting or refreshing this page will auto-submit your current progress. Please stay focused.
                 </p>
              </div>
           </div>

           <div className="glass rounded-[3rem] p-8 border border-border dark:border-white/10 text-center space-y-4 shadow-sm">
               <Calculator size={32} className="mx-auto text-primary opacity-20" />
               <h5 className="font-black text-dynamic tracking-tight">{set.name}</h5>
               <div className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                 Part of District Math Olympiad Prep
               </div>
           </div>
        </div>

      </div>
    </div>
  )
}
