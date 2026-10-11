import Hero from '@/components/public/Hero'
import StatsCounter from '@/components/public/StatsCounter'
import Mission from '@/components/public/Mission'
import ProgramsGrid from '@/components/public/ProgramsGrid'
import { createPublicClient, getSiteSettings } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_SHORT_DESCRIPTION, SITE_SUMMARY } from '@/lib/site'

const Timeline = dynamic(() => import('@/components/public/Timeline'), { ssr: true })
const Recognition = dynamic(() => import('@/components/public/Recognition'), { ssr: true })
const JoinUsCTA = dynamic(() => import('@/components/public/JoinUsCTA'), { ssr: true })

export const metadata = {
  title: 'Mathematics Initiatives in Nepal (MIN)',
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'Mathematics Initiatives in Nepal (MIN)',
    description: SITE_SHORT_DESCRIPTION,
    images: ['/images/og-default.png'],
    url: SITE_URL,
  },
  alternates: { canonical: '/' },
}

export default async function Home() {
  const supabase = createPublicClient()
  
  // Parallel fetch for core data with correct table names
  const [
    { data: settings },
    { data: programs },
    { data: timeline }
  ] = await Promise.all([
    getSiteSettings().then(data => ({ data })),
    supabase.from('programs').select('*').eq('status', 'ACTIVE').order('display_order', { ascending: true }),
    supabase.from('timeline_events').select('*').order('sort_order', { ascending: true })
  ])


  // Org (NGO) JSON-LD lives in the root layout on every page; the homepage adds the WebSite entity
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'MIN',
    url: SITE_URL,
    description: SITE_SUMMARY,
    inLanguage: 'en',
    publisher: { '@type': 'NGO', name: SITE_NAME, url: SITE_URL },
  }

  return (
    <div className="space-y-12 pb-24">
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
      <JoinUsCTA settings={settings} />
    </div>
  )
}
