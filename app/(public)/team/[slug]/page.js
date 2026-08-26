import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowSquareOut as ExternalLink, FacebookLogo as Facebook, GithubLogo as Github, Globe, InstagramLogo as Instagram, LinkedinLogo as Linkedin, Envelope as Mail } from '@phosphor-icons/react/dist/ssr'

const socialIcons = {
  facebook: <Facebook size={18} />,
  instagram: <Instagram size={18} />,
  linkedin: <Linkedin size={18} />,
  email: <Mail size={18} />,
  github: <Github size={18} />,
  social_media: <Globe size={18} />,
}

import TeamMemberProfile from '@/components/public/TeamMemberProfile'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
  let query = supabase.from('team_members').select('*')
  if (isUUID) {
    query = query.eq('id', slug)
  } else {
    query = query.eq('slug', slug)
  }
  const { data: member } = await query.single()

  if (!member) return { title: 'Member Not Found' }

  return {
    title: `${member.name} | MIN Team`,
    description: member.bio || `${member.name} - ${member.position} at MIN`,
    openGraph: {
      images: [member.photo_url || '/images/logo.png'],
    },
  }
}

export default async function TeamMemberPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
  let query = supabase.from('team_members').select('*')
  if (isUUID) {
    query = query.eq('id', slug)
  } else {
    query = query.eq('slug', slug)
  }
  const { data: member } = await query.single()

  if (!member) notFound()

  // Parse social links if it's somehow a string
  let socialLinks = member.social_links || {}
  if (typeof socialLinks === 'string') {
    try {
      socialLinks = JSON.parse(socialLinks)
    } catch(e) {}
  }
  
  const roleHistory = Array.isArray(socialLinks.role_history) ? [...socialLinks.role_history] : []
  
  // Ensure the member's current/tenure role is represented in history if roleHistory is empty
  if (roleHistory.length === 0 && member.position) {
    const year = member.tenure ? member.tenure.toString() : (member.joined_date ? new Date(member.joined_date).getFullYear().toString() : new Date().getFullYear().toString())
    roleHistory.push({ year, position: member.position })
  }

  return (
    <TeamMemberProfile member={member} socialLinks={socialLinks} roleHistory={roleHistory} />
  )
}
