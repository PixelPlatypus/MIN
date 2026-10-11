// app/(public)/verify/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { m, AnimatePresence } from 'framer-motion'
import { ShieldCheck, MagnifyingGlass as Search, WarningCircle } from '@phosphor-icons/react'

export default function VerifySearchPage() {
  const [certId, setCertId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    setError('')
    
    const cleanId = certId.trim()
    if (!cleanId) {
      setError('Please enter a certificate verification ID')
      return
    }

    // Basic UUID validation (standard 36-char string check, or simple validation)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(cleanId)) {
      setError('Invalid ID format. Certificates use a standard 36-character ID (UUID).')
      return
    }

    router.push(`/verify/${cleanId}`)
  }

  return (
    <div className="relative isolate min-h-[80vh] flex items-center justify-center pt-36 md:pt-40 pb-24 px-6 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 hero-glow pointer-events-none" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-graph pointer-events-none" />
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Animated Icon */}
        <m.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 dark:bg-secondary/10 dark:border-secondary/25 flex items-center justify-center mx-auto text-primary dark:text-secondary shadow-xl shadow-primary/10"
        >
          <ShieldCheck size={40} weight="duotone" />
        </m.div>

        {/* Text */}
        <div className="space-y-3">
          <m.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.05] text-gradient-brand pb-2"
          >
            Credential Verification
          </m.h1>
          <m.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-auto-secondary text-base md:text-lg max-w-md mx-auto leading-relaxed"
          >
            Verify the authenticity of any certificate of participation, appreciation, or accomplishment issued by Mathematics Initiatives in Nepal.
          </m.p>
        </div>

        {/* Form */}
        <m.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSearch}
          className="space-y-4 text-left"
        >
          <div className="relative card-brand rounded-3xl transition-all p-2 flex items-center focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary dark:focus-within:ring-secondary/10 dark:focus-within:border-secondary/60">
            <div className="pl-3 sm:pl-4 text-primary/60 dark:text-secondary/70 shrink-0">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Enter 36-character Verification ID..." 
              className="bg-transparent border-none text-sm sm:text-base focus:outline-none w-full min-w-0 py-3 px-3 placeholder:text-auto-tertiary font-medium text-auto-primary font-mono"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
            />
            <button 
              type="submit"
              className="btn-brand text-sm px-5 sm:px-6 py-3.5 flex-shrink-0"
            >
              Verify
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <m.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold px-4 pt-1"
              >
                <WarningCircle size={16} />
                <span>{error}</span>
              </m.div>
            )}
          </AnimatePresence>
        </m.form>

        {/* Meta Info */}
        <m.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xs text-auto-tertiary max-w-xs mx-auto leading-relaxed"
        >
          You can find the verification ID at the bottom of your certificate. Scan the certificate's QR code to verify directly.
        </m.p>
      </div>
    </div>
  )
}
