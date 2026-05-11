import Hero from '@/components/public/Hero'
import StatsCounter from '@/components/public/StatsCounter'
import Mission from '@/components/public/Mission'
import ProgramsGrid from '@/components/public/ProgramsGrid'
import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const Timeline = dynamic(() => import('@/components/public/Timeline'), { ssr: true })
const Recognition = dynamic(() => import('@/components/public/Recognition'), { ssr: true })
const TeamStrip = dynamic(() => import('@/components/public/TeamStrip'), { ssr: true })
const JoinUsCTA = dynamic(() => import('@/components/public/JoinUsCTA'), { ssr: true })

export const metadata = {
  metadataBase: new URL('https://mathsinitiatives.org.np'),
  title: 'Mathematics Initiatives in Nepal (MIN)',
  description: 'MIN is a nonprofit making mathematics accessible, engaging, and inspiring for all students in Nepal. HundrED Top 100 Global Education Innovations 2025.',
  openGraph: {
    title: 'Mathematics Initiatives in Nepal (MIN)',
    description: 'Making mathematics accessible for all students in Nepal.',
    images: ['/images/og-default.png'],
    url: 'https://mathsinitiatives.org.np',
  },
}

export default async function Home() {
  const supabase = await createClient()
  
  // Parallel fetch for core data with correct table names
  const [
    { data: settings },
    { data: programs },
    { data: timeline },
    { data: teamMembers }
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').single(),
    supabase.from('programs').select('*').eq('status', 'ACTIVE').order('order_index', { ascending: true }),
    supabase.from('timeline').select('*').order('year', { ascending: true }),
    supabase.from('team_members').select('*').neq('status', 'REMOVED')
  ])

  // Refined sorting logic to match TeamPage
  const sortedTeam = (teamMembers || [])
    .filter(m => m.status === 'ACTIVE')
    .sort((a, b) => {
      const rolePriority = { 'President': 1, 'Manager': 2, 'MINion': 3 }
      const priRoleA = rolePriority[a.position] || 99
      const priRoleB = rolePriority[b.position] || 99
      if (priRoleA !== priRoleB) return priRoleA - priRoleB
      
      const yearA = new Date(a.joined_date || 0).getTime()
      const yearB = new Date(b.joined_date || 0).getTime()
      if (yearA !== yearB) return yearA - yearB
      
      return (a.name || '').localeCompare(b.name || '')
    })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Mathematics Initiatives in Nepal',
    alternateName: 'MIN',
    url: 'https://mathsinitiatives.org.np',
    logo: 'https://mathsinitiatives.org.np/images/logo.svg',
    description: 'A nonprofit making mathematics accessible, engaging, and inspiring for all students in Nepal.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    sameAs: [
      'https://www.facebook.com/mathsinitiatives',
      'https://www.instagram.com/minnepal',
      'https://www.youtube.com/@mathsinitiatives',
    ],
    award: 'HundrED Top 100 Global Education Innovations 2025',
    email: 'contact@mathsinitiatives.org.np',
  }

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero settings={settings} />
      <StatsCounter settings={settings} />
      <Mission settings={settings} />
      <ProgramsGrid initialPrograms={programs} settings={settings} />
      <Timeline initialEvents={timeline} />
      <Recognition settings={settings} />
      <TeamStrip initialTeam={sortedTeam} />
      <JoinUsCTA settings={settings} />
    </div>
  )
}
