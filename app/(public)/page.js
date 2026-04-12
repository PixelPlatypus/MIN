import Hero from '@/components/public/Hero'
import StatsCounter from '@/components/public/StatsCounter'
import Mission from '@/components/public/Mission'
import ProgramsGrid from '@/components/public/ProgramsGrid'
import dynamic from 'next/dynamic'

const Timeline = dynamic(() => import('@/components/public/Timeline'), { ssr: true })
const Recognition = dynamic(() => import('@/components/public/Recognition'), { ssr: true })
const TeamStrip = dynamic(() => import('@/components/public/TeamStrip'), { ssr: true })
const JoinUsCTA = dynamic(() => import('@/components/public/JoinUsCTA'), { ssr: true })

export const metadata = {
  metadataBase: new URL('https://mathsinitiatives.org.np'),
  title: 'Mathematics Initiatives in Nepal (MIN)',
  description: 'MIN is a nonprofit making mathematics accessible, engaging, and inspiring for all students in Nepal. HundrED Top 100 Global Education Innovations 2024.',
  openGraph: {
    title: 'Mathematics Initiatives in Nepal (MIN)',
    description: 'Making mathematics accessible for all students in Nepal.',
    images: ['/images/og-default.png'],
    url: 'https://mathsinitiatives.org.np',
  },
}

export default function Home() {
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
    award: 'HundrED Top 100 Global Education Innovations 2024',
    email: 'contact@mathsinitiatives.org.np',
  }

  return (
    <div className="space-y-12 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <StatsCounter />
      <Mission />
      <ProgramsGrid />
      <Timeline />
      <Recognition />
      <TeamStrip />
      <JoinUsCTA />
    </div>
  )
}
