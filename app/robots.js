// app/robots.js — production robots.txt with AEO rules
export default function robots() {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mathsinitiatives.org.np'

  return {
    rules: [
      // === Standard Search Engines ===
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot', 'facebot', 'ia_archiver'],
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login',
          '/auth/',
          '/_next/',
          '/admin/users/',
          '/admin/audit/',
          '/admin/settings/',
        ],
      },

      // === AI Answer Engines — Allow with fresh-content guidance ===
      // These bots index pages for AI answers (Perplexity, ChatGPT, Gemini, Bing Copilot, etc.)
      {
        userAgent: [
          'GPTBot',               // OpenAI ChatGPT
          'ChatGPT-User',         // ChatGPT browsing
          'Google-Extended',      // Google Gemini / AI Overviews
          'PerplexityBot',        // Perplexity AI
          'ClaudeBot',            // Anthropic Claude
          'anthropic-ai',         // Anthropic general
          'cohere-ai',            // Cohere
          'Applebot-Extended',    // Apple Siri / intelligence
          'Applebot',             // Apple
          'YouBot',               // You.com AI
          'iaskspider',           // iAsk AI
          'Diffbot',              // Diffbot knowledge graph
          'Brightbot',            // Bright Data AI
          'CCBot',                // Common Crawl (feeds many AI models)
          'DataForSeoBot',        // DataForSEO
          'Omgilibot',            // Omgili / Webz.io
          'FacebookBot',          // Meta AI
          'Meta-ExternalAgent',   // Meta AI Llama
        ],
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/sitemap.xml',
          '/about',
          '/team',
          '/events',
          '/content',
          '/gallery',
          '/rto',
          '/dmopractice',
          '/join',
          '/tasks',
          '/contact',
          '/verify',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/login',
          '/auth/',
          '/_next/',
        ],
      },

      // === Block Harmful/Unknown Scrapers ===
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'MajesticSEO',
          'BLEXBot',
          'PetalBot',
        ],
        disallow: '/',
      },

      // === Default Rule ===
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login',
          '/auth/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
