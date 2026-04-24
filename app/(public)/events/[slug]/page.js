import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Calendar, MapPin, ArrowRight, Video, PlayCircle } from 'lucide-react'
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
      openGraph: {
        images: [event.cover_url || '/placeholder-event.png'],
      },
    }
  } catch (err) {
    console.error('Error generating metadata for event:', err)
    return { title: 'MIN Events' }
  }
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  // Verify fetch payload
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

  const startDate = formatDate(event.start_date)
  const isPast = event.start_date 
    ? new Date(event.start_date) < new Date() && event.event_type !== 'RECURRING' && event.event_type !== 'EVERGOING'
    : false
  
  // Process multiple YouTube videos with robust type checking
  const videos = Array.isArray(event.youtube_videos) 
    ? event.youtube_videos.filter(v => v && typeof v === 'object' && v.url) 
    : []
  const legacyPlaylist = event.youtube_playlist
  
  // Combine videos (handling both new format and legacy field)
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

  return (
    <div className="pt-32 pb-24 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AnalyticsTracker 
        eventName="event_viewed" 
        properties={{ title: event.title, slug, event_type: event.event_type }} 
      />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-bold text-text-tertiary hover:text-primary transition-colors">
            ← Back to Events
          </Link>
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                event.event_type === 'RECURRING' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                event.event_type === 'EVERGOING' ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' :
                event.event_type === 'SPECIAL' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                'bg-primary/10 text-primary border-primary/20'
              }`}>
                {event.event_type}
              </span>
              {isPast && event.show_date !== false && (
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-text-tertiary/10 text-text-secondary border border-text-tertiary/20">
                  Past Event
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">{event.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-text-secondary font-medium">
              {event.show_date !== false && startDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>{startDate}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Action Banner */}
          {event.action_link && event.show_action_link !== false && (
            <div className="glass p-6 md:p-8 rounded-[2rem] border-2 border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl font-bold">{event.action_title || 'Registration / Action Required'}</h3>
                <p className="text-sm text-text-tertiary">{event.action_description || 'Follow the link to participate or register for this event.'}</p>
              </div>
              <EventActionLink
                href={event.action_link}
                title={event.title}
                eventType={event.event_type}
                actionText={event.action_text}
              />
            </div>
          )}

          {/* Cover Image */}
          {event.cover_url && (
            <div className="aspect-[21/9] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-border dark:border-white/10 shadow-lg relative bg-bg-secondary dark:bg-white/5">
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

      {/* Content & Media Block */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-16">
          
          {/* Description Content */}
          {event.description && (
            <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-border dark:border-white/10">
              <ContentRenderer content={event.description} />
            </div>
          )}

          {/* YouTube Videos Section */}
          {allVideos.length > 0 && event.show_youtube_playlist !== false && (
            <div className="space-y-12">
              <div className="flex items-center gap-3 mb-8">
                <PlayCircle size={32} className="text-coral flex-shrink-0" />
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
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
                        <h4 className="text-lg font-bold flex items-center gap-2">
                          <Video size={18} className="text-text-tertiary" />
                          {vid.title}
                        </h4>
                      )}
                      <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-border dark:border-white/10 shadow-xl bg-black group transition-all hover:border-primary/30">
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

          {/* Image Gallery */}
          {Array.isArray(event.gallery_urls) && event.gallery_urls.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin size={24} className="text-primary" />
                <h2 className="text-2xl font-black tracking-tight">Event Gallery</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery_urls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-3xl overflow-hidden glass border border-border dark:border-white/10 hover:-translate-y-1 transition-transform cursor-pointer relative">
                    <Image 
                      src={url} 
                      alt={`Gallery ${i+1}`} 
                      fill
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
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
