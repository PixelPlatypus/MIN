import ContentForm from '@/components/admin/ContentForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditContentPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: content, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !content) {
    notFound()
  }

  return <ContentForm initialData={content} />
}
