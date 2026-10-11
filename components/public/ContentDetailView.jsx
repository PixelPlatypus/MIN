'use client'
import { m } from 'framer-motion'
import { ArrowLeft, User, Calendar, DownloadSimple as FileDown, Video, List as LayoutList } from '@phosphor-icons/react'
import Link from 'next/link'
import ContentRenderer from '@/components/public/ContentRenderer'
import { captureEvent } from '@/lib/analytics'
import { useEffect } from 'react'

export default function ContentDetailView({ content }) {
  useEffect(() => {
    if (content) {
      captureEvent('content_viewed', { 
        title: content.title, 
        type: content.type, 
        content_type: content.content_type 
      })
    }
  }, [content])

  const { 
    title, type, content_type, body, pdf_url, pdf_filename, 
    video_url, video_metadata, excerpt, cover_url, 
    author_name, published_at, tags = [] 
  } = content

  return (
    <div className="relative isolate pt-36 md:pt-40 pb-24 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[36rem] -z-10 hero-glow pointer-events-none" />
      <div className="container mx-auto px-6 max-w-5xl">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="space-y-8">
            <Link 
              href="/content" 
              className="inline-flex items-center gap-2 text-auto-tertiary hover:text-primary dark:hover:text-secondary transition-colors font-bold text-sm group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Back to Library
            </Link>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">
                  {type}
                </span>
                <span className="text-[13px] font-bold tracking-wider px-3.5 py-1.5 rounded-full bg-secondary/40 text-primary-dark border border-secondary-dark/30 dark:bg-secondary/10 dark:text-secondary-light dark:border-secondary/20">
                  {content_type}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-gradient-brand pb-2 break-words">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-secondary/15 flex items-center justify-center text-primary dark:text-secondary">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{author_name}</span>
                    <span className="text-xs text-auto-tertiary">Author</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10 flex items-center justify-center text-auto-tertiary">
                    <Calendar size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {published_at ? new Date(published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </span>
                    <span className="text-xs text-auto-tertiary">Published</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {content_type !== 'VIDEO' && cover_url && (
            <div className="aspect-[16/9] md:aspect-[21/9] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden ring-brand-glow relative transition-all">
              <img 
                src={cover_url} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          <div className="max-w-4xl mx-auto space-y-12">
            {content_type === 'RICHTEXT' ? (
                <ContentRenderer html={body} />
              ) : content_type === 'PDF' ? (
                <div className="space-y-8">
                  <div className="card-brand overflow-hidden aspect-[3/4] md:aspect-[8.5/11] relative group">
                    <iframe 
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdf_url)}&embedded=true`}
                      className="w-full h-full border-none relative z-10"
                      title={title}
                      loading="lazy"
                    />
                  </div>

                  <div className="card-brand rounded-[2.5rem] p-8 md:p-12 text-center space-y-8">
                    <div className="w-20 h-20 bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                      <FileDown size={40} />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold tracking-tight">Download Resource</h2>
                      <p className="text-auto-secondary text-lg max-w-md mx-auto">
                        Need to keep this for later? You can download the full PDF document to your device.
                      </p>
                    </div>
                    <a 
                      href={pdf_url}
                      download={pdf_filename || 'document.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => captureEvent('content_downloaded', { title, type })}
                      className="btn-brand text-base md:text-lg max-w-full [overflow-wrap:anywhere]"
                    >
                      <FileDown size={24} className="shrink-0" />
                      Download {pdf_filename || 'PDF Document'}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                   <div className="aspect-video rounded-[2rem] md:rounded-[2.5rem] overflow-hidden ring-brand-glow relative bg-black">
                    {video_url && (
                      <iframe
                        src={
                          video_url.includes('playlist?list=') 
                            ? `https://www.youtube.com/embed/videoseries?list=${video_url.split('list=')[1]?.split('&')[0]}`
                            : `https://www.youtube.com/embed/${video_url.includes('v=') ? video_url.split('v=')[1]?.split('&')[0] : video_url.split('youtu.be/')[1]?.split('?')[0]}`
                        }
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    )}
                   </div>
                   
                   {excerpt && (
                     <div className="card-brand rounded-[2.5rem] p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-6 text-primary dark:text-secondary">
                          <Video size={24} />
                          <h3 className="text-xl font-bold">Video Summary / Excerpt</h3>
                        </div>
                        <p className="text-lg text-auto-secondary leading-relaxed">
                          {excerpt}
                        </p>
                     </div>
                   )}
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-12 border-t border-primary/10 dark:border-white/10 flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs font-bold tracking-wider px-4 py-2 rounded-full bg-primary/5 dark:bg-white/5 text-primary/80 dark:text-white/70 border border-primary/10 dark:border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
        </m.div>
      </div>
    </div>
  )
}
