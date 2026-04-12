'use client'
import ProgramForm from '@/components/admin/ProgramForm'

export default function NewProgramPage() {
  return (
    <div className="space-y-8">
      <ProgramForm 
        initialData={{
          name: '',
          tagline: '',
          learn_more_link: '',
          status: 'ACTIVE',
          display_order: 0,
        }} 
      />
    </div>
  )
}
