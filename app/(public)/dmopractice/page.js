import { createPublicClient, getSiteSettings } from '@/lib/supabase/server'
import DMOPracticeClient from './DMOPracticeClient'

// Server-fetched so the hero and set list are in the HTML instead of appearing after two client fetches
export default async function Page() {
  const [settings, { data: sets }] = await Promise.all([
    getSiteSettings(),
    createPublicClient()
      .from('practice_sets')
      .select('*, practice_questions(count)')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
  ])
  return <DMOPracticeClient initialSets={sets || []} initialSettings={settings} />
}
