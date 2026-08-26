export const metadata = {
  title: 'DMO Practice',
  description: 'Practice interactive math problems and prepare for the District Math Olympiad (DMO) with sets curated by the MIN team.',
  keywords: ['DMO Practice', 'District Math Olympiad', 'Nepal Math Problems', 'Math Practice Nepal', 'MIN DMO', 'Mathematics Competition Nepal'],
  openGraph: {
    title: 'DMO Practice | MIN',
    description: 'Practice interactive math problems and prepare for the District Math Olympiad (DMO) with sets curated by the MIN team.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'DMO Practice — MIN' }],
  },
  alternates: { canonical: '/dmopractice' },
}

export default function Layout({ children }) {
  return children
}
