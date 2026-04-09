import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    console.log('--- ADMIN APPLICATIONS GET API START ---')
    const { error } = await withRole(['ADMIN', 'MANAGER'])
    if (error) {
      console.error('withRole error in applications admin:', error)
      return Response.json({ error: error.message }, { status: error.status })
    }

    const supabase = await createAdminClient()
    
    const { data, error: fetchError } = await supabase
      .from('join_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Admin Fetch Applications Error:', fetchError)
      return Response.json({ error: fetchError.message }, { status: 500 })
    }

    return Response.json(data)
  } catch (fatalError) {
    console.error('FATAL ERROR IN ADMIN APPLICATIONS API:', fatalError)
    return Response.json({ error: 'Internal Server Error', details: fatalError.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { error } = await withRole(['ADMIN']) // Only super admins can clear all
    if (error) return Response.json({ error: error.message }, { status: error.status })

    const supabase = await createAdminClient()
    
    // Wipe all applications
    const { error: deleteError } = await supabase
      .from('join_applications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Trick to match all rows

    if (deleteError) {
      console.error('Admin Delete All Applications Error:', deleteError)
      return Response.json({ error: deleteError.message }, { status: 500 })
    }

    await logAudit('CLEAR_ALL_APPLICATIONS', 'join_applications', null, { 
      timestamp: new Date().toISOString() 
    })

    return Response.json({ success: true })
  } catch (fatalError) {
    return Response.json({ error: 'Internal Server Error', details: fatalError.message }, { status: 500 })
  }
}

