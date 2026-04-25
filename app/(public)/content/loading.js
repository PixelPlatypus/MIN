import { Skeleton } from '@/components/ui/Skeleton'
import { ContentGridSkeleton } from '@/components/shared/Skeletons'

export default function Loading() {
  return (
    <div className="pt-32 pb-24 space-y-24 container mx-auto px-6 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <Skeleton className="w-24 h-8 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-[80%] h-16 md:h-20 rounded-xl" />
        </div>
        <div className="max-w-3xl mx-auto space-y-2">
          <Skeleton className="w-full h-4 rounded-lg" />
          <Skeleton className="w-5/6 h-4 mx-auto rounded-lg" />
        </div>
        <div className="flex justify-center pt-4">
          <Skeleton className="w-64 h-14 rounded-2xl" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto mb-16">
        <Skeleton className="flex-1 h-12 rounded-2xl" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-24 h-12 rounded-2xl" />
        ))}
      </div>

      <ContentGridSkeleton count={6} />
    </div>
  )
}
