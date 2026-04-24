'use client'
import { useState, useEffect } from 'react'
import { X, Delete, Eraser } from 'lucide-react'
import { evaluate } from 'mathjs'

export default function ScientificCalculator({ onClose }) {
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState(false)

  const handleInput = (val) => {
    setError(false)
    setExpr(prev => prev + val)
  }

  const handleClear = () => {
    setExpr('')
    setResult('')
    setError(false)
  }

  const handleDelete = () => {
    setError(false)
    setExpr(prev => prev.slice(0, -1))
  }

  const calculate = () => {
    try {
      if (!expr) return
      
      // Pre-process for common math notation
      let processedExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        // mathjs uses combinations(n, k) and permutations(n, k)
        // We'll help the user if they typed nCr( or nPr(
        .replace(/nCr\(/g, 'combinations(')
        .replace(/nPr\(/g, 'permutations(')

      const calcResult = evaluate(processedExpr)
      
      if (typeof calcResult === 'number' || typeof calcResult === 'object') {
        setResult(calcResult.toString())
      } else {
        setResult('Error')
        setError(true)
      }
    } catch (e) {
      console.error(e)
      setResult('Error')
      setError(true)
    }
  }

  const buttons = [
    { label: 'sin', val: 'sin(' }, { label: 'cos', val: 'cos(' }, { label: 'tan', val: 'tan(' }, { label: '!', val: '!' }, { label: 'C', action: handleClear, class: 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20' },
    { label: 'ln', val: 'log(' }, { label: 'log', val: 'log10(' }, { label: 'nPr', val: 'nPr(' }, { label: 'nCr', val: 'nCr(' }, { label: '⌫', action: handleDelete, class: 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20' },
    { label: '(', val: '(' }, { label: ')', val: ')' }, { label: ',', val: ',' }, { label: '^', val: '^' }, { label: '÷', val: '÷', class: 'text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20' },
    { label: '7', val: '7' }, { label: '8', val: '8' }, { label: '9', val: '9' }, { label: '√', val: 'sqrt(' }, { label: '×', val: '×', class: 'text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20' },
    { label: '4', val: '4' }, { label: '5', val: '5' }, { label: '6', val: '6' }, { label: 'π', val: 'PI' }, { label: '-', val: '-', class: 'text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20' },
    { label: '1', val: '1' }, { label: '2', val: '2' }, { label: '3', val: '3' }, { label: 'e', val: 'e' }, { label: '+', val: '+', class: 'text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20' },
    { label: '0', val: '0' }, { label: '.', val: '.' }, { label: 'Ans', action: () => setExpr(prev => prev + result) }, { label: '=', action: calculate, class: 'col-span-2 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700' },
  ]

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 pt-safe">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-[10px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="16" y1="18" x2="16" y2="18.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>
          Pro Scientific Calculator
        </div>
        <button onClick={onClose} className="p-2 hover:bg-rose-500/10 rounded-xl transition-all text-slate-400 hover:text-rose-500"><X size={18} /></button>
      </div>
      
      {/* Display Area */}
      <div className="p-6 bg-slate-50/30 dark:bg-black/20 border-b border-slate-200 dark:border-slate-800 flex flex-col justify-end min-h-[160px] gap-3">
        <div className="text-right text-slate-400 dark:text-slate-500 text-sm font-bold tracking-tight min-h-[20px] overflow-x-auto whitespace-nowrap scrollbar-hide font-mono">
          {expr || '0'}
        </div>
        <div className={`text-right text-4xl font-black tracking-tighter min-h-[40px] overflow-x-auto whitespace-nowrap scrollbar-hide font-mono ${error ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
          {result || ' '}
        </div>
      </div>

      {/* Numpad Area */}
      <div className="flex-1 p-4 grid grid-cols-5 gap-2 bg-white dark:bg-[#0A0A0B]">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action || (() => handleInput(btn.val))}
            className={`h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all active:scale-95 ${btn.class || 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'} ${btn.label === '=' ? 'col-span-2' : ''}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-slate-800 text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">
        Powered by math.js • Use commas for nCr(n,r)
      </div>
    </div>
  )
}
