// app/sitemap.js — auto-generate sitemap.xml for Next.js
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mathsinitiatives.org.np'

export const revalidate = 3600 // revalidate sitemap every hour

export default async function sitemap() {
  const supabase = await createClient()

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
    lastModified: new Date().toISOString(),
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
    lastModified: e.updated_at || new Date().toISOString(),
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
    lastModified: c.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Dynamic: team member profiles (if they have public profile URLs)
  // Dynamic: active tasks (public task bank entries)

  return [...staticRoutes, ...eventRoutes, ...contentRoutes]
}
