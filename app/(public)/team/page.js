'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeamCard from '@/components/public/TeamCard'
import { Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function TeamPage() {
  const [activeTenure, setActiveTenure] = useState(null)
  const [tenures, setTenures] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('min_team_hero_seen')
    if (seen) {
      setHasSeenAnimation(true)
    } else {
      sessionStorage.setItem('min_team_hero_seen', 'true')
    }

    setSettingsLoading(true)
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setSettingsLoading(false)
      })
      .catch(err => {
        console.error('Team settings load error', err)
        setSettingsLoading(false)
      })

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
      
      const rolePriority = {
        'President': 1,
        'Manager': 2,
        'MINion': 3
      }

      const statusPriority = {
        'ACTIVE': 1,
        'ALUMNI': 2,
        'INACTIVE': 3
      }

      const sorted = Array.isArray(data) ? [...data].sort((a, b) => {
        // 1. Role Grouping
        const priRoleA = rolePriority[a.position] || 99
        const priRoleB = rolePriority[b.position] || 99
        if (priRoleA !== priRoleB) return priRoleA - priRoleB
        
        // 2. Seniority in that group (by Year)
        const yearA = new Date(a.joined_date || 0).getFullYear()
        const yearB = new Date(b.joined_date || 0).getFullYear()
        if (yearA !== yearB) return yearA - yearB

        // 3. Status Priority (within same year)
        const priStatA = statusPriority[a.status] || 99
        const priStatB = statusPriority[b.status] || 99
        if (priStatA !== priStatB) return priStatA - priStatB

        // 4. Alphabetical (within same status)
        return (a.name || '').localeCompare(b.name || '')
      }) : []

      setMembers(sorted)
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
            initial={hasSeenAnimation ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
          >
            <Sparkles size={16} />
            {settingsLoading ? <Skeleton className="w-24 h-4" /> : settings?.team_title}
          </motion.div>
          <div className="flex justify-center">
            {settingsLoading ? (
              <Skeleton className="w-96 h-16 md:h-20" />
            ) : (
              <motion.h1 
                initial={hasSeenAnimation ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight"
              >
                {settings?.team_subtitle}
              </motion.h1>
            )}
          </div>
          <div className="max-w-3xl mx-auto">
            {settingsLoading ? (
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4 mx-auto" />
              </div>
            ) : (
              <motion.p 
                initial={hasSeenAnimation ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed"
              >
                {settings?.team_description}
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Tenure Selector */}
      <section className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {tenures.length === 0 ? (
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-32 h-12 rounded-2xl" />
            ))
          ) : (
            tenures.map((tenure) => (
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
            ))
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] rounded-3xl" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}
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
                  fallbackImage={settings?.default_team_photo}
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
