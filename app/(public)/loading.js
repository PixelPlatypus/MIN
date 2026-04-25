import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-6 pt-32 pb-24 space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3 rounded-xl" />
        <Skeleton className="h-6 w-2/3 rounded-lg" />
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
            <Skeleton className="h-4 w-4/6 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
