// app/(public)/verify/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-6 bg-gradient-to-b from-transparent to-bg-secondary/20">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-xl shadow-primary/5"
        >
          <ShieldCheck size={40} weight="duotone" />
        </motion.div>

        {/* Text */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight"
          >
            Credential Verification
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-auto-secondary text-sm max-w-md mx-auto leading-relaxed"
          >
            Verify the authenticity of any certificate of participation, appreciation, or accomplishment issued by Mathematics Initiatives in Nepal.
          </motion.p>
        </div>

        {/* Form */}
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSearch}
          className="space-y-4 text-left"
        >
          <div className="relative glass rounded-3xl border border-border dark:border-border-dark shadow-lg focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all p-2 flex items-center">
            <div className="pl-4 text-auto-tertiary">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Enter 36-character Verification ID..." 
              className="bg-transparent border-none text-base focus:outline-none w-full py-3 px-3 placeholder:text-auto-tertiary font-medium text-auto-primary font-mono"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-primary/20 flex-shrink-0 active:scale-[0.98]"
            >
              Verify
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-coral text-xs font-semibold px-4 pt-1"
              >
                <WarningCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Meta Info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[10px] text-auto-tertiary max-w-xs mx-auto leading-relaxed"
        >
          You can find the verification ID at the bottom of your certificate. Scan the certificate's QR code to verify directly.
        </motion.p>
      </div>
    </div>
  )
}
