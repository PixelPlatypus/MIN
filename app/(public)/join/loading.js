import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="pt-20 pb-32 container mx-auto px-6 animate-in fade-in duration-500">
      <section className="py-24 md:py-36">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <Skeleton className="w-24 h-6 rounded-full" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="w-[80%] h-16 md:h-24 lg:h-32 rounded-xl" />
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-5/6 h-4 mx-auto rounded-lg" />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Skeleton className="w-full sm:w-40 h-14 rounded-2xl" />
            <Skeleton className="w-full sm:w-48 h-14 rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-3xl p-7 space-y-4">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="w-24 h-6 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto pb-32">
        <div className="text-center space-y-3 mb-16">
          <Skeleton className="w-64 h-10 mx-auto rounded-lg" />
          <Skeleton className="w-96 h-4 mx-auto rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-3xl p-8 space-y-6">
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <Skeleton className="w-48 h-8 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-24 h-3 rounded-lg" />
                <Skeleton className="w-32 h-3 rounded-lg" />
                <Skeleton className="w-28 h-3 rounded-lg" />
              </div>
              <Skeleton className="w-full h-12 rounded-2xl" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
