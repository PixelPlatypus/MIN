import { createPublicClient } from '@/lib/supabase/server'
import ContentDetailView from '@/components/public/ContentDetailView'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Empty list = render each slug on first visit, then cache (ISR).
export async function generateStaticParams() { return [] }

export default async function ContentDetailPage({ params }) {
  const { slug } = await params
  const supabase = createPublicClient()

  const { data: content, error } = await supabase
    .from('content')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .single()

  if (error || !content) {
    if (error) console.error('ContentDetailPage Error:', error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-36 pb-24 px-6 text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gradient-brand pb-1">Content Not Found</h1>
        <p className="text-lg text-auto-secondary">We couldn't find the resource you're looking for.</p>
        <Link href="/content" className="btn-brand">
          Back to Library
        </Link>
      </div>
    )
  }

  return <ContentDetailView content={content} />
}
