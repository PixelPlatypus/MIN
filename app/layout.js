import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import GlobalGradients from '@/components/shared/GlobalGradients'
import { ClientProviders } from './providers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
  preload: false, // Prevents "preloaded but not used" warning if not used immediately
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | MIN',
    default: 'MIN | Mathematics Initiatives in Nepal'
  },
  description: 'Making mathematics accessible, engaging, and inspiring for all students in Nepal.',
  openGraph: {
    type: 'website',
    locale: 'en_NP',
    url: 'https://mathsinitiatives.org.np',
    siteName: 'MIN',
    title: 'Mathematics Initiatives in Nepal',
    description: 'Empowering students across Nepal to excel globally through innovative mathematics education.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIN | Mathematics Initiatives in Nepal',
    description: 'Empowering students across Nepal to excel globally through innovative mathematics education.',
  }
}

import { SmoothScroll } from '@/components/shared/SmoothScroll'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <ClientProviders>
          <ThemeProvider>
            <GlobalGradients />
            {children}
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  )
}
