import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="pt-32 pb-24 space-y-16 animate-in fade-in duration-500">
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Link Placeholder */}
          <Skeleton className="w-32 h-6 rounded-lg" />

          {/* Header Placeholders */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Skeleton className="w-20 h-8 rounded-full" />
              <Skeleton className="w-24 h-8 rounded-full" />
            </div>
            <Skeleton className="w-full h-16 md:h-24 lg:h-32 rounded-xl" />
            <div className="flex gap-8 pt-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-48 h-6 rounded-lg" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-40 h-6 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Action Banner Placeholder */}
          <div className="glass p-8 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <Skeleton className="w-48 h-8 rounded-lg" />
              <Skeleton className="w-64 h-4 rounded-lg" />
            </div>
            <Skeleton className="w-40 h-14 rounded-2xl" />
          </div>

          {/* Cover Image Placeholder */}
          <Skeleton className="w-full aspect-[21/9] rounded-[3rem]" />
        </div>
      </section>

      {/* Content Block Placeholder */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-12 pt-12">
          <div className="glass rounded-[2.5rem] p-12 space-y-6">
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-5/6 h-4 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-4/6 h-4 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
