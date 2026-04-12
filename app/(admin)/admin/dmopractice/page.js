'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Calculator, Sparkles } from 'lucide-react'

// Load QuestionBank without SSR to prevent hydration issues with KaTeX
const QuestionBank = dynamic(() => import('@/components/admin/QuestionBank'), { ssr: false })

export default function AdminPracticePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <Calculator size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">DMO Practice Builder</h2>
          </div>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm max-w-2xl">
            Create mathematical practice sets, manage LaTeX-formatted questions, and upload diagrams for competitive exam preparation.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary/10 text-primary-dark px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-secondary/20 shadow-sm">
           <Sparkles size={14} className="text-secondary-dark" />
           Academic Tool
        </div>
      </div>

      <div className="glass rounded-[3rem] p-8 border border-border dark:border-white/5 shadow-2xl overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
         <QuestionBank />
      </div>
    </div>
  )
}
