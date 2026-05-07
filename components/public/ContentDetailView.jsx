'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Calendar, FileDown, Video } from 'lucide-react'
import Link from 'next/link'
import ContentRenderer from '@/components/public/ContentRenderer'
import { captureEvent } from '@/lib/analytics'
import { useEffect } from 'react'

export default function ContentDetailView({ content }) {
  useEffect(() => { if (content) captureEvent('content_viewed', { title: content.title, type: content.type, content_type: content.content_type }) }, [content])
  const { title, type, content_type, body, pdf_url, pdf_filename, video_url, excerpt, cover_url, author_name, published_at, tags = [] } = content

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link href="/content" className="inline-flex items-center gap-2 text-sm font-medium text-text-tertiary-dynamic hover:text-headline transition-colors group"><ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />Back to Library</Link>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill inline-block px-3 py-1 text-[10px] text-text-tertiary-dynamic">{type}</span>
            <span className="pill inline-block px-3 py-1 text-[10px] text-text-tertiary-dynamic">{content_type}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-headline">{title}</h1>
          <div className="flex flex-wrap items-center gap-8 pt-4">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-marigold/5 border border-border flex items-center justify-center"><User size={16} className="text-marigold" /></div><div><span className="text-sm font-bold text-text-primary-dynamic">{author_name}</span><span className="text-xs text-text-tertiary-dynamic block">Author</span></div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-marigold/5 border border-border flex items-center justify-center"><Calendar size={16} className="text-marigold" /></div><div><span className="text-sm font-bold text-text-primary-dynamic">{published_at ? new Date(published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}</span><span className="text-xs text-text-tertiary-dynamic block">Published</span></div></div>
          </div>
        </div>
        {content_type !== 'VIDEO' && cover_url && <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-border"><img src={cover_url} alt={title} className="w-full h-full object-cover" /></div>}
        <div className="max-w-3xl space-y-12">
          {content_type === 'RICHTEXT' ? <ContentRenderer html={body} /> : content_type === 'PDF' ? (
            <div className="space-y-8">
              <div className="rounded-2xl overflow-hidden border border-border aspect-[3/4] md:aspect-[8.5/11] bg-bg-secondary"><iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdf_url)}&embedded=true`} className="w-full h-full border-none" title={title} loading="lazy" /></div>
              <div className="rounded-2xl border border-border bg-surface p-10 text-center space-y-6">
                <div className="w-16 h-16 rounded-xl bg-marigold/5 border border-marigold/10 flex items-center justify-center mx-auto"><FileDown size={28} className="text-marigold" /></div>
                <div className="space-y-2"><h2 className="text-2xl font-bold text-headline">Download Resource</h2><p className="text-text-secondary-dynamic text-sm max-w-sm mx-auto">Save this PDF document to your device for offline access.</p></div>
                <a href={pdf_url} download={pdf_filename || 'document.pdf'} target="_blank" rel="noopener noreferrer" onClick={() => captureEvent('content_downloaded', { title, type })} className="inline-flex items-center gap-3 bg-headline text-bg px-8 py-4 rounded-xl text-sm font-semibold tracking-wide hover:bg-accent hover:shadow-xl hover:shadow-accent/25 transition-all"><FileDown size={18} />Download {pdf_filename || 'PDF'}</a>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-black">{video_url && <iframe src={video_url.includes('playlist?list=') ? `https://www.youtube.com/embed/videoseries?list=${video_url.split('list=')[1]?.split('&')[0]}` : `https://www.youtube.com/embed/${video_url.includes('v=') ? video_url.split('v=')[1]?.split('&')[0] : video_url.split('youtu.be/')[1]?.split('?')[0]}`} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />}</div>
              {excerpt && <div className="rounded-2xl border border-border bg-surface p-8"><div className="flex items-center gap-3 mb-4"><Video size={18} className="text-marigold" /><h3 className="text-lg font-bold text-headline">Summary</h3></div><p className="text-text-secondary-dynamic leading-relaxed">{excerpt}</p></div>}
            </div>
          )}
          {tags.length > 0 && <div className="pt-10 border-t border-border flex flex-wrap gap-3">{tags.map((tag) => <span key={tag} className="pill inline-block px-3 py-1 text-[10px] text-text-tertiary-dynamic">{tag}</span>)}</div>}
        </div>
      </div>
    </div>
  )
}
