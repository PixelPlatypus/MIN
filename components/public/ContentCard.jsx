'use client'
import { motion } from 'framer-motion'
import { FileText, FileDown, ArrowRight, Tag, Video } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const typeIcons = { ARTICLE: <FileText size={14} />, PROBLEM: <Tag size={14} />, BLOG: <FileText size={14} />, RESOURCE: <FileDown size={14} />, VIDEO: <Video size={14} /> }

export default function ContentCard({ item, index, fallbackImage }) {
  const { title, slug, type, content_type, excerpt, cover_url, author_name, published_at, tags = [], video_metadata = {} } = item
  const icon = typeIcons[type] || <FileText size={14} />
  const imageSrc = cover_url || (content_type === 'VIDEO' && video_metadata?.video_id ? `https://img.youtube.com/vi/${video_metadata.video_id}/hqdefault.jpg` : null) || fallbackImage || '/images/logo.png'

  return (
    <motion.div layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="group">
      <Link href={`/content/${slug}`} className="block">
        <div className="rounded-2xl overflow-hidden border border-border hover:border-headline/20 transition-all duration-300">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src={imageSrc} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="pill inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-text-tertiary-dynamic">{icon}{type}</span>
            </div>
            <h3 className="text-base font-bold text-headline mb-2 group-hover:text-accent transition-colors line-clamp-2">{title}</h3>
            {excerpt && <p className="text-sm text-text-secondary-dynamic leading-relaxed line-clamp-2 mb-4">{excerpt}</p>}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-xs text-text-tertiary-dynamic">
                {author_name && <span>{author_name}</span>}
                {published_at && <>{author_name && <span>&middot;</span>}<span>{new Date(published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></>}
              </div>
              <ArrowRight size={14} className="text-headline/40 group-hover:text-headline group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
