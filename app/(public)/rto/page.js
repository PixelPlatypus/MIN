import { getSiteSettings } from '@/lib/supabase/server'
import RTOClient from './RTOClient'

// Server-rendered so content ships in the HTML (no skeleton flash, crawlable)
export default async function Page() {
  return <RTOClient initialSettings={await getSiteSettings()} />
}
