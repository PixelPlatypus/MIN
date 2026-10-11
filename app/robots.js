// app/robots.js — production robots.txt with AEO rules
import { SITE_URL } from '@/lib/site'

// /_next/ must stay crawlable: Google renders pages with the JS/CSS served from there.
export default function robots() {
  const BASE_URL = SITE_URL

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
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
