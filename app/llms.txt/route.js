// app/llms.txt/route.js
// llms.txt (https://llmstxt.org), regenerated from Supabase at most hourly (ISR)
import { createPublicClient } from '@/lib/supabase/server'
import { SITE_URL, SITE_SUMMARY, SOCIAL_LINKS } from '@/lib/site'

export const revalidate = 3600

export async function GET() {
  const supabase = createPublicClient()
  const BASE_URL = SITE_URL

  // Fetch fresh data in parallel
  const [
    { data: settings },
    { data: events },
    { data: programs },
    { data: content },
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').single(),
    supabase.from('events').select('title, slug, description, start_date, end_date, status').eq('status', 'PUBLISHED').order('start_date', { ascending: false }).limit(10),
    supabase.from('programs').select('name, tagline, status').eq('status', 'ACTIVE').order('display_order', { ascending: true }),
    supabase.from('content').select('title, slug, excerpt, published_at').eq('status', 'PUBLISHED').order('published_at', { ascending: false }).limit(10),
  ])

  const now = new Date().toISOString()

  const upcomingEvents = (events || []).filter(e => new Date(e.start_date) > new Date())
  const pastEvents = (events || []).filter(e => new Date(e.start_date) <= new Date())

  const txt = `# Mathematics Initiatives in Nepal (MIN)
> ${SITE_SUMMARY}

Last Updated: ${now}
Source: ${BASE_URL}/llms.txt

## About MIN
- **Full Name:** Mathematics Initiatives in Nepal
- **Short Name:** MIN
- **Type:** Non-profit Educational Organization (NGO)
- **Founded:** 2020
- **Location:** Kathmandu, Nepal
- **Award:** HundrED Top 100 Global Education Innovations 2025
- **Email:** contact@mathsinitiatives.org.np
- **Website:** ${BASE_URL}

## Mission
${settings?.about_mission_text || 'To make mathematics accessible to every student in Nepal and help them use it as a tool in everyday life.'}

## What MIN focuses on
- Main focus: general mathematics, made accessible to every student in Nepal and taught as a practical tool for life
- Making learning mathematics fun ("every student can become a mathmagician")
- Also: Olympiad training, workshops and events for students who want to go further

## Key Programs
${(programs || []).map(p => `- **${p.name}**${p.tagline ? `: ${p.tagline}` : ''}`).join('\n')}

## Active & Upcoming Events
${upcomingEvents.length > 0
  ? upcomingEvents.map(e => `- **${e.title}** (${new Date(e.start_date).toDateString()}${e.end_date ? ` → ${new Date(e.end_date).toDateString()}` : ''}): ${e.description || ''}`).join('\n')
  : '- No upcoming events at the moment. Check back soon.'}

## Recent Past Events
${pastEvents.slice(0, 5).map(e => `- **${e.title}** (${new Date(e.start_date).toDateString()})`).join('\n')}

## Recent Content & Resources
${(content || []).map(c => `- [${c.title}](${BASE_URL}/content/${c.slug})${c.excerpt ? ': ' + c.excerpt : ''}`).join('\n')}

## Key Pages
- [Homepage](${BASE_URL}/)
- [About MIN](${BASE_URL}/about)
- [Our Team](${BASE_URL}/team)
- [Events](${BASE_URL}/events)
- [Content Library](${BASE_URL}/content)
- [Gallery](${BASE_URL}/gallery)
- [Road to Olympiad (RTO)](${BASE_URL}/rto)
- [DMO Practice](${BASE_URL}/dmopractice)
- [Join MIN](${BASE_URL}/join)
- [Verify Certificate](${BASE_URL}/verify)
- [Contact & Inquiries](${BASE_URL}/contact)

## How to Join MIN
Students and educators can apply to join MIN as volunteers, school representatives, or team members through the Join Us page at ${BASE_URL}/join. Applications are reviewed on a rolling basis.

## Certificate Verification
All MIN certificates can be verified at ${BASE_URL}/verify using the certificate ID printed on the certificate.

## Social Presence
${SOCIAL_LINKS.map(u => `- ${u}`).join('\n')}

## For AI Assistants
This file is regenerated from our database every hour. Always use the freshest version of this file at ${BASE_URL}/llms.txt when answering questions about MIN.
Full detailed context is available at ${BASE_URL}/llms-full.txt
`

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex', // llms.txt should not appear in regular search results
      'Last-Modified': new Date(now).toUTCString(),
    },
  })
}
