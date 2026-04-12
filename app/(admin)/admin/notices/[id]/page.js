'use client'
import { useState, useEffect, use } from 'react'
import { Loader2 } from 'lucide-react'
import NoticeForm from '@/components/admin/NoticeForm'

export default function EditNoticePage({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params?.id
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    
    async function fetchNotice() {
      try {
        const res = await fetch(`/api/notices/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setNotice(data)
      } catch (err) {
        console.error('Fetch notice error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotice()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-text-tertiary animate-pulse font-medium">Fetching notice details...</p>
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="text-center py-24">
        <h3 className="text-xl font-bold">Notice not found</h3>
      </div>
    )
  }

  return <NoticeForm initialData={notice} />
}
