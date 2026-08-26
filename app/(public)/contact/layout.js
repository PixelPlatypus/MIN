export const metadata = {
  title: 'Contact & Inquiries',
  description: 'Get in touch with Mathematics Initiatives in Nepal (MIN) for academic collaborations, partnership proposals, Olympiad inquiries, or general questions.',
  keywords: ['Contact MIN', 'Mathematics Initiatives Nepal Contact', 'Math Olympiad Nepal Inquiry', 'MIN Partnership', 'Contact Us Nepal Math'],
  openGraph: {
    title: 'Contact & Inquiries | MIN',
    description: 'Reach out to the Mathematics Initiatives in Nepal team for collaborations, partnerships, or any academic inquiries.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'Contact — MIN' }],
  },
  alternates: { canonical: '/contact' },
}

const BASE_URL = 'https://mathsinitiatives.org.np'

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Mathematics Initiatives in Nepal',
  url: `${BASE_URL}/contact`,
  description: 'Contact page for Mathematics Initiatives in Nepal (MIN) — for academic collaborations, Olympiad inquiries, and partnership proposals.',
  mainEntity: {
    '@type': 'NGO',
    name: 'Mathematics Initiatives in Nepal',
    url: BASE_URL,
    email: 'website@mathsinitiatives.org.np',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'website@mathsinitiatives.org.np',
        contactType: 'general inquiry',
        availableLanguage: ['English', 'Nepali'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/mathsinitiatives',
      'https://www.instagram.com/minnepal',
    ],
  },
}

export default function Layout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  )
}
