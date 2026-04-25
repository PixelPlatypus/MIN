'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
// GSAP removed in favor of CSS marquee for performance
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

export default function TeamStrip() {
  const [team, setTeam] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTeam() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/team')
        if (res.ok) {
          const data = await res.json()
          // Only show people with images and filter for a "highlight" if needed, 
          // but for now just show all current members
          setTeam(data.filter(m => m.is_current))
        }
      } catch (err) {
        console.error('Failed to fetch team for strip:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeam()
  }, [])

  if (!isLoading && team.length === 0) return null

  // Double the list for seamless loop
  const displayTeam = [...team, ...team]

  return (
    <section className="py-20 overflow-hidden bg-bg-secondary/30 dark:bg-white/5 border-y border-black/5 dark:border-white/5">
      <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Our Brilliant Team</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-lg font-medium">The minds driving innovation across Nepal.</p>
        </div>
        <Link 
          href="/team" 
          className="text-primary font-bold hover:underline underline-offset-8 flex items-center gap-2"
        >
          View All Members
        </Link>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex gap-8 px-6 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-64 flex-shrink-0 space-y-4">
                <Skeleton className="aspect-[4/5] rounded-3xl" />
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
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-xl">
                  {member.image_url ? (
                    <Image 
                      src={member.image_url} 
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="256px"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/20">
                      <span className="text-4xl font-black">{member.name[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h4 className="font-bold text-lg">{member.name}</h4>
                <p className="text-sm text-text-tertiary dark:text-text-tertiary-dark uppercase tracking-widest font-bold">{member.role_title}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
