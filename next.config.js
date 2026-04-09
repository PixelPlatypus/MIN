/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['isomorphic-dompurify', 'dompurify', 'cloudinary', 'resend'],
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
          { key: 'X-Frame-Options', value: 'DENY' },
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://upload-widget.cloudinary.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.supabase.co",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://api.cloudinary.com",
              "frame-src 'self' https://www.youtube.com",
              "media-src 'self' https://res.cloudinary.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
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
      'gsap'
    ],
  },
}

export default nextConfig;
