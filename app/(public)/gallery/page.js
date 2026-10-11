import { createPublicClient, getSiteSettings } from '@/lib/supabase/server'
import GalleryClient from './GalleryClient'

// Server-rendered so content ships in the HTML (no skeleton flash, crawlable). All photos are
// fetched once here; album/tag filtering happens client-side, so the grid never pops in late.
export default async function Page() {
  const [settings, { data: images }] = await Promise.all([
    getSiteSettings(),
    createPublicClient()
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false }),
  ])
  return <GalleryClient initialSettings={settings} initialImages={images || []} />
}
