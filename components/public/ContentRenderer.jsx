'use client'
import DOMPurify from 'isomorphic-dompurify'

export default function ContentRenderer({ html }) {
  const sanitizedHTML = DOMPurify.sanitize(html)

  return (
    <div 
      className="prose dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-img:rounded-[2rem] prose-img:shadow-2xl prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-2xl prose-blockquote:p-6"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}
