export const metadata = {
  title: 'About MIN',
  description: 'Learn about Mathematics Initiatives in Nepal (MIN) — our mission to make mathematics accessible, engaging, and inspiring for every student in Nepal. HundrED Top 100 Global Innovations 2025.',
  keywords: ['About MIN Nepal', 'Mathematics Initiatives Nepal Mission', 'MIN History', 'Math Education Nepal', 'HundrED 2025 Nepal'],
  openGraph: {
    title: 'About MIN | Mathematics Initiatives in Nepal',
    description: 'Learn about our mission to make mathematics accessible, engaging, and inspiring for every student in Nepal.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'About MIN — Mathematics Initiatives in Nepal' }],
  },
  alternates: { canonical: '/about' },
}

const BASE_URL = 'https://mathsinitiatives.org.np'

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Mathematics Initiatives in Nepal',
    alternateName: 'MIN',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    foundingDate: '2020',
    description: 'A nonprofit making mathematics accessible, engaging, and inspiring for all students in Nepal.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'website@mathsinitiatives.org.np',
      contactType: 'customer support',
    },
    award: 'HundrED Top 100 Global Education Innovations 2025',
    knowsAbout: ['Mathematics Education', 'Math Olympiad', 'Research Training', 'STEM Nepal'],
    sameAs: [
      'https://www.facebook.com/mathsinitiatives',
      'https://www.instagram.com/minnepal',
      'https://www.youtube.com/@mathsinitiatives',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Mathematics Initiatives in Nepal (MIN)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mathematics Initiatives in Nepal (MIN) is a non-profit organization founded in 2020 that works to make mathematics accessible, engaging, and inspiring for every student in Nepal. MIN was recognized as a HundrED Top 100 Global Education Innovation in 2025.',
        },
      },
      {
        '@type': 'Question',
        name: 'When was MIN founded?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mathematics Initiatives in Nepal (MIN) was founded in 2020 and is headquartered in Kathmandu, Nepal.',
        },
      },
      {
        '@type': 'Question',
        name: 'What awards has MIN received?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MIN was recognized as a Top 100 Global Education Innovation by HundrED in 2025, placing it among the world\'s most impactful educational initiatives.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the mission of MIN?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MIN\'s mission is to make mathematics accessible, engaging, and inspiring for every student in Nepal, regardless of socioeconomic background or geographic location.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I contact MIN?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can contact Mathematics Initiatives in Nepal by emailing website@mathsinitiatives.org.np or using the contact form at mathsinitiatives.org.np/contact.',
        },
      },
    ],
  },
]

export default function Layout({ children }) {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  )
}
