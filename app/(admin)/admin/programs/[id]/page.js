'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProgramForm from '@/components/admin/ProgramForm'
import { Loader2 } from 'lucide-react'

export default function EditProgramPage() {
  const { id } = useParams()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgram() {
      try {
        const res = await fetch(`/api/programs/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setProgram(data)
      } catch (err) {
        console.error('Error fetching program:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProgram()
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  )

  if (!program) return (
    <div className="text-center py-24">
      <h2 className="text-2xl font-bold">Program not found</h2>
    </div>
  )

  return (
    <div className="space-y-8">
      <ProgramForm initialData={program} />
    </div>
  )
}
