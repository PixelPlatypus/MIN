import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="pt-32 pb-24 space-y-24 container mx-auto px-6 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <Skeleton className="w-48 h-8 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-96 h-16 md:h-20 rounded-xl" />
        </div>
        <div className="max-w-3xl mx-auto space-y-2">
          <Skeleton className="w-full h-4 rounded-lg" />
          <Skeleton className="w-5/6 h-4 mx-auto rounded-lg" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-32 h-12 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/5] rounded-3xl" />
            <Skeleton className="w-3/4 h-6 rounded-lg" />
            <Skeleton className="w-1/2 h-4 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
