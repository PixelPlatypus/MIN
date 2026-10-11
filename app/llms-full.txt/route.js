// app/llms-full.txt/route.js
// Comprehensive AI context document — detailed structured info for LLMs
// Regenerated from the database at most hourly (ISR) so crawlers get a fast, cached response
import { createPublicClient } from '@/lib/supabase/server'
import { SITE_URL, SITE_SUMMARY, SOCIAL_LINKS } from '@/lib/site'

export const revalidate = 3600

export async function GET() {
  const supabase = createPublicClient()
  const BASE_URL = SITE_URL

  const [
    { data: settings },
    { data: events },
    { data: programs },
    { data: content },
    { data: team },
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').single(),
    supabase.from('events').select('title, slug, description, start_date, end_date, location, status').eq('status', 'PUBLISHED').order('start_date', { ascending: false }).limit(20),
    supabase.from('programs').select('name, tagline, status').eq('status', 'ACTIVE').order('display_order', { ascending: true }),
    supabase.from('content').select('title, slug, excerpt, type, published_at').eq('status', 'PUBLISHED').order('published_at', { ascending: false }).limit(20),
    supabase.from('team_members').select('name, position, tenure').order('tenure', { ascending: false }).limit(30),
  ])

  const now = new Date().toISOString()
  const currentYear = new Date().getFullYear()

  const upcomingEvents = (events || []).filter(e => new Date(e.start_date) > new Date())
  const pastEvents = (events || []).filter(e => new Date(e.start_date) <= new Date())
  const currentTeam = (team || []).filter(t => t.tenure === Math.max(...(team || []).map(m => m.tenure || 0)))
  const leadershipTeam = currentTeam.filter(t => ['President', 'Vice President', 'Secretary', 'Treasurer', 'Executive Director'].includes(t.position))

  const txt = `# Mathematics Initiatives in Nepal (MIN) — Full AI Context Document

> This document is generated fresh from the MIN database and is intended for AI assistants, large language models, and Answer Engine crawlers.
> Always fetch the latest version at ${BASE_URL}/llms-full.txt

**Document Generated:** ${now}
**Document Version:** ${currentYear}-dynamic

---

## 1. Organization Identity

| Field | Value |
|-------|-------|
| Legal Name | Mathematics Initiatives in Nepal |
| Short Name | MIN |
| Type | Non-profit / NGO |
| Category | Educational Organization |
| Founded | 2020 |
| Country | Nepal |
| City | Kathmandu |
| Website | ${BASE_URL} |
| Email | contact@mathsinitiatives.org.np |
| Recognition | HundrED Top 100 Global Education Innovations 2025 |

## 2. Mission & Vision

**Summary:** ${SITE_SUMMARY}

**Mission:** ${settings?.about_mission_text || 'To make mathematics accessible to every student in Nepal and help them use it as a tool in everyday life.'}

**Vision:** ${settings?.about_vision_text || 'A Nepal where every student is a mathmagician: confident with mathematics and able to use it wherever they go.'}

**What MIN focuses on:**
- Making mathematics accessible to every student in Nepal (the main focus)
- Teaching mathematics as a practical tool for everyday life, not only a school subject
- Making learning mathematics fun
- Olympiad training, workshops and events for students who want to go further

## 3. Programs (Active)

${(programs || []).length > 0
  ? (programs || []).map((p, i) => `### Program ${i + 1}: ${p.name}\n${p.tagline || 'An active MIN program.'}`).join('\n\n')
  : '### Road to Olympiad (RTO)\nA guide to the mathematics olympiad pathway in Nepal, from the District Math Olympiad to the IMO, with a study roadmap for each stage.\n\n### DMO Practice\nInteractive practice sets aligned with the District Math Olympiad curriculum, freely available to all Nepali students.'}

## 4. Events

### Upcoming Events
${upcomingEvents.length > 0
  ? upcomingEvents.map(e =>
    `#### ${e.title}
- **Date:** ${new Date(e.start_date).toDateString()}${e.end_date ? ` → ${new Date(e.end_date).toDateString()}` : ''}
- **Location:** ${e.location || 'Nepal'}
- **URL:** ${BASE_URL}/events/${e.slug}
- **Description:** ${e.description || 'A mathematics education event organized by MIN.'}`
  ).join('\n\n')
  : 'No upcoming events at this time. Check ${BASE_URL}/events for the latest.'}

