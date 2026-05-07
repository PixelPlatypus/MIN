import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Calendar, MapPin, Video, PlayCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ContentRenderer from '@/components/public/ContentRenderer'
import AnalyticsTracker from '@/components/public/AnalyticsTracker'
import EventActionLink from '@/components/public/EventActionLink'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: event, error } = await supabase
      .from('events')
      .select('title, description, cover_url')
      .eq('slug', slug)
      .single()

    if (error || !event) return { title: 'Event Not Found' }

    const description = typeof event.description === 'string' ? event.description : ''
    const plainDescription = description
      ? description.replace(/<[^>]*>?/gm, '').substring(0, 160)
      : 'Mathematics Initiatives in Nepal event.'

    return {
      title: `${event.title} - MIN Events`,
      description: plainDescription,
      alternates: {
        canonical: `/events/${slug}`,
      },
      keywords: [event.title, 'Mathematics Events Nepal', 'MIN Events', 'Math Competitions'],
      openGraph: {
        title: event.title,
        description: plainDescription,
        url: `/events/${slug}`,
        type: 'article',
        images: event.cover_url ? [event.cover_url] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description: plainDescription,
        images: event.cover_url ? [event.cover_url] : [],
      }
    }
  } catch (err) {
    console.error('Error generating metadata for event:', err)
    return { title: 'MIN Events' }
  }
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .single()

  if (error || !event) {
    notFound()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return null
      return date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    } catch (e) {
      return null
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const boundaryDateStr = event.end_date || event.start_date
  const isPast = boundaryDateStr && event.event_type !== 'RECURRING' && event.event_type !== 'EVERGOING'
    ? new Date(boundaryDateStr).setHours(0, 0, 0, 0) < today.getTime()
    : false

  const actionDeadlineStr = event.action_deadline || event.end_date
  const isActionActive = !actionDeadlineStr || (new Date(actionDeadlineStr).setHours(0, 0, 0, 0) >= today.getTime())

  const videos = Array.isArray(event.youtube_videos)
    ? event.youtube_videos.filter(v => v && typeof v === 'object' && v.url)
    : []
  const legacyPlaylist = event.youtube_playlist

  const allVideos = [...videos]
  if (legacyPlaylist && !allVideos.find(v => v?.url === legacyPlaylist)) {
    allVideos.unshift({ title: event.youtube_title || 'Playlist', url: legacyPlaylist })
  }

  const getEmbedUrl = (url) => {
    if (!url) return null
    if (url.includes('list=')) {
      const listId = url.split('list=')[1]?.split('&')[0]
      if (listId) return `https://www.youtube.com/embed/videoseries?list=${listId}`
    } else if (url.includes('v=') || url.includes('youtu.be/')) {
      let videoId = ''
      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0]
      } else {
        videoId = url.split('youtu.be/')[1]?.split('?')[0]
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    return null
  }

  const eventTypeColors = {
    RECURRING: 'bg-marigold/10 text-marigold border-marigold/20',
    EVERGOING: 'bg-lotus-pink/10 text-lotus-pink border-lotus-pink/20',
    SPECIAL: 'bg-diya-flame/10 text-diya-flame border-diya-flame/20',
    DEFAULT: 'bg-bg-secondary text-text-secondary-dynamic border-border'
  }

  const typeColor = eventTypeColors[event.event_type] || eventTypeColors.DEFAULT

  return (
    <div className="pt-32 pb-24 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AnalyticsTracker
        eventName="event_viewed"
        properties={{ title: event.title, slug, event_type: event.event_type }}
      />

      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-bold text-text-tertiary-dynamic hover:text-headline transition-colors">
            <ArrowLeft size={16} />
            Back to Events
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`pill px-3 py-1.5 text-xs font-institutional tracking-[0.2em] ${typeColor}`}>
                {event.event_type}
              </span>
              {isPast && event.show_date !== false && (
                <span className="pill px-3 py-1.5 text-xs font-institutional tracking-[0.2em] text-text-secondary-dynamic">
                  Past Event
                </span>
              )}
            </div>

            <h1 className="text-headline text-4xl md:text-6xl font-bold tracking-tight">{event.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-text-secondary-dynamic font-medium">
              {event.show_date !== false && formatDate(event.start_date) && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-marigold/60" />
                  <span>{formatDate(event.start_date)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-marigold/60" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {event.action_link && event.show_action_link !== false && isActionActive && (
            <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-headline text-xl font-bold">{event.action_title}</h3>
                <p className="text-sm text-text-tertiary-dynamic">{event.action_description}</p>
              </div>
              <EventActionLink
                href={event.action_link}
                title={event.title}
                eventType={event.event_type}
                actionText={event.action_text}
              />
            </div>
          )}

          {event.cover_url && (
            <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-border bg-bg-secondary relative">
              <Image
                src={event.cover_url}
                alt={event.title}
                fill
                priority
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-16">

          {event.description && (
            <div className="bg-surface rounded-3xl p-8 md:p-12 border border-border">
              <ContentRenderer content={event.description} />
            </div>
          )}

          {allVideos.length > 0 && event.show_youtube_playlist !== false && (
            <div className="space-y-12">
              <div className="flex items-center gap-3 mb-8">
                <PlayCircle size={32} className="text-marigold flex-shrink-0" />
                <h2 className="text-headline text-2xl md:text-3xl font-bold tracking-tight">
                  {event.youtube_title || 'Event Recordings'}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {allVideos.map((vid, idx) => {
                  const embedUrl = getEmbedUrl(vid.url)
                  if (!embedUrl) return null

                  return (
                    <div key={idx} className="space-y-4">
                      {vid.title && (
                        <h4 className="text-headline text-lg font-bold flex items-center gap-2">
                          <Video size={18} className="text-text-tertiary-dynamic" />
                          {vid.title}
                        </h4>
                      )}
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-bg-secondary">
                        <iframe
                          width="100%"
                          height="100%"
                          src={embedUrl}
                          title={vid.title || "YouTube video player"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {Array.isArray(event.gallery_urls) && event.gallery_urls.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin size={24} className="text-marigold" />
                <h2 className="text-headline text-2xl font-bold tracking-tight">Event Gallery</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery_urls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-surface border border-border">
                    <Image
                      src={url}
                      alt={`Gallery ${i+1}`}
                      fill
                      className="w-full h-full object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
