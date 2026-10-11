import { getSiteSettings } from '@/lib/supabase/server'
import AboutClient from './AboutClient'

// Server-rendered so content ships in the HTML (no skeleton flash, crawlable)
export default async function Page() {
  return <AboutClient initialSettings={await getSiteSettings()} />
}
