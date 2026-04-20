/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['isomorphic-dompurify', 'dompurify', 'resend'],
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'szosktbhsgqnyvbxmprf.supabase.co' },
    ],
  },

  skipTrailingSlashRedirect: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://upload-widget.cloudinary.com https://va.vercel-scripts.com https://*.vercel-scripts.com https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live",
              "font-src 'self' https://fonts.gstatic.com https://vercel.live data:",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.supabase.co https://vercel.com https://vercel.live",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://api.cloudinary.com https://vitals.vercel-insights.com https://*.vercel-scripts.com https://vercel.live",
              "frame-src 'self' https://www.youtube.com https://res.cloudinary.com https://*.supabase.co https://docs.google.com https://vercel.live",
              "media-src 'self' https://res.cloudinary.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ]
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  
  // Experimental performance flags
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion',
    ],
  },
}

export default nextConfig;
