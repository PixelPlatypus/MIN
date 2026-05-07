'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function TeamStrip({ team }) {
  const hasMembers = team && team.length > 0
  const displayTeam = hasMembers ? [...team, ...team] : []

  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-20 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-2">
            The People
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-headline">
            Our <span className="text-text-primary-dynamic">Team</span>
          </h2>
        </div>
        {hasMembers && (
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary-dynamic hover:text-headline transition-colors group"
          >
            View All Members
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="relative">
        {!hasMembers ? (
          <div className="px-6 md:px-12 lg:px-20 text-center py-16">
            <p className="text-text-tertiary-dynamic text-base mb-6">Our team is growing. Be part of the movement.</p>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 bg-headline text-bg px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Join the Team
            </Link>
          </div>
        ) : (
          <div className="flex gap-6 px-4 w-max animate-marquee will-change-transform">
            {displayTeam.map((member, i) => (
              <div key={`${member.id}-${i}`} className="w-48 shrink-0 group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-border-dynamic">
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="192px"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface flex items-center justify-center">
                      <span className="text-4xl font-bold text-text-tertiary-dynamic">{member.name?.[0] || '?'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <p className="text-xs font-bold text-text-primary-dynamic">{member.name}</p>
                    <p className="text-[10px] text-text-tertiary-dynamic uppercase tracking-wider mt-0.5">{member.role_title}</p>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-text-primary-dynamic truncate">{member.name}</h4>
                <p className="text-xs text-text-tertiary-dynamic truncate mt-0.5">{member.role_title}</p>
              </div>
            ))}
          </div>
        )}

        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
