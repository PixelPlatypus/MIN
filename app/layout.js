import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import GlobalGradients from '@/components/shared/GlobalGradients'
import { ClientProviders } from './providers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import SitePreloader from '@/components/shared/SitePreloader'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mathsinitiatives.org.np'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | MIN Nepal',
    default: 'Mathematics Initiatives in Nepal (MIN)'
  },
  description: 'Empowering students across Nepal to excel globally through innovative mathematics education, Olympiad preparation, research training, and inspiring events.',
  keywords: [
    'Mathematics Initiatives Nepal', 'MIN Nepal', 'Math Olympiad Nepal',
    'STEM Nepal', 'Nepal Math Education', 'Mathematics Competition Nepal',
    'HundrED 2025', 'Research Training Olympiad', 'DMO Nepal', 'Math Club Nepal'
  ],
  authors: [{ name: 'Mathematics Initiatives in Nepal', url: BASE_URL }],
  creator: 'MIN Team',
  publisher: 'Mathematics Initiatives in Nepal',
  category: 'Education',
  classification: 'Non-profit Educational Organization',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_NP',
    alternateLocale: ['en_US'],
    url: BASE_URL,
    siteName: 'Mathematics Initiatives in Nepal',
    title: 'Mathematics Initiatives in Nepal (MIN)',
    description: 'Empowering students across Nepal to excel globally through innovative mathematics education, Olympiad preparation, and research training.',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Mathematics Initiatives in Nepal (MIN)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@minnepal',
    creator: '@minnepal',
    title: 'Mathematics Initiatives in Nepal (MIN)',
    description: 'Empowering students across Nepal to excel globally through innovative mathematics education.',
    images: ['/images/og-default.png'],
  }
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Mathematics Initiatives in Nepal',
  alternateName: 'MIN',
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
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
  award: 'HundrED Top 100 Global Education Innovations 2025',
  email: 'website@mathsinitiatives.org.np',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        {/* Global Organization JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <ClientProviders>
            <SitePreloader />
            <GlobalGradients />
            {children}
            <Analytics />
            <SpeedInsights />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
