'use client'
import { motion } from 'framer-motion'
import { FileText, FileDown, ArrowRight, User, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const typeIcons = {
  'ARTICLE': <FileText className="text-primary" />,
  'PROBLEM': <Tag className="text-cyan" />,
  'BLOG': <FileText className="text-purple" />,
  'RESOURCE': <FileDown className="text-orange" />,
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop'

export default function ContentCard({ item, index, fallbackImage }) {
  const { title, slug, type, content_type, excerpt, cover_url, author_name, published_at, tags = [] } = item

  const icon = typeIcons[type] || <FileText className="text-primary" />

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group h-full"
    >
      <Link href={`/content/${slug}`} className="block h-full">
        <div className="relative glass rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          <div className="relative z-10 flex flex-col h-full w-full">
            {/* Cover Image */}
            <div className="aspect-[16/10] relative overflow-hidden">
              <Image 
                src={cover_url || fallbackImage || DEFAULT_COVER} 
                alt={title}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 text-primary border border-primary/10 backdrop-blur-md flex items-center gap-2">
                  {icon}
                  {type}
                </span>
              </div>
              {content_type === 'PDF' && (
                <div className="absolute bottom-4 right-4 z-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-coral/90 text-white border border-coral/20 backdrop-blur-md flex items-center gap-2 shadow-lg">
                    <FileDown size={14} />
                    PDF
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow space-y-4 bg-white/40 dark:bg-black/20">
              <h3 className="text-xl font-bold tracking-tight line-clamp-2 text-text dark:text-white group-hover:text-primary transition-colors z-10">
                {title}
              </h3>

              <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed line-clamp-3 z-10">
                {excerpt || 'Read this interesting mathematical piece shared by the MIN community.'}
              </p>

              <div className="pt-4 flex flex-wrap gap-2 z-10">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-bg-secondary dark:bg-white/5 text-text-tertiary border border-border dark:border-border-dark">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-6 flex items-center justify-between mt-auto border-t border-border/50 dark:border-border-dark/50 z-10 bg-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-2">
                    <User size={14} />
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-xs font-bold text-text dark:text-white truncate max-w-[100px]">{author_name || 'MIN Team'}</span>
                    <span className="text-[10px] text-text-tertiary">
                      {published_at ? new Date(published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-text-tertiary transition-transform mt-2 group-hover:translate-x-2 group-hover:text-primary" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
