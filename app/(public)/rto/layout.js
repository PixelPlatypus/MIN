export const metadata = {
  title: 'Research Training Olympiad (RTO)',
  description: 'Apply to the Research Training Olympiad — MIN\'s flagship program transforming high-school students into researchers through rigorous mathematical thinking and academic mentorship.',
  keywords: ['Research Training Olympiad', 'RTO', 'Nepal Math Olympiad', 'High School Research', 'Mathematics Research Nepal', 'MIN RTO', 'Math Mentorship Nepal'],
  openGraph: {
    title: 'Research Training Olympiad (RTO) | MIN',
    description: 'MIN\'s flagship program transforming high-school students into researchers through rigorous mathematical thinking and academic mentorship.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'Research Training Olympiad — MIN' }],
  },
  alternates: { canonical: '/rto' },
}

// Course + FAQ JSON-LD for AI answer engines
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Research Training Olympiad (RTO)',
    description: 'MIN\'s flagship program that selects talented high-school students and pairs them with university mentors for structured research training in advanced mathematics.',
    provider: {
      '@type': 'NGO',
      name: 'Mathematics Initiatives in Nepal',
      sameAs: 'https://mathsinitiatives.org.np',
    },
    educationalLevel: 'High School',
    inLanguage: ['en', 'ne'],
    isAccessibleForFree: true,
    courseMode: 'blended',
    teaches: 'Advanced mathematics, research methodology, academic writing, mathematical problem-solving',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'blended',
      location: {
        '@type': 'Place',
        name: 'Nepal',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the Research Training Olympiad (RTO) by MIN?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Research Training Olympiad (RTO) is Mathematics Initiatives in Nepal\'s flagship program that selects talented high-school students and pairs them with university mentors for a structured research training experience focused on advanced mathematics. Students work on original research problems and develop academic skills.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who is eligible for the MIN Research Training Olympiad?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The RTO is open to high-school students across Nepal who demonstrate strong interest and aptitude in mathematics. Students must apply during the application window and go through a selection process.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the Research Training Olympiad free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The RTO is a free program offered by MIN as part of its mission to make quality math education accessible to all students in Nepal regardless of background.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I apply for the MIN RTO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Applications for the Research Training Olympiad open annually. Visit mathsinitiatives.org.np/rto for the current application window, eligibility criteria, and the application form.',
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
