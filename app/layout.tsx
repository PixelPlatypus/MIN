import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { MinCursor } from '@/components/ui/min-cursor'
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button'
import 'katex/dist/katex.min.css'
import AnimatedGlassmorphicBackground from '@/components/ui/animated-glassmorphic-background'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Mathematics Initiatives in Nepal (MIN) - Transforming Math Education',
  description: 'Mathematics Initiatives in Nepal (MIN) is a prominent non-profit platform transforming math education in Nepal. We make math engaging, accessible, and enjoyable for students of all ages, addressing math anxiety and promoting deep understanding through Olympiad training, free resources, women empowerment initiatives, interactive activities, and mathematical modeling bootcamps. Join our global community.',
  keywords: 'Mathematics Initiatives Nepal, MIN, math education Nepal, Junior Mathematics Olympiad Camps, JMOC, Olymprep, Road to Olympiad, ETA campaigns, Women in Mathematics, Girls Mathematics Olympiad Camp, eli5, Mathematical Modelling Bootcamp, Sunaulo Sanibar, math games, math anxiety, rote learning, Kathmandu University Computational Mathematics Club, SOMAES, HundrED 2025 Global Collection, math Olympiad training, accessible math, engaging math, Nepal education, global math community',
  generator: 'MIN',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AnimatedGlassmorphicBackground />
        <MinCursor />
        {children}
        <ScrollToTopButton />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
