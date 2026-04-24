// app/robots.js
export default function robots() {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mathsinitiatives.org.np'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/login',
          '/*?*', // Disallow query parameters to prevent duplicate content indexing
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
