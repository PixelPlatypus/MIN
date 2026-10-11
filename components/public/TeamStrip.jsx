'use client'
import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
// GSAP removed in favor of CSS marquee for performance
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

export default function TeamStrip({ initialTeam = [] }) {
  const [team, setTeam] = useState(initialTeam || [])
  const [isLoading, setIsLoading] = useState(!(initialTeam && initialTeam.length > 0))

  useEffect(() => {
    if (initialTeam?.length) {
      setTeam(initialTeam)
      setIsLoading(false)
      return
    }

    async function fetchTeam() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/team')
        if (res.ok) {
          const data = await res.json()
          setTeam(data.filter(m => m.status === 'ACTIVE'))
        }
      } catch (err) {
        console.error('Failed to fetch team for strip:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeam()
  }, [initialTeam])

  if (!isLoading && team.length === 0) return null

  // Double the list for seamless loop
  const displayTeam = [...team, ...team]

  return (
    <section className="py-20 overflow-hidden border-y border-primary/10 dark:border-white/10">
      <div className="container mx-auto px-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Brilliant Team</h2>
          <p className="text-auto-secondary text-lg font-medium">The minds driving innovation across Nepal.</p>
        </div>
        <Link 
          href="/team" 
          className="btn-brand-outline px-6 py-3 text-sm self-start sm:self-auto shrink-0"
        >
          View All Members
        </Link>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex gap-8 px-6 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-64 flex-shrink-0 space-y-4">
                <Skeleton className="aspect-[4/5] rounded-[2rem]" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="flex gap-8 px-4 w-max animate-marquee pointer-events-none sm:pointer-events-auto will-change-transform"
          >
            {displayTeam.map((member, i) => (
              <div 
                key={`${member.id}-${i}`}
                className="w-64 flex-shrink-0 group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 card-brand">
                  {member.photo_url ? (
                    <Image 
                      src={member.photo_url} 
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="256px"
                    />
                  ) : (
                    <Image 
                      src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop"
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 grayscale"
                      sizes="256px"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h4 className="font-bold text-lg group-hover:text-primary dark:group-hover:text-secondary transition-colors">{member.name}</h4>
                <p className="text-sm text-primary dark:text-secondary font-semibold">{member.role_title}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg via-bg/50 to-transparent dark:from-bg-dark dark:via-bg-dark/50 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg via-bg/50 to-transparent dark:from-bg-dark dark:via-bg-dark/50 pointer-events-none" />
      </div>
    </section>
  )
}
