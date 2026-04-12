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
          border-left: 5px solid #008080 !important;
          background: rgba(0, 128, 128, 0.05) !important;
          padding: 1.5rem 2rem !important;
          margin: 2.5rem 0 !important;
          font-style: italic !important;
          border-radius: 0 1rem 1rem 0 !important;
        }
        .dark .prose h1,
        .dark .prose h2,
        .dark .prose h3 { color: white !important; }
        
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
          color: #008080 !important;
          text-decoration: underline !important;
          font-weight: 800 !important;
        }
        .prose hr {
          margin: 2rem 0 !important;
          border: none !important;
          border-top: 2px solid rgba(0, 128, 128, 0.2) !important;
        }
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