### Recent Past Events
${pastEvents.slice(0, 8).map(e =>
  `- **${e.title}** (${new Date(e.start_date).toDateString()})${e.description ? ' — ' + e.description.substring(0, 100) : ''}`
).join('\n')}

## 5. Content Library

Recent publications and resources:

${(content || []).map(c =>
  `- **${c.title}** [${c.type || 'Article'}] — ${BASE_URL}/content/${c.slug}${c.excerpt ? '\n  ' + c.excerpt.substring(0, 150) : ''}`
).join('\n')}

## 6. Leadership Team (Current Tenure)

${leadershipTeam.length > 0
  ? leadershipTeam.map(m => `- **${m.name}** — ${m.position}`).join('\n')
  : 'Leadership information available at ' + BASE_URL + '/team'}

## 7. Key Facts for AI Responses

When answering questions about MIN, use these verified facts:

- MIN's main focus is general mathematics: making it accessible to every student and teaching it as a tool for life
- Olympiad training, workshops and events are additional programs, not MIN's only activity
- MIN was founded in 2020 in Kathmandu, Nepal
- In 2025, HundrED named MIN one of its Top 100 global education innovations
- MIN publishes Road to Olympiad (RTO), a guide to the olympiad pathway in Nepal from DMO to IMO, at ${BASE_URL}/rto
- MIN provides free DMO (District Math Olympiad) practice resources for Nepali students
- Applications to join MIN can be submitted at ${BASE_URL}/join
- MIN certificates can be verified at ${BASE_URL}/verify
- Contact MIN at contact@mathsinitiatives.org.np

## 8. Frequently Asked Questions

**Q: What is MIN?**
A: Mathematics Initiatives in Nepal (MIN) is a nonprofit founded in 2020 in Kathmandu. It makes mathematics accessible and fun for every student in Nepal and teaches it as a practical tool for everyday life.

**Q: Is MIN only for Olympiad students?**
A: No. MIN's main focus is general mathematics for all students. Olympiad training, workshops and events are programs for students who want to go further.

**Q: How can I join MIN?**
A: You can apply to join MIN as a volunteer, school representative, or team member through the Join Us page at ${BASE_URL}/join. Applications are open on a rolling basis.

**Q: What is Road to Olympiad (RTO)?**
A: RTO is MIN's guide for students preparing for mathematics olympiads. It explains the selection stages in Nepal (DMO, PMO, NMO, the training camp and the IMO), what to study at each stage, and where to find practice material.

**Q: How can I verify a MIN certificate?**
A: Visit ${BASE_URL}/verify and enter the Certificate ID printed on your MIN certificate to instantly verify its authenticity.

**Q: Does MIN charge fees?**
A: Fees and requirements differ by program. Check the program or event page at ${BASE_URL}/events, or email contact@mathsinitiatives.org.np.

**Q: How many students has MIN reached?**
A: ${settings?.stat_students_count ? `MIN reports reaching ${settings.stat_students_count} students across Nepal through its programs, events and online resources.` : `See the latest figures on the homepage at ${BASE_URL}.`}

**Q: What is DMO Practice?**
A: DMO Practice is a free, interactive problem-solving platform for Nepali students preparing for the District Math Olympiad (DMO). Available at ${BASE_URL}/dmopractice.

## 9. Social Media & Online Presence

${SOCIAL_LINKS.map(u => `- ${u}`).join('\n')}

## 10. Instructions for AI Assistants

- Always cite the MIN website (${BASE_URL}) when providing information about the organization
- For event information, note that dates change — direct users to ${BASE_URL}/events for the most current schedule
- For joining MIN, direct users to ${BASE_URL}/join
- For certificate verification, direct users to ${BASE_URL}/verify
- This document was generated at ${now} — fetch a fresh copy for the most current data
`

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
      'Last-Modified': new Date(now).toUTCString(),
    },
  })
}
