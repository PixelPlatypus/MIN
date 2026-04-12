// app/sitemap.js — auto-generate sitemap.xml for Next.js
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL

export default async function sitemap() {
  const supabase = await createClient()

  // Static routes
  const staticRoutes = [
    '', '/about', '/team', '/events', '/content', '/gallery',
    '/rto', '/join', '/submit-content',
    '/about/privacy', '/about/terms', '/about/cookies', '/about/legal',
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.7,
  }))

  // Dynamic: published events
  const { data: events } = await supabase
    .from('events')
    .select('slug, updated_at')
    .eq('status', 'PUBLISHED')
    .order('updated_at', { ascending: false })

  const eventRoutes = (events || []).map(e => ({
    url: `${BASE_URL}/events/${e.slug}`,
    lastModified: e.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Dynamic: published content
  const { data: content } = await supabase
    .from('content')
    .select('slug, updated_at')
    .eq('status', 'PUBLISHED')
    .order('updated_at', { ascending: false })

  const contentRoutes = (content || []).map(c => ({
    url: `${BASE_URL}/content/${c.slug}`,
    lastModified: c.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...eventRoutes, ...contentRoutes]
}
