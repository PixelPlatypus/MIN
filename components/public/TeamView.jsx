'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeamCard from '@/components/public/TeamCard'
import { Skeleton } from '@/components/ui/Skeleton'

export default function TeamView({ initialTenures, initialMembers, initialTenure, fallbackImage }) {
  const [activeTenure, setActiveTenure] = useState(initialTenure)
  const [tenures, setTenures] = useState(initialTenures || [])
  const [members, setMembers] = useState(initialMembers || [])
  const [loading, setLoading] = useState(false)
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => {
    // Prevent fetching on first mount if we have initial data
    if (isFirstMount) {
      setIsFirstMount(false)
      return
    }

    async function fetchTeam() {
      setLoading(true)
      try {
        const res = await fetch(`/api/team?tenure=${activeTenure}`)
        const data = await res.json()
        
        const rolePriority = { 'President': 1, 'Manager': 2, 'MINion': 3 }
        const statusPriority = { 'ACTIVE': 1, 'ALUMNI': 2, 'INACTIVE': 3 }

        const sorted = Array.isArray(data) ? [...data].sort((a, b) => {
          const priRoleA = rolePriority[a.position] || 99
          const priRoleB = rolePriority[b.position] || 99
          if (priRoleA !== priRoleB) return priRoleA - priRoleB
          const yearA = new Date(a.joined_date || 0).getFullYear()
          const yearB = new Date(b.joined_date || 0).getFullYear()
          if (yearA !== yearB) return yearA - yearB
          const priStatA = statusPriority[a.status] || 99
          const priStatB = statusPriority[b.status] || 99
          if (priStatA !== priStatB) return priStatA - priStatB
          return (a.name || '').localeCompare(b.name || '')
        }) : []

        setMembers(sorted)
      } catch (err) {
        console.error('Failed to fetch team:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [activeTenure])

  return (
    <section className="container mx-auto px-6">
      {/* Tenure Selector */}
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
                fallbackImage={fallbackImage}
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
  )
}
