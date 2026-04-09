import TeamForm from '@/components/admin/TeamForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditTeamMemberPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  console.log(`FETCHING TEAM MEMBER: ${id}`)
  const { data: member, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('TEAM MEMBER FETCH ERROR:', {
      error,
      id,
      code: error.code,
      message: error.message
    })
    notFound()
  }

  if (!member) {
    console.warn(`TEAM MEMBER NOT FOUND: ${id}`)
    notFound()
  }

  return <TeamForm initialData={member} />
}
