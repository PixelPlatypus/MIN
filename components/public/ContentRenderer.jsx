'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export default function ContentRenderer({ html, content }) {
  // Support both 'html' (old) and 'content' props
  const rawText = content || html || ''

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert text-left
      prose-headings:font-black prose-headings:tracking-tight
      prose-h1:text-6xl! prose-h1:mb-12! prose-h1:mt-8!
      prose-p:text-lg prose-p:leading-relaxed
      prose-strong:font-bold prose-strong:text-text-primary dark:prose-strong:text-white
    ">
      <style>{`
        .prose h1 { 
          font-size: 2.25rem !important; 
          line-height: 1.2 !important;
          margin-bottom: 2rem !important;
          margin-top: 3rem !important;
          display: block !important;
          color: var(--text-primary) !important;
          font-weight: 900 !important;
        }
        .prose h2 { 
          font-size: 1.75rem !important; 
          line-height: 1.3 !important;
          margin-bottom: 1.5rem !important;
          margin-top: 2.5rem !important;
          color: var(--text-primary) !important;
          font-weight: 800 !important;
        }
        .prose h3 { 
          font-size: 1.4rem !important; 
          line-height: 1.4 !important;
          margin-bottom: 1rem !important;
          margin-top: 2rem !important;
          color: var(--text-primary) !important;
          font-weight: 700 !important;
        }
        .prose blockquote {
          border-left: 5px solid var(--color-primary) !important;
          background: rgba(22, 85, 109, 0.05) !important;
          padding: 1.5rem 2rem !important;
          margin: 2.5rem 0 !important;
          font-style: italic !important;
          border-radius: 0 1rem 1rem 0 !important;
        }
        .dark .prose h1,
        .dark .prose h2,
        .dark .prose h3 { color: white !important; }
        .dark .prose blockquote {
          border-left-color: var(--color-secondary) !important;
          background: rgba(246, 240, 148, 0.06) !important;
        }
        
        .prose ul { 
          list-style-type: disc !important; 
          padding-left: 2rem !important;
          margin-bottom: 2rem !important;
        }
        .prose ol { 
          list-style-type: decimal !important; 
          padding-left: 2rem !important;
          margin-bottom: 2rem !important;
        }
        .prose li {
          margin-bottom: 0.5rem !important;
          display: list-item !important;
        }
        .prose a {
          color: var(--color-primary) !important;
          text-decoration: underline !important;
          text-decoration-color: rgba(22, 85, 109, 0.35) !important;
          text-underline-offset: 3px !important;
          font-weight: 800 !important;
        }
        .dark .prose a {
          color: var(--color-secondary) !important;
          text-decoration-color: rgba(246, 240, 148, 0.4) !important;
        }
        .prose hr {
          margin: 2rem 0 !important;
          border: none !important;
          border-top: 2px solid rgba(22, 85, 109, 0.15) !important;
        }
        .dark .prose hr { border-top-color: rgba(255, 255, 255, 0.12) !important; }
        .prose pre {
          border-radius: 1.25rem !important;
          border: 1px solid rgba(22, 85, 109, 0.15) !important;
        }
        .prose img { border-radius: 1.5rem !important; }
      `}</style>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]} 
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {rawText}
      </ReactMarkdown>
    </div>
  )
}
