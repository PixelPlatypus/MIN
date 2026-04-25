import { createClient } from '@/lib/supabase/server'
import ContentDetailView from '@/components/public/ContentDetailView'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ContentDetailPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: content, error } = await supabase
    .from('content')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .single()

  if (error || !content) {
    if (error) console.error('ContentDetailPage Error:', error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32 space-y-8">
        <h1 className="text-4xl font-bold text-gradient">Content Not Found</h1>
        <p className="text-text-tertiary">We couldn't find the resource you're looking for.</p>
        <Link href="/content" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:-translate-y-1 transition-all shadow-lg shadow-primary/20">
          Back to Library
        </Link>
      </div>
    )
  }

  return <ContentDetailView content={content} />
}
