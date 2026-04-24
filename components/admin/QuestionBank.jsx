'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Trash2, Edit3, Save, X, 
  ChevronRight, Calculator, Clock, 
  Eye, CheckCircle2, AlertCircle, Loader2,
  ListOrdered, Image as ImageIcon,
  Upload, XCircle, ArrowUp, ArrowDown
} from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function QuestionBank() {
  const [sets, setSets] = useState([])
  const [activeSet, setActiveSet] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAddingSet, setIsAddingSet] = useState(false)
  const [editingSet, setEditingSet] = useState(null)
  const [newSetName, setNewSetName] = useState('')
  const [newSetTime, setNewSetTime] = useState(60)

  const [editingQuestion, setEditingQuestion] = useState(null)
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    marks: 1,
    image_url: ''
  })

  useEffect(() => {
    fetchSets()
  }, [])

  useEffect(() => {
    if (activeSet) {
      fetchQuestions(activeSet.id)
    } else {
      setQuestions([])
    }
  }, [activeSet])

  async function fetchSets() {
    setLoading(true)
    try {
      const res = await fetch('/api/practice/sets')
      const data = await res.json()
      setSets(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchQuestions(setId) {
    try {
      const res = await fetch(`/api/practice/questions?set_id=${setId}`)
      const data = await res.json()
      setQuestions(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleAddSet() {
    if (!newSetName) return
    try {
      const res = await fetch('/api/practice/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSetName, time_limit: parseInt(newSetTime) })
      })
      if (res.ok) {
        fetchSets()
        setIsAddingSet(false)
        setNewSetName('')
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleEditSet() {
    if (!editingSet || !newSetName) return
    try {
      const res = await fetch('/api/practice/sets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingSet.id, name: newSetName, time_limit: parseInt(newSetTime) })
      })
      if (res.ok) {
        fetchSets()
        setEditingSet(null)
        setNewSetName('')
        // Update activeSet if it's the one we edited
        if (activeSet?.id === editingSet.id) {
          const updated = await res.json()
          setActiveSet(updated)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDeleteSet(id) {
    if (!confirm('Are you sure? This will delete the set AND ALL ITS QUESTIONS.')) return
    try {
      const res = await fetch(`/api/practice/sets?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchSets()
        if (activeSet?.id === id) setActiveSet(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSaveQuestion() {
    const method = editingQuestion ? 'PATCH' : 'POST'
    const body = editingQuestion 
      ? { ...questionForm, id: editingQuestion.id }
      : { ...questionForm, set_id: activeSet.id, sort_order: questions.length }

    try {
      const res = await fetch('/api/practice/questions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        fetchQuestions(activeSet.id)
        setIsAddingQuestion(false)
        setEditingQuestion(null)
        setQuestionForm({
          question_text: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_option: 'A',
          marks: 1,
          image_url: ''
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDeleteQuestion(id) {
    if (!confirm('Are you sure you want to delete this question?')) return
    try {
      const res = await fetch(`/api/practice/questions?id=${id}`, { method: 'DELETE' })
      if (res.ok) fetchQuestions(activeSet.id)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleReorderQuestion(idx, direction) {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === questions.length - 1) return;
    
    const newQs = [...questions];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    
    const temp = newQs[idx];
    newQs[idx] = newQs[swapIdx];
    newQs[swapIdx] = temp;
    
    newQs.forEach((q, i) => q.sort_order = i);
    setQuestions(newQs);
    
    try {
      await Promise.all([
        fetch('/api/practice/questions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newQs[idx].id, sort_order: newQs[idx].sort_order })
        }),
        fetch('/api/practice/questions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newQs[swapIdx].id, sort_order: newQs[swapIdx].sort_order })
        })
      ]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar: Sets List */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-dynamic">Practice Sets</h3>
          <button 
            onClick={() => { setIsAddingSet(true); setEditingSet(null); setNewSetName(''); setNewSetTime(60); }}
            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>

        <AnimatePresence>
          {(isAddingSet || editingSet) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass p-5 rounded-[2rem] border border-primary/20 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-1">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">{editingSet ? 'Rename Set' : 'Initialize Set'}</h5>
                 <button onClick={() => { setIsAddingSet(false); setEditingSet(null); }} className="text-text-tertiary hover:text-coral transition-colors">
                    <X size={14} />
                 </button>
              </div>
              <input 
                placeholder="Set Name (e.g., DMO Mock 1)"
                value={newSetName}
                onChange={e => setNewSetName(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary transition-all outline-none"
              />
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-text-tertiary" />
                <input 
                  type="number"
                  placeholder="Mins"
                  value={newSetTime}
                  onChange={e => setNewSetTime(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary transition-all outline-none"
                />
                <span className="text-[10px] text-text-tertiary font-black uppercase tracking-widest">Minutes</span>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={editingSet ? handleEditSet : handleAddSet} 
                  className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                  {editingSet ? 'Update' : 'Create'}
                </button>
                <button onClick={() => { setIsAddingSet(false); setEditingSet(null); }} className="flex-1 bg-bg-secondary dark:bg-white/5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-text-tertiary">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {sets.map(set => (
            <div key={set.id} className="relative group">
              <button
                key={set.id}
                onClick={() => setActiveSet(set)}
                className={`w-full text-left p-5 rounded-3xl border transition-all flex items-center justify-between ${
                  activeSet?.id === set.id 
                    ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]' 
                    : 'glass border-border hover:border-primary/50 text-text-secondary hover:translate-x-1'
                }`}
              >
                <div className="flex flex-col gap-1 pr-14">
                  <span className="font-bold tracking-tight line-clamp-1">{set.name}</span>
                  <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${activeSet?.id === set.id ? 'text-white/70' : 'text-text-tertiary'}`}>
                    <span className="flex items-center gap-1"><Clock size={10}/> {set.time_limit}m</span>
                    <span className="flex items-center gap-1"><ListOrdered size={10}/> {set.practice_questions?.[0]?.count || 0} Qs</span>
                  </div>
                </div>
              </button>
              
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-all ${activeSet?.id === set.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingSet(set);
                    setIsAddingSet(false);
                    setNewSetName(set.name);
                    setNewSetTime(set.time_limit);
                  }}
                  className={`p-2 rounded-lg transition-colors ${activeSet?.id === set.id ? 'hover:bg-white/20 text-white' : 'hover:bg-primary/10 text-primary'}`}
                  title="Rename/Edit Config"
                 >
                   <Edit3 size={14} />
                 </button>
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSet(set.id);
                  }}
                  className={`p-2 rounded-lg transition-colors ${activeSet?.id === set.id ? 'hover:bg-coral/20 text-white' : 'hover:bg-coral/10 text-coral'}`}
                  title="Delete Set"
                 >
                   <Trash2 size={14} />
                 </button>
              </div>
            </div>
          ))}
          {sets.length === 0 && !loading && (
            <div className="py-12 text-center text-text-tertiary glass rounded-3xl border border-dashed border-border">
              <Calculator size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest">No sets found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Question List & Editor */}
      <div className="lg:col-span-8">
        {!activeSet ? (
          <div className="h-full flex items-center justify-center glass rounded-[3rem] border border-dashed border-border p-12 text-center">
             <div className="space-y-4">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary">
                  <ChevronRight size={40} className="-rotate-90" />
                </div>
                <h4 className="text-xl font-black text-dynamic">Select a set to manage questions</h4>
                <p className="text-text-tertiary text-sm max-w-xs mx-auto">Click a practice set on the left to add, edit or remove competitive math questions.</p>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between glass p-6 rounded-[2rem] border border-border">
              <div>
                <h3 className="text-2xl font-black text-dynamic">{activeSet.name}</h3>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Question Management</p>
              </div>
              <button 
                onClick={() => {
                  setEditingQuestion(null)
                  setQuestionForm({
                    question_text: '',
                    option_a: '',
                    option_b: '',
                    option_c: '',
                    option_d: '',
                    correct_option: 'A',
                    marks: 1,
                    image_url: ''
                  })
                  setIsAddingQuestion(true)
                }}
                className="bg-primary text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
              >
                <Plus size={16} /> New Question
              </button>
            </div>

            {/* Question Editor Overlay/Form */}
            <AnimatePresence>
              {(isAddingQuestion || editingQuestion) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass p-8 rounded-[2.5rem] border border-primary/30 space-y-8 bg-white/80 dark:bg-black/80 backdrop-blur-3xl shadow-2xl relative z-20"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-dynamic">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h4>
                    <button onClick={() => { setIsAddingQuestion(false); setEditingQuestion(null); }} className="p-2 hover:bg-coral/10 text-coral rounded-xl transition-all">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Question (LaTeX Supported)</label>
                        <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">Tip: Use $...$ for inline and $$...$$ for block math</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8">
                           <textarea 
                            rows={6}
                            value={questionForm.question_text}
                            onChange={e => setQuestionForm({...questionForm, question_text: e.target.value})}
                            className="w-full bg-white dark:bg-white/5 border border-border rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary transition-all resize-none h-full"
                            placeholder="State the Pythagorean theorem... $a^2 + b^2 = c^2$"
                          />
                        </div>
                        <div className="lg:col-span-4 space-y-4">
                           <div className="glass bg-bg-secondary/50 rounded-2xl p-4 border border-border flex flex-col items-center justify-center min-h-[160px] relative group overflow-hidden">
                              {questionForm.image_url ? (
                                <>
                                  <img src={questionForm.image_url} alt="Question figure" className="max-h-32 rounded-lg object-contain mb-2" />
                                  <button 
                                    onClick={() => setQuestionForm({...questionForm, image_url: ''})}
                                    className="absolute top-2 right-2 p-1 bg-coral text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <div className="text-center space-y-2">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                    <ImageIcon size={20} />
                                  </div>
                                  <p className="text-[10px] font-black uppercase text-text-tertiary">Add Figure</p>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files[0]
                                      if (!file) return
                                      const formData = new FormData()
                                      formData.append('file', file)
                                      formData.append('folder', 'practice-exams')
                                      
                                      const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                      const data = await res.json()
                                      if (data.url) setQuestionForm({...questionForm, image_url: data.url})
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                  />
                                </div>
                              )}
                           </div>
                           <p className="text-[8px] text-text-tertiary text-center leading-relaxed font-bold uppercase tracking-widest">Optional figure for geometry or diagrams</p>
                        </div>
                      </div>

                      {questionForm.question_text && (
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><Eye size={12}/> Live Preview</p>
                          <div className="text-sm prose dark:prose-invert max-w-none prose-p:my-0">
                            {/* Simple regex based split for live preview */}
                            {questionForm.question_text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/).map((part, i) => {
                              if (part.startsWith('$$')) return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
                              if (part.startsWith('$')) return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
                              return <span key={i}>{part}</span>
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <div key={opt} className="space-y-2">
                          <label className={`text-[10px] font-black uppercase tracking-widest ${questionForm.correct_option === opt ? 'text-primary' : 'text-text-tertiary'}`}>Option {opt}</label>
                          <div className="relative group">
                             <input 
                              value={questionForm[`option_${opt.toLowerCase()}`]}
                              onChange={e => setQuestionForm({...questionForm, [`option_${opt.toLowerCase()}`]: e.target.value})}
                              className={`w-full bg-white dark:bg-white/5 border rounded-xl px-4 py-3 text-sm transition-all pr-12 ${
                                questionForm.correct_option === opt ? 'border-primary shadow-sm bg-primary/5' : 'border-border'
                              }`}
                              placeholder={`Possible answer ${opt}...`}
                            />
                            <button 
                              onClick={() => setQuestionForm({...questionForm, correct_option: opt})}
                              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                                questionForm.correct_option === opt ? 'bg-primary text-white' : 'text-text-tertiary hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          </div>
                          {questionForm[`option_${opt.toLowerCase()}`] && (
                            <div className="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-xl border border-border/50 text-xs">
                               {questionForm[`option_${opt.toLowerCase()}`].split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/).map((part, i) => {
                                  if (part.startsWith('$$')) return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
                                  if (part.startsWith('$')) return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
                                  return <span key={i}>{part}</span>
                                })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <select 
                          value={questionForm.marks}
                          onChange={e => setQuestionForm({...questionForm, marks: parseInt(e.target.value)})}
                          className="bg-bg-secondary dark:bg-white/5 border border-border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary"
                        >
                          {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} Marks</option>)}
                        </select>
                      </div>
                      <div className="flex-1" />
                      <button 
                        onClick={handleSaveQuestion}
                        className="bg-primary text-white px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center gap-2"
                      >
                        <Save size={16}/> {editingQuestion ? 'Update Question' : 'Save Question'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <motion.div 
                  key={q.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-6 rounded-[2rem] border border-border group hover:border-primary/20 transition-all flex gap-6"
                >
                  <div className="w-10 h-10 rounded-full bg-bg-secondary dark:bg-white/5 flex items-center justify-center shrink-0 font-black text-text-tertiary text-xs border border-border">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="text-sm font-bold text-dynamic prose-sm dark:prose-invert max-w-none">
                       {q.question_text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/).map((part, i) => {
                          if (part.startsWith('$$')) return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
                          if (part.startsWith('$')) return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
                          return <span key={i}>{part}</span>
                        })}
                    </div>

                    {q.image_url && (
                        <div className="w-48 rounded-xl overflow-hidden border border-border">
                            <img src={q.image_url} alt="Figure" className="w-full h-auto object-contain" />
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {['a', 'b', 'c', 'd'].map(opt => (
                        <div key={opt} className={`text-xs px-4 py-3 rounded-xl flex items-center gap-2 border ${q.correct_option === opt.toUpperCase() ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-black/5 dark:bg-white/5 border-transparent opacity-60'}`}>
                          <span className="uppercase text-[10px] opacity-40 font-black shrink-0">{opt}:</span>
                          <div className="truncate prose-sm dark:prose-invert">
                             {q[`option_${opt}`].split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/).map((part, i) => {
                                if (part.startsWith('$$')) return <BlockMath key={i}>{part.slice(2, -2)}</BlockMath>
                                if (part.startsWith('$')) return <InlineMath key={i}>{part.slice(1, -1)}</InlineMath>
                                return <span key={i}>{part}</span>
                              })}
                          </div>
                          {q.correct_option === opt.toUpperCase() && <CheckCircle2 size={12} className="shrink-0 ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between gap-1 bg-black/5 dark:bg-white/5 rounded-xl p-1 mb-1">
                      <button onClick={() => handleReorderQuestion(idx, 'up')} disabled={idx === 0} className={`p-1 rounded-md transition-all ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/50 dark:hover:bg-black/50 text-text-secondary'}`}><ArrowUp size={14} /></button>
                      <button onClick={() => handleReorderQuestion(idx, 'down')} disabled={idx === questions.length - 1} className={`p-1 rounded-md transition-all ${idx === questions.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/50 dark:hover:bg-black/50 text-text-secondary'}`}><ArrowDown size={14} /></button>
                    </div>
                    <button 
                      onClick={() => {
                        setQuestionForm({
                          question_text: q.question_text,
                          option_a: q.option_a,
                          option_b: q.option_b,
                          option_c: q.option_c,
                          option_d: q.option_d,
                          correct_option: q.correct_option,
                          marks: q.marks,
                          image_url: q.image_url || ''
                        })
                        setEditingQuestion(q)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 bg-coral/10 text-coral rounded-xl hover:bg-coral hover:text-white transition-all shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}

              {questions.length === 0 && !isAddingQuestion && (
                <div className="py-24 text-center glass rounded-[3rem] border border-dashed border-border group hover:border-primary/20 transition-all cursor-pointer" onClick={() => setIsAddingQuestion(true)}>
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary/50 mb-4 group-hover:scale-110 transition-transform">
                    <Plus size={32} />
                  </div>
                  <h4 className="text-lg font-black text-dynamic">No questions in this set yet</h4>
                  <p className="text-text-tertiary text-sm">Click the button above or here to create your first question.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
