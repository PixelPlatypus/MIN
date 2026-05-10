import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TeamMemberProfile from '@/components/public/TeamMemberProfile'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function fetchMember(slug) {
  const supabase = await createClient()
  const base = supabase.from('team_members').select('*')
  const filtered = UUID_RE.test(slug) ? base.eq('id', slug) : base.eq('slug', slug)
  const { data } = await filtered.single()
  return data
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const member = await fetchMember(slug)
  if (!member) return { title: 'Member Not Found' }
  return {
    title: `${member.name} | MIN Team`,
    description: member.bio || `${member.name} — ${member.position} at Mathematics Initiatives in Nepal`,
    openGraph: { images: [member.photo_url || '/images/logo.png'] },
  }
}

export default async function TeamMemberPage({ params }) {
  const { slug } = await params
  const member = await fetchMember(slug)
  if (!member) notFound()

  let socialLinks = member.social_links || {}
  if (typeof socialLinks === 'string') {
    try { socialLinks = JSON.parse(socialLinks) } catch { socialLinks = {} }
  }

  const roleHistory = Array.isArray(socialLinks.role_history) ? [...socialLinks.role_history] : []
  if (member.status === 'ACTIVE') {
    const currentYear = new Date().getFullYear().toString()
    if (!roleHistory.some(h => h.year === currentYear)) {
      roleHistory.push({ year: currentYear, position: member.position || 'MINion' })
    }
  }
  if (member.tenure) {
    const joinedYear = member.tenure.toString()
    if (!roleHistory.some(h => h.year === joinedYear)) {
      roleHistory.push({ year: joinedYear, position: 'MINion' })
    }
  }

  return <TeamMemberProfile member={member} socialLinks={socialLinks} roleHistory={roleHistory} />
}
