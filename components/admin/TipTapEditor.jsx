'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react'

export default function TipTapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable StarterKit's built-in link so our custom configured one is the only instance
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none min-h-[200px] focus:outline-none p-4',
      },
    },
  })

  if (!editor) return null

  const MenuButton = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/10 text-text-secondary hover:text-primary'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-border dark:border-border-dark rounded-2xl overflow-hidden focus-within:border-primary transition-all">
      <div className="bg-bg-secondary dark:bg-white/5 border-b border-border dark:border-border-dark p-2 flex flex-wrap gap-1">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-border dark:bg-border-dark mx-1 self-center" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-border dark:bg-border-dark mx-1 self-center" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-border dark:bg-border-dark mx-1 self-center" />
        <MenuButton 
          onClick={() => {
            const url = window.prompt('URL')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </MenuButton>
        <div className="flex-1" />
        <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={18} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={18} />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
