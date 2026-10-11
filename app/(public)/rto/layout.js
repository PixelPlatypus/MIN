export const metadata = {
  title: 'Road to Olympiad (RTO)',
  description: 'How the mathematics olympiad pathway works in Nepal, from the District Mathematics Olympiad to the IMO, with a study roadmap for each stage and links to practice material.',
  keywords: ['Road to Olympiad', 'RTO', 'Nepal Math Olympiad', 'DMO Nepal', 'PMO Nepal', 'NMO Nepal', 'IMO Nepal', 'Olympiad preparation Nepal', 'MIN RTO'],
  openGraph: {
    title: 'Road to Olympiad (RTO) | MIN',
    description: 'The olympiad pathway in Nepal, from DMO to IMO, with a study roadmap for each stage.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'Road to Olympiad — MIN' }],
  },
  alternates: { canonical: '/rto' },
}

// LearningResource + FAQ JSON-LD for AI answer engines
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Road to Olympiad (RTO)',
    description: 'A guide from Mathematics Initiatives in Nepal to the mathematics olympiad pathway in Nepal: the selection stages from the District Mathematics Olympiad to the International Mathematical Olympiad, a four-phase study roadmap, and recommended books, platforms and past papers.',
    provider: {
      '@type': 'NGO',
      name: 'Mathematics Initiatives in Nepal',
      sameAs: 'https://www.mathsinitiatives.org.np',
    },
    educationalLevel: 'High School',
    learningResourceType: 'Study guide',
    isAccessibleForFree: true,
    teaches: 'Olympiad algebra, number theory, geometry, combinatorics and proof writing',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Road to Olympiad (RTO) by MIN?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Road to Olympiad (RTO) is a guide from Mathematics Initiatives in Nepal for students preparing for mathematics olympiads. It explains how students in Nepal are selected for the International Mathematical Olympiad, what to study at each stage, and where to find books, online platforms and past papers.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the stages of the mathematics olympiad in Nepal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Students start at the District Math Olympiad (DMO). Top performers move on to the Provincial Math Olympiad (PMO) and then the National Math Olympiad (NMO). The strongest students attend the Olympiad Training Camp, and the national team represents Nepal at the International Mathematical Olympiad (IMO).',
        },
      },
      {
        '@type': 'Question',
        name: 'How should I prepare for the DMO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The RTO roadmap suggests building school mathematics first: algebra basics, number theory basics such as GCD, LCM and modular arithmetic, geometry and counting, along with exam skills like time management. MIN also offers free timed DMO mock papers at mathsinitiatives.org.np/dmopractice.',
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
