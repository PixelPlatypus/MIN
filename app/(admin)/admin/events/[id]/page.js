import EventForm from '@/components/admin/EventForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditEventPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  return <EventForm initialData={event} />
}
