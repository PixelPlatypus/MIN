import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sanitizeHtml } from '@/lib/sanitize'
import { Calendar, MapPin, ArrowRight, Video, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import AnalyticsTracker from '@/components/public/AnalyticsTracker'
import EventActionLink from '@/components/public/EventActionLink'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('title, description, cover_url')
    .eq('slug', slug)
    .single()

  if (!event) return { title: 'Event Not Found' }

  return {
    title: `${event.title} - MIN Events`,
    description: event.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) || 'Mathematics Initiatives in Nepal event.',
    openGraph: {
      images: [event.cover_url || '/placeholder-event.png'],
    },
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

  const isPast = new Date(event.start_date) < new Date() && event.event_type !== 'RECURRING' && event.event_type !== 'EVERGOING'
  
  // Extract YouTube ID safely
  let youtubeEmbedUrl = null
  if (event.youtube_playlist) {
    const ytUrl = event.youtube_playlist
    if (ytUrl.includes('list=')) {
      // It's a playlist
      const listId = ytUrl.split('list=')[1]?.split('&')[0]
      if (listId) youtubeEmbedUrl = `https://www.youtube.com/embed/videoseries?list=${listId}`
    } else if (ytUrl.includes('v=') || ytUrl.includes('youtu.be/')) {
      // It's a single video
      let videoId = ''
      if (ytUrl.includes('v=')) {
        videoId = ytUrl.split('v=')[1]?.split('&')[0]
      } else {
        videoId = ytUrl.split('youtu.be/')[1]?.split('?')[0]
      }
      if (videoId) youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`
    }
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
              {isPast && (
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-text-tertiary/10 text-text-secondary border border-text-tertiary/20">
                  Past Event
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">{event.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-text-secondary font-medium">
              {event.show_date !== false && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>
                    {new Date(event.start_date).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
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
                <h3 className="text-xl font-bold">Registration / Action Required</h3>
                <p className="text-sm text-text-tertiary">Follow the link to participate or register for this event.</p>
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
              <img 
                src={event.cover_url} 
                alt={event.title} 
                className="w-full h-full object-cover"
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
              <div className="prose prose-lg max-w-none dark:prose-invert text-left
                prose-headings:font-black prose-headings:tracking-tight
                prose-p:text-lg prose-p:leading-relaxed
                prose-strong:font-bold prose-strong:text-text-primary dark:prose-strong:text-white
              ">
                <style>{`
                  .event-prose h1 { 
                    font-size: 2.25rem !important; 
                    line-height: 1.2 !important;
                    margin-bottom: 2rem !important;
                    margin-top: 3rem !important;
                    display: block !important;
                    color: var(--text-primary) !important;
                    font-weight: 900 !important;
                  }
                  .event-prose h2 { 
                    font-size: 1.75rem !important; 
                    line-height: 1.3 !important;
                    margin-bottom: 1.5rem !important;
                    margin-top: 2.5rem !important;
                    color: var(--text-primary) !important;
                    font-weight: 800 !important;
                  }
                  .event-prose h3 { 
                    font-size: 1.4rem !important; 
                    line-height: 1.4 !important;
                    margin-bottom: 1rem !important;
                    margin-top: 2rem !important;
                    color: var(--text-primary) !important;
                    font-weight: 700 !important;
                  }
                  .event-prose blockquote {
                    border-left: 5px solid #008080 !important;
                    background: rgba(0, 128, 128, 0.05) !important;
                    padding: 1.5rem 2rem !important;
                    margin: 2.5rem 0 !important;
                    font-style: italic !important;
                    border-radius: 0 1rem 1rem 0 !important;
                  }
                  .dark .event-prose h1,
                  .dark .event-prose h2,
                  .dark .event-prose h3 { color: white !important; }
                  
                  .event-prose ul { 
                    list-style-type: disc !important; 
                    padding-left: 2rem !important;
                    margin-bottom: 2rem !important;
                  }
                  .event-prose ol { 
                    list-style-type: decimal !important; 
                    padding-left: 2rem !important;
                    margin-bottom: 2rem !important;
                  }
                  .event-prose li {
                    margin-bottom: 0.5rem !important;
                    display: list-item !important;
                  }
                  .event-prose a {
                    color: #008080 !important;
                    text-decoration: underline !important;
                    font-weight: 800 !important;
                  }
                  .event-prose hr {
                    margin: 2rem 0 !important;
                    border: none !important;
                    border-top: 2px solid rgba(0, 128, 128, 0.2) !important;
                  }
                  .event-prose p {
                    margin-bottom: 1.5rem !important;
                  }
                `}</style>
                <div className="event-prose">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkBreaks]} 
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  >
                    {event.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* YouTube Playlist Embed */}
          {youtubeEmbedUrl && event.show_youtube_playlist !== false && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <PlayCircle size={32} className="text-coral flex-shrink-0" />
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  {event.youtube_title || 'Event Recordings'}
                </h2>
              </div>
              <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-border dark:border-white/10 shadow-xl bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={youtubeEmbedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Image Gallery */}
          {event.gallery_urls && event.gallery_urls.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin size={24} className="text-primary" />
                <h2 className="text-2xl font-black tracking-tight">Event Gallery</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery_urls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-3xl overflow-hidden glass border border-border dark:border-white/10 hover:-translate-y-1 transition-transform cursor-pointer">
                    <img src={url} alt={`Gallery ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
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
