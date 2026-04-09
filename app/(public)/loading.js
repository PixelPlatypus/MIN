import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
        <p className="text-sm text-text-secondary font-medium">Loading...</p>
      </div>
    </div>
  )
}
