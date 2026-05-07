'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeamCard from '@/components/public/TeamCard'

export default function TeamView({ initialTenures, initialMembers, initialTenure, fallbackImage }) {
  const [activeTenure, setActiveTenure] = useState(initialTenure)
  const [tenures] = useState(initialTenures || [])
  const [members, setMembers] = useState(initialMembers || [])
  const [loading, setLoading] = useState(false)
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => { if (isFirstMount) { setIsFirstMount(false); return }; async function f() { setLoading(true); try { const r = await fetch(`/api/team?tenure=${activeTenure}`); const d = await r.json(); const rp = { President: 1, Manager: 2, MINion: 3 }; const sp = { ACTIVE: 1, ALUMNI: 2, INACTIVE: 3 }; setMembers(Array.isArray(d) ? [...d].sort((a, b) => (rp[a.position] || 99) - (rp[b.position] || 99) || (new Date(a.joined_date || 0).getFullYear()) - (new Date(b.joined_date || 0).getFullYear()) || (sp[a.status] || 99) - (sp[b.status] || 99) || (a.name || '').localeCompare(b.name || '')) : []) } catch {} finally { setLoading(false) } } f() }, [activeTenure])

  return (
    <section className="px-6 md:px-12 lg:px-20">
      <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
        {tenures.length === 0 ? [...Array(3)].map((_, i) => <div key={i} className="w-28 h-10 rounded-xl bg-white/[0.03] animate-pulse" />) : tenures.map((tenure) => (
          <button key={tenure} onClick={() => setActiveTenure(tenure)} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTenure === tenure ? 'bg-headline text-bg' : 'border border-border text-text-secondary-dynamic hover:text-headline hover:border-headline/40'}`}>Tenure {tenure}</button>
        ))}
      </div>
      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{[...Array(8)].map((_, i) => <div key={i} className="space-y-3"><div className="aspect-[4/5] rounded-2xl bg-white/[0.03] animate-pulse" /><div className="h-5 w-3/4 rounded-lg bg-white/[0.03] animate-pulse" /><div className="h-4 w-1/2 rounded-lg bg-white/[0.03] animate-pulse" /></div>)}</div> : members.length > 0 ? <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><AnimatePresence mode="popLayout">{members.map((member, i) => <TeamCard key={member.id} member={member} index={i} fallbackImage={fallbackImage} />)}</AnimatePresence></motion.div> : <div className="text-center py-24 rounded-2xl border border-border bg-surface"><p className="text-lg text-text-secondary-dynamic">No team members found for this tenure.</p></div>}
    </section>
  )
}
