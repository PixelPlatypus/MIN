'use client'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function DesmosCalculator() {
  const containerRef = useRef(null)
  const calcRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const { resolvedTheme } = useTheme()

  const initCalc = () => {
    if (typeof window !== 'undefined' && window.Desmos && containerRef.current) {
      try {
        if (calcRef.current) {
          calcRef.current.destroy()
        }
        
        // We use GraphingCalculator because the user expects a graph.
        // It also includes scientific evaluation features.
        calcRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
          fontSize: 14,
          autosize: true,
          invertedColors: resolvedTheme === 'dark',
          keypad: true,
          expressions: true,
          settingsMenu: false, // Keep it clean for exams
          zoomButtons: true,
          expressionsTopbar: true
        })

        // Pre-enter a helpful comment
        calcRef.current.setExpression({ 
          id: 'guide', 
          type: 'text',
          text: 'Use these boxes below to enter your math or use the graphing calculator.' 
        })
        
        setLoaded(true)
      } catch (err) {
        console.error("Desmos Initialization Error:", err)
      }
    }
  }

  // Effect to initialize if Script is already loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Desmos && !loaded) {
      initCalc()
    }
  }, [loaded])

  // Update theme when it changes
  useEffect(() => {
    if (calcRef.current) {
      calcRef.current.updateSettings({
        invertedColors: resolvedTheme === 'dark'
      })
    }
  }, [resolvedTheme])

  useEffect(() => {
    return () => {
      if (calcRef.current) {
        calcRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className="w-full h-full relative bg-white dark:bg-[#0A0A0B] overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Initializing Graphing Engine...</p>
        </div>
      )}
      
      <Script 
        src={`https://www.desmos.com/api/v1.9/calculator.js?apiKey=${process.env.NEXT_PUBLIC_DESMOS_API_KEY}`}
        onLoad={initCalc}
        strategy="afterInteractive"
      />
      
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}
