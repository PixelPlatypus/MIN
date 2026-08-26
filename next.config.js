/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['isomorphic-dompurify', 'dompurify', 'resend'],

  // Remove X-Powered-By header (security + slightly smaller response)
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
    // Enable modern image formats for smaller payload
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    // Reasonable device size breakpoints
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://upload-widget.cloudinary.com https://va.vercel-scripts.com https://*.vercel-scripts.com https://vercel.live https://www.desmos.com https://*.desmos.com",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live",
              "font-src 'self' https://fonts.gstatic.com https://vercel.live data:",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.supabase.co https://vercel.com https://vercel.live https://*.youtube.com https://*.ytimg.com https://www.desmos.com https://*.desmos.com https://api.qrserver.com https://cdn-icons-png.flaticon.com",
              "connect-src 'self' ws: wss: https://*.supabase.co wss://*.supabase.co https://api.resend.com https://api.cloudinary.com https://vitals.vercel-insights.com https://*.vercel-scripts.com https://vercel.live https://*.youtube.com https://*.ytimg.com https://www.desmos.com https://*.desmos.com",
              "frame-src 'self' https://*.youtube.com https://res.cloudinary.com https://*.supabase.co https://docs.google.com https://vercel.live https://www.desmos.com https://*.desmos.com",
              "media-src 'self' data: https://res.cloudinary.com https://*.youtube.com https://*.ytimg.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
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
      // Cache sitemap & robots for 1 hour (so search engines get fresh data regularly)
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
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
      '@phosphor-icons/react',
      'framer-motion',
      'date-fns',
      'lodash',
    ],
  },
}

export default nextConfig;
