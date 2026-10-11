import { SITE_URL, SITE_NAME, SITE_SUMMARY } from '@/lib/site'

export const metadata = {
  title: 'About MIN',
  description: 'Mathematics Initiatives in Nepal (MIN) is a nonprofit making mathematics accessible and fun for every student in Nepal, and teaching it as a tool for life.',
  keywords: ['About MIN Nepal', 'Mathematics Initiatives in Nepal', 'Accessible mathematics Nepal', 'Maths education Nepal', 'Mathmagicians', 'HundrED 2025 Nepal'],
  openGraph: {
    title: 'About MIN | Mathematics Initiatives in Nepal',
    url: '/about',
    description: 'Making mathematics accessible and fun for every student in Nepal, and teaching it as a tool for life.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'About MIN — Mathematics Initiatives in Nepal' }],
  },
  alternates: { canonical: '/about' },
}

// The NGO entity is defined once in the root layout; this page adds AboutPage + FAQ (used by AI answers)
const faq = [
  ['What is Mathematics Initiatives in Nepal (MIN)?',
   'Mathematics Initiatives in Nepal (MIN) is a nonprofit founded in 2020 in Kathmandu. It works to make mathematics accessible and fun for every student in Nepal, and teaches it as a practical tool for everyday life.'],
  ['What does MIN do?',
   'MIN helps students see mathematics as a tool they can use anywhere, not only as a school subject. Alongside that core work, MIN runs Olympiad training, workshops and other events for students across Nepal.'],
  ['Is MIN only for Olympiad students?',
   'No. MIN is for every student. Its main focus is general mathematics and making it accessible to all. Olympiad training is one of several programs for students who want to go further.'],
  ['What is a mathmagician?',
   'Mathmagician is the word MIN uses for a student who is confident with mathematics and uses it as a tool wherever they go. MIN wants every student in Nepal to become one.'],
  ['When was MIN founded?',
   'Mathematics Initiatives in Nepal (MIN) was founded in 2020 and is based in Kathmandu, Nepal.'],
  ['What recognition has MIN received?',
   'In 2025, HundrED named MIN one of its Top 100 global education innovations.'],
  ['How can I contact MIN?',
   `Email contact@mathsinitiatives.org.np or use the contact form at ${SITE_URL}/contact.`],
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${SITE_NAME}`,
    url: `${SITE_URL}/about`,
    description: SITE_SUMMARY,
    about: { '@type': 'NGO', name: SITE_NAME, url: SITE_URL },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
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
