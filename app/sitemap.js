// app/sitemap.js — auto-generate sitemap.xml for Next.js
import { createPublicClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/site'

const BASE_URL = SITE_URL

export const revalidate = 3600 // revalidate sitemap every hour

export default async function sitemap() {
  const supabase = createPublicClient()

  // Static routes — all actively rendered public pages
  const staticRoutes = [
    { path: '',               priority: 1.0, freq: 'daily' },
    { path: '/about',         priority: 0.9, freq: 'weekly' },
    { path: '/team',          priority: 0.8, freq: 'weekly' },
    { path: '/events',        priority: 0.8, freq: 'daily' },
    { path: '/content',       priority: 0.8, freq: 'daily' },
    { path: '/gallery',       priority: 0.7, freq: 'weekly' },
    { path: '/rto',           priority: 0.8, freq: 'weekly' },
    { path: '/dmopractice',   priority: 0.7, freq: 'weekly' },
    { path: '/join',          priority: 0.9, freq: 'weekly' },
    { path: '/tasks',         priority: 0.6, freq: 'daily' },
    { path: '/contact',       priority: 0.7, freq: 'monthly' },
    { path: '/verify',        priority: 0.5, freq: 'monthly' },
    { path: '/submit-content',priority: 0.5, freq: 'monthly' },
    { path: '/about/privacy', priority: 0.3, freq: 'yearly' },
    { path: '/about/terms',   priority: 0.3, freq: 'yearly' },
    { path: '/about/cookies', priority: 0.3, freq: 'yearly' },
    { path: '/about/legal',   priority: 0.3, freq: 'yearly' },
  ].map(({ path, priority, freq }) => ({
    url: `${BASE_URL}${path}`,
    // No lastModified on static pages: stamping "now" on every regeneration teaches Google to ignore it
    changeFrequency: freq,
    priority,
  }))

  // Dynamic: published events
  const { data: events } = await supabase
    .from('events')
    .select('slug, updated_at, cover_url')
    .eq('status', 'PUBLISHED')
    .order('updated_at', { ascending: false })

  const eventRoutes = (events || []).map(e => ({
    url: `${BASE_URL}/events/${e.slug}`,
    lastModified: e.updated_at || undefined,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Dynamic: published content articles
  const { data: content } = await supabase
    .from('content')
    .select('slug, updated_at')
    .eq('status', 'PUBLISHED')
    .order('updated_at', { ascending: false })

  const contentRoutes = (content || []).map(c => ({
    url: `${BASE_URL}/content/${c.slug}`,
    lastModified: c.updated_at || undefined,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Dynamic: team member profiles
  const { data: team } = await supabase
    .from('team_members')
    .select('slug, updated_at')
    .not('slug', 'is', null)
    .neq('status', 'REMOVED')

  const teamRoutes = (team || []).map(m => ({
    url: `${BASE_URL}/team/${m.slug}`,
    lastModified: m.updated_at || undefined,
    changeFrequency: 'monthly',
    priority: 0.4,
  }))

  // Dynamic: published tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('slug, updated_at')
    .eq('status', 'published')

  const taskRoutes = (tasks || []).filter(t => t.slug).map(t => ({
    url: `${BASE_URL}/tasks/${t.slug}`,
    lastModified: t.updated_at || undefined,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...eventRoutes, ...contentRoutes, ...teamRoutes, ...taskRoutes]
}
