import { getSiteSettings } from '@/lib/supabase/server'
import JoinClient from './JoinClient'

// Server-rendered so content ships in the HTML (no skeleton flash, crawlable)
export default async function Page() {
  return <JoinClient initialSettings={await getSiteSettings()} />
}
