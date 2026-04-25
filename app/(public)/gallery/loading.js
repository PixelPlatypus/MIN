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

      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-32 h-12 rounded-2xl" />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-20 h-8 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  )
}
