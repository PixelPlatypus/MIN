'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import GalleryForm from '@/components/admin/GalleryForm'
import { Loader2 } from 'lucide-react'

export default function EditGalleryImagePage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/gallery/${id}`)
        if (res.ok) {
          const json = await res.json()
          setData(json)
        } else {
          setError('Failed to fetch image data')
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('An error occurred while fetching data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-24 glass rounded-[3rem] border border-dashed border-coral/30">
        <h3 className="text-xl font-bold text-coral mb-2">Error</h3>
        <p className="text-text-tertiary">{error || 'Image not found'}</p>
      </div>
    )
  }

  return <GalleryForm initialData={data} isEditing={true} />
}
