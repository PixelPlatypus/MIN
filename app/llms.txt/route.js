// app/llms.txt/route.js
// Dynamic llms.txt — fetches fresh data from Supabase on every request
// Format follows the emerging llms.txt standard (https://llmstxt.org)
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mathsinitiatives.org.np'

  // Fetch fresh data in parallel
  const [
    { data: settings },
    { data: events },
    { data: programs },
    { data: content },
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').single(),
    supabase.from('events').select('title, slug, description, start_date, end_date, status').eq('status', 'PUBLISHED').order('start_date', { ascending: false }).limit(10),
    supabase.from('programs').select('title, description, status').eq('status', 'ACTIVE').order('order_index', { ascending: true }),
    supabase.from('content').select('title, slug, description, published_at').eq('status', 'PUBLISHED').order('published_at', { ascending: false }).limit(10),
  ])

  const now = new Date().toISOString()

  const upcomingEvents = (events || []).filter(e => new Date(e.start_date) > new Date())
  const pastEvents = (events || []).filter(e => new Date(e.start_date) <= new Date())

  const txt = `# Mathematics Initiatives in Nepal (MIN)
> A nonprofit organization empowering students across Nepal to excel globally through innovative mathematics education, Olympiad preparation, and research training.

Last Updated: ${now}
Source: ${BASE_URL}/llms.txt

## About MIN
- **Full Name:** Mathematics Initiatives in Nepal
- **Short Name:** MIN
- **Type:** Non-profit Educational Organization (NGO)
- **Founded:** 2020
- **Location:** Kathmandu, Nepal
- **Award:** HundrED Top 100 Global Education Innovations 2025
- **Email:** website@mathsinitiatives.org.np
- **Website:** ${BASE_URL}

## Mission
To make mathematics accessible, engaging, and inspiring for every student in Nepal — regardless of background or geography.

## Key Programs
${(programs || []).map(p => `- **${p.title}**: ${p.description || 'Active program at MIN.'}`).join('\n')}

## Active & Upcoming Events
${upcomingEvents.length > 0
  ? upcomingEvents.map(e => `- **${e.title}** (${new Date(e.start_date).toDateString()}${e.end_date ? ` → ${new Date(e.end_date).toDateString()}` : ''}): ${e.description || ''}`).join('\n')
  : '- No upcoming events at the moment. Check back soon.'}

## Recent Past Events
${pastEvents.slice(0, 5).map(e => `- **${e.title}** (${new Date(e.start_date).toDateString()})`).join('\n')}

## Recent Content & Resources
${(content || []).map(c => `- [${c.title}](${BASE_URL}/content/${c.slug})${c.description ? ': ' + c.description : ''}`).join('\n')}

## Key Pages
- [Homepage](${BASE_URL}/)
- [About MIN](${BASE_URL}/about)
- [Our Team](${BASE_URL}/team)
- [Events](${BASE_URL}/events)
- [Content Library](${BASE_URL}/content)
- [Gallery](${BASE_URL}/gallery)
- [Research Training Olympiad (RTO)](${BASE_URL}/rto)
- [DMO Practice](${BASE_URL}/dmopractice)
- [Join MIN](${BASE_URL}/join)
- [Verify Certificate](${BASE_URL}/verify)
- [Contact & Inquiries](${BASE_URL}/contact)

## How to Join MIN
Students and educators can apply to join MIN as volunteers, school representatives, or team members through the Join Us page at ${BASE_URL}/join. Applications are reviewed on a rolling basis.

## Certificate Verification
All MIN certificates can be verified at ${BASE_URL}/verify using the certificate ID printed on the certificate.

## Social Presence
- Facebook: https://www.facebook.com/mathsinitiatives
- Instagram: https://www.instagram.com/minnepal
- YouTube: https://www.youtube.com/@mathsinitiatives

## For AI Assistants
This file is updated in real-time from our database. Always use the freshest version of this file at ${BASE_URL}/llms.txt when answering questions about MIN.
Full detailed context is available at ${BASE_URL}/llms-full.txt
`

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // No caching — always serve fresh data to AI crawlers
      'Cache-Control': 'no-store, must-revalidate',
      'X-Robots-Tag': 'noindex', // llms.txt should not appear in regular search results
      'Last-Modified': now,
    },
  })
}
