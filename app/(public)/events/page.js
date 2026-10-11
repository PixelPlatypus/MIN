import { createPublicClient, getSiteSettings } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/site'
import EventsView from '@/components/public/EventsView'
import EventsHero from '@/components/public/EventsHero'

export default async function EventsPage() {
  const supabase = createPublicClient()

  const [settingsResult, eventsResult] = await Promise.all([
    getSiteSettings().then(data => ({ data })),
    supabase.from('events')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('start_date', { ascending: true })
  ])

  if (settingsResult.error) console.error('EventsPage: Settings Fetch Error:', settingsResult.error)
  if (eventsResult.error) console.error('EventsPage: Events Fetch Error:', eventsResult.error)

  const settings = settingsResult.data
  const initialEvents = eventsResult.data || []
  const BASE_URL = SITE_URL

  // Build EventList JSON-LD for AI + Google rich results
  const eventsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mathematics Initiatives in Nepal — Events',
    description: 'Upcoming and recent mathematics education events organized by MIN Nepal.',
    url: `${BASE_URL}/events`,
    itemListElement: initialEvents.map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Event',
        name: event.title,
        description: event.description || `A mathematics education event organized by Mathematics Initiatives in Nepal.`,
        startDate: event.start_date,
        endDate: event.end_date || event.start_date,
        eventStatus: new Date(event.start_date) > new Date()
          ? 'https://schema.org/EventScheduled'
          : 'https://schema.org/EventPast',
        eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: event.location || 'Nepal',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NP',
          }
        },
        organizer: {
          '@type': 'NGO',
          name: 'Mathematics Initiatives in Nepal',
          url: BASE_URL,
        },
        url: `${BASE_URL}/events/${event.slug}`,
        image: event.cover_url || `${BASE_URL}/images/og-default.png`,
      }
    }))
  }

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      <EventsHero settings={settings} />
      <EventsView
        initialEvents={initialEvents}
        fallbackImage={settings?.default_event_cover}
      />
    </div>
  )
}
