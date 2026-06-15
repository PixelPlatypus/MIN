// app/(admin)/admin/certificates/[id]/page.js
import CertificateForm from '@/components/admin/CertificateForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditCertificatePage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: cert, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !cert) {
    notFound()
  }

  return <CertificateForm initialData={cert} />
}
