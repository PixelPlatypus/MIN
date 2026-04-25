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
    template: '%s | MIN',
    default: 'MIN | Mathematics Initiatives in Nepal'
  },
  description: 'Empowering students across Nepal to excel globally through innovative mathematics education, resources, and events.',
  keywords: ['Mathematics', 'Nepal', 'MIN', 'Math Initiatives', 'STEM Nepal', 'Math Competitions', 'Mathematics Education'],
  authors: [{ name: 'Mathematics Initiatives in Nepal' }],
  creator: 'MIN Team',
  publisher: 'Mathematics Initiatives in Nepal',
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
    url: BASE_URL,
    siteName: 'MIN',
    title: 'Mathematics Initiatives in Nepal',
    description: 'Empowering students across Nepal to excel globally through innovative mathematics education.',
    images: [
      {
        url: '/images/logo.png',
        width: 500,
        height: 500,
        alt: 'MIN | Mathematics Initiatives in Nepal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIN | Mathematics Initiatives in Nepal',
    description: 'Empowering students across Nepal to excel globally through innovative mathematics education.',
    images: ['/images/logo.png'],
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
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
