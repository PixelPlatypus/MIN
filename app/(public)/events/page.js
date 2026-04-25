import { createClient } from '@/lib/supabase/server'
import EventsView from '@/components/public/EventsView'
import EventsHero from '@/components/public/EventsHero'

export default async function EventsPage() {
  const supabase = await createClient()

  // Fetch settings and events in parallel with error logging
  const [
    settingsResult,
    eventsResult
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').single(),
    supabase.from('events')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('start_date', { ascending: true })
  ])

  if (settingsResult.error) {
    console.error('EventsPage: Settings Fetch Error:', settingsResult.error)
  }
  if (eventsResult.error) {
    console.error('EventsPage: Events Fetch Error:', eventsResult.error)
  }

  const settings = settingsResult.data
  const initialEvents = eventsResult.data || []

  return (
    <div className="pt-32 pb-24 space-y-24">
      <EventsHero settings={settings} />
      
      <EventsView 
        initialEvents={initialEvents}
        fallbackImage={settings?.default_event_cover}
      />
    </div>
  )
}

