import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="pt-32 pb-24 animate-in fade-in duration-500">
      <div className="container mx-auto px-6 max-w-5xl space-y-12">
        {/* Back Link Placeholder */}
        <Skeleton className="w-32 h-6 rounded-lg" />

        {/* Header Placeholders */}
        <div className="space-y-6">
          <div className="flex gap-3">
            <Skeleton className="w-20 h-8 rounded-full" />
            <Skeleton className="w-24 h-8 rounded-full" />
          </div>
          <Skeleton className="w-full h-16 md:h-24 lg:h-32 rounded-xl" />
          <div className="flex gap-8 pt-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-24 h-4 rounded-lg" />
                <Skeleton className="w-16 h-3 rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4 rounded-lg" />
                <Skeleton className="w-20 h-3 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image Placeholder */}
        <Skeleton className="w-full aspect-[21/9] rounded-[3rem]" />

        {/* Content Body Placeholder */}
        <div className="max-w-4xl mx-auto space-y-6 pt-12">
          <Skeleton className="w-full h-4 rounded-lg" />
          <Skeleton className="w-5/6 h-4 rounded-lg" />
          <Skeleton className="w-full h-4 rounded-lg" />
          <Skeleton className="w-4/6 h-4 rounded-lg" />
          <div className="pt-12 space-y-6">
             <Skeleton className="w-full h-4 rounded-lg" />
             <Skeleton className="w-full h-4 rounded-lg" />
             <Skeleton className="w-3/4 h-4 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
