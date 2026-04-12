'use client'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Highlighter,
  Eye,
  Columns,
  Type,
  Eraser
} from 'lucide-react'

export default function TipTapEditor({ content, onChange }) {
  const [markdown, setMarkdown] = useState(content || '')
  const [viewMode, setViewMode] = useState('split') // 'edit', 'preview', 'split'

  useEffect(() => {
    if (content !== undefined && content !== markdown) {
      setMarkdown(content || '')
    }
  }, [content])

  const handleTextChange = (e) => {
    const val = e.target.value
    setMarkdown(val)
    onChange(val)
  }

  const insertText = (before, after = '') => {
    const textarea = document.getElementById('markdown-textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    setMarkdown(newText)
    onChange(newText)
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const ToolbarButton = ({ onClick, children, title, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
        active 
          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' 
          : 'text-text-tertiary hover:text-primary hover:bg-primary/10 hover:scale-105 active:scale-95'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-border dark:border-border-dark rounded-[2.5rem] overflow-hidden focus-within:border-primary/50 transition-all shadow-2xl bg-white dark:bg-black/20 flex flex-col h-[650px]">
      {/* Dynamic Toolbar */}
      <div className="bg-bg-secondary/40 dark:bg-white/5 border-b border-border dark:border-border-dark p-4 flex flex-wrap items-center justify-between gap-6 backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <ToolbarButton onClick={() => insertText('# ')} title="Heading 1">
            <Heading1 size={19} />
          </ToolbarButton>
          <ToolbarButton onClick={() => insertText('## ')} title="Heading 2">
            <Heading2 size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => insertText('### ')} title="Heading 3">
            <Heading3 size={17} />
          </ToolbarButton>
          <div className="w-px h-6 bg-border dark:bg-border-dark mx-1 opacity-50" />
          
          <ToolbarButton onClick={() => insertText('> ')} title="Quote">
            <Quote size={18} />
          </ToolbarButton>
          <div className="w-px h-6 bg-border dark:bg-border-dark mx-1 opacity-50" />
          
          <ToolbarButton onClick={() => insertText('**', '**')} title="Bold">
            <Bold size={20} />
          </ToolbarButton>
          <ToolbarButton onClick={() => insertText('*', '*')} title="Italic">
            <Italic size={20} />
          </ToolbarButton>
          <ToolbarButton onClick={() => insertText('<mark>', '</mark>')} title="Highlight">
            <Highlighter size={20} />
          </ToolbarButton>

          <div className="w-px h-6 bg-border dark:bg-border-dark mx-1 opacity-50" />
          
          <ToolbarButton onClick={() => insertText('- ')} title="Bullet List">
            <List size={20} />
          </ToolbarButton>
          <ToolbarButton onClick={() => insertText('1. ')} title="Numbered List">
            <ListOrdered size={20} />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-border dark:bg-border-dark mx-1 opacity-50" />

          <ToolbarButton onClick={() => insertText('[', '](https://)')} title="Add Link">
            <LinkIcon size={20} />
          </ToolbarButton>
          <ToolbarButton onClick={() => insertText('\n---\n')} title="Line Divider">
            <Minus size={20} />
          </ToolbarButton>
        </div>

        {/* View Toggles */}
        <div className="flex bg-bg-secondary/80 dark:bg-black/40 rounded-2xl p-1.5 gap-1 border border-border dark:border-white/5 overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'edit' ? 'bg-white dark:bg-white/10 shadow-md text-primary scale-105' : 'text-text-tertiary hover:text-text-secondary'}`}
          >
            <Type size={14} />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'split' ? 'bg-white dark:bg-white/10 shadow-md text-primary scale-105' : 'text-text-tertiary hover:text-text-secondary'}`}
          >
            <Columns size={14} />
            Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-white/10 shadow-md text-primary scale-105' : 'text-text-tertiary hover:text-text-secondary'}`}
          >
            <Eye size={14} />
            Preview
          </button>
        </div>
      </div>

      {/* Editor/Preview Surface */}
      <div className="flex-1 flex overflow-hidden">
        {(viewMode === 'edit' || viewMode === 'split') && (
          <textarea
            id="markdown-textarea"
            value={markdown}
            onChange={handleTextChange}
            placeholder="Start writing your event details..."
            className={`flex-1 p-10 md:p-14 bg-transparent font-medium text-base leading-relaxed focus:outline-none resize-none overflow-y-auto border-r border-border dark:border-white/5 scrollbar-hide ${viewMode === 'edit' ? 'w-full' : 'w-1/2'}`}
          />
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`flex-1 p-10 md:p-14 overflow-y-auto bg-bg-tertiary/20 dark:bg-black/20 content-preview ${viewMode === 'preview' ? 'w-full' : 'w-1/2'}`}>
            <style>{`
              .content-preview .prose h1 { 
                font-size: 2.25rem !important; 
                line-height: 1.2 !important;
                margin-bottom: 2rem !important;
                margin-top: 3rem !important;
                display: block !important;
                color: var(--text-primary) !important;
                font-weight: 900 !important;
              }
              .content-preview .prose h2 { 
                font-size: 1.75rem !important; 
                line-height: 1.3 !important;
                margin-bottom: 1.5rem !important;
                margin-top: 2.5rem !important;
                color: var(--text-primary) !important;
                font-weight: 800 !important;
              }
              .content-preview .prose h3 { 
                font-size: 1.4rem !important; 
                line-height: 1.4 !important;
                margin-bottom: 1rem !important;
                margin-top: 2rem !important;
                color: var(--text-primary) !important;
                font-weight: 700 !important;
              }
              .content-preview .prose blockquote {
                border-left: 5px solid #008080 !important;
                background: rgba(0, 128, 128, 0.05) !important;
                padding: 1.5rem 2rem !important;
                margin: 2.5rem 0 !important;
                font-style: italic !important;
                border-radius: 0 1rem 1rem 0 !important;
              }
              .dark .content-preview .prose h1,
              .dark .content-preview .prose h2,
              .dark .content-preview .prose h3 { color: white !important; }
              
              .content-preview .prose ul { 
                list-style-type: disc !important; 
                padding-left: 2rem !important;
                margin-bottom: 2rem !important;
              }
              .content-preview .prose ol { 
                list-style-type: decimal !important; 
                padding-left: 2rem !important;
                margin-bottom: 2rem !important;
              }
              .content-preview .prose li {
                margin-bottom: 0.5rem !important;
                display: list-item !important;
              }
              .content-preview .prose a {
                color: #008080 !important; /* Teal primary */
                text-decoration: underline !important;
                font-weight: 800 !important;
              }
              .content-preview .prose p {
                margin-bottom: 1.5rem !important;
              }
              .content-preview .prose hr {
                margin: 2rem 0 !important;
                border: none !important;
                border-top: 2px solid rgba(0, 128, 128, 0.2) !important;
              }
            `}</style>
            <div className="prose prose-lg dark:prose-invert max-w-none text-left
              prose-headings:font-black prose-headings:tracking-tight
              prose-h1:text-6xl! prose-h1:mb-12! prose-h1:mt-8!
              prose-p:text-lg prose-p:leading-relaxed
              prose-strong:font-bold prose-strong:text-text-primary dark:prose-strong:text-white
            ">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkBreaks]} 
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
              >
                {markdown || '*Nothing to preview...*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Stats */}
      <div className="bg-bg-secondary/30 dark:bg-black/20 border-t border-border dark:border-border-dark px-6 py-3 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
            Live Preview Active
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-text-tertiary">
          <span>{markdown.split(/\s+/).filter(Boolean).length} Words</span>
          <div className="w-1 h-1 bg-border rounded-full" />
          <span>{markdown.length} Chars</span>
          <button 
            onClick={() => { setMarkdown(''); onChange(''); }}
            className="flex items-center gap-1.5 text-coral hover:text-coral/80 transition-colors ml-2"
          >
            <Eraser size={12} />
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
