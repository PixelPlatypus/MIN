export const metadata = {
  title: 'Task Bank',
  description: 'Browse and complete tasks assigned by the Mathematics Initiatives in Nepal team. Find your active assignments, deadlines, and submission instructions here.',
  keywords: ['MIN Task Bank', 'Mathematics Initiatives Nepal Tasks', 'Volunteer Tasks', 'MIN Assignments', 'Math Nepal Tasks'],
  openGraph: {
    title: 'Task Bank | MIN',
    description: 'Browse and complete tasks assigned by the Mathematics Initiatives in Nepal team.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'Task Bank — MIN' }],
  },
  alternates: { canonical: '/tasks' },
}

export default function Layout({ children }) {
  return children
}
