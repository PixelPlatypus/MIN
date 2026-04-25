'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Calendar, FileDown, Video, LayoutList } from 'lucide-react'
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
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="space-y-8">
            <Link 
              href="/content" 
              className="inline-flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors font-bold text-sm group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Back to Library
            </Link>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/10">
                  {type}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-secondary/20 text-secondary-dark border border-secondary/20">
                  {content_type}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{author_name}</span>
                    <span className="text-xs text-text-tertiary">Author</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bg-secondary dark:bg-white/5 flex items-center justify-center text-text-tertiary">
                    <Calendar size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {published_at ? new Date(published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </span>
                    <span className="text-xs text-text-tertiary">Published</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {content_type !== 'VIDEO' && cover_url && (
            <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl relative transition-all">
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
                  <div className="glass rounded-[2rem] overflow-hidden border border-border dark:border-border-dark aspect-[3/4] md:aspect-[8.5/11] bg-bg-secondary shadow-inner relative group">
                    <iframe 
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdf_url)}&embedded=true`}
                      className="w-full h-full border-none relative z-10"
                      title={title}
                      loading="lazy"
                    />
                  </div>

                  <div className="glass rounded-[2.5rem] p-12 text-center space-y-8 border border-primary/10 bg-primary/5">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                      <FileDown size={40} />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold">Download Resource</h2>
                      <p className="text-text-secondary dark:text-text-secondary-dark text-lg max-w-md mx-auto">
                        Need to keep this for later? You can download the full PDF document to your device.
                      </p>
                    </div>
                    <a 
                      href={pdf_url}
                      download={pdf_filename || 'document.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => captureEvent('content_downloaded', { title, type })}
                      className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
                    >
                      <FileDown size={24} />
                      Download {pdf_filename || 'PDF Document'}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                   <div className="aspect-video rounded-[2.5rem] overflow-hidden glass border border-primary/10 shadow-2xl relative bg-black">
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
                     <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-primary/10 bg-primary/5">
                        <div className="flex items-center gap-3 mb-6 text-primary">
                          <Video size={24} />
                          <h3 className="text-xl font-bold">Video Summary / Excerpt</h3>
                        </div>
                        <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                          {excerpt}
                        </p>
                     </div>
                   )}
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-12 border-t border-border dark:border-border-dark flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-bg-secondary dark:bg-white/5 text-text-tertiary border border-border dark:border-border-dark">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
        </motion.div>
      </div>
    </div>
  )
}
