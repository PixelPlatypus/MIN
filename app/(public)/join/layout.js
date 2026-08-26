export const metadata = {
  title: 'Join MIN',
  description: 'Apply to become a volunteer, ambassador, or school representative at Mathematics Initiatives in Nepal. Make a meaningful impact on math education across Nepal.',
  keywords: ['Join MIN Nepal', 'Math Volunteer Nepal', 'Mathematics Initiatives Nepal Apply', 'Math Club Nepal Join', 'STEM Volunteer Nepal'],
  openGraph: {
    title: 'Join MIN | Mathematics Initiatives in Nepal',
    description: 'Apply to become a volunteer, ambassador, or school representative. Make a difference in the landscape of mathematics in Nepal.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'Join MIN — Mathematics Initiatives in Nepal' }],
  },
  alternates: { canonical: '/join' },
}

// FAQ JSON-LD for AI answer engines — injected in page layout
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How can I join Mathematics Initiatives in Nepal (MIN)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can apply to join MIN by filling out the application form at mathsinitiatives.org.np/join. Applications are open on a rolling basis for volunteers, school representatives, and team members.',
      },
    },
    {
      '@type': 'Question',
      name: 'What roles are available at MIN?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MIN welcomes applications for volunteers, school ambassadors, content writers, event coordinators, and research mentors. Roles vary by current organizational needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there an age requirement to join MIN?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MIN is open to high school students, university students, and educators who are passionate about mathematics education in Nepal. Specific programs may have their own eligibility criteria.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does MIN charge a membership fee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. MIN is a non-profit organization committed to accessibility. Joining MIN as a volunteer or team member is completely free.',
      },
    },
    {
      '@type': 'Question',
      name: 'When does MIN open applications?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MIN reviews applications on a rolling basis throughout the year. Some specific programs like the Research Training Olympiad (RTO) have dedicated application windows announced on the website.',
      },
    },
  ],
}

export default function Layout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  )
}
