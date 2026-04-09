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
  title: 'Mathematics Initiatives in Nepal (MIN)',
  description: 'Making mathematics accessible, engaging, and inspiring for all students in Nepal.',
}

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
