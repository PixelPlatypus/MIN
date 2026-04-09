'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeamCard from '@/components/public/TeamCard'
import { Sparkles, Loader2 } from 'lucide-react'

export default function TeamPage() {
  const [activeTenure, setActiveTenure] = useState(null)
  const [tenures, setTenures] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTenures() {
      try {
        const res = await fetch('/api/team/tenures')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setTenures(data)
          setActiveTenure(data[0]) // Set most recent
        }
      } catch (err) {
        console.error('Failed to fetch tenures:', err)
      }
    }
    fetchTenures()
  }, [])

  useEffect(() => {
    if (!activeTenure) return

    async function fetchTeam() {
      setLoading(true)
      const res = await fetch(`/api/team?tenure=${activeTenure}`)
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    fetchTeam()
  }, [activeTenure])

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
          >
            <Sparkles size={16} />
            Our Team
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Meet the MIN Family
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed max-w-3xl mx-auto"
          >
            A diverse group of educators, volunteers, and math enthusiasts working 
            together to transform math education in Nepal.
          </motion.p>
        </div>
      </section>

      {/* Tenure Selector */}
      <section className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {tenures.map((tenure) => (
            <button
              key={tenure}
              onClick={() => setActiveTenure(tenure)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                activeTenure === tenure 
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                  : 'glass border-transparent hover:border-primary/20 text-text-secondary hover:text-primary'
              }`}
            >
              Tenure {tenure}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={48} className="animate-spin text-primary" />
          </div>
        ) : members.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {members.map((member, i) => (
                <TeamCard 
                  key={member.id} 
                  member={member} 
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-24 glass rounded-[3rem]">
            <p className="text-xl text-text-tertiary">No team members found for this tenure.</p>
          </div>
        )}
      </section>
    </div>
  )
}
