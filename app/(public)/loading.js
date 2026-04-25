import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center space-y-8 animate-in fade-in duration-500">
          
          <div className="flex justify-center">
            <Skeleton className="w-48 h-10 rounded-full" />
          </div>

          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-full max-w-3xl h-16 md:h-24 rounded-2xl" />
            <Skeleton className="w-3/4 max-w-2xl h-16 md:h-24 rounded-2xl" />
          </div>

          <div className="max-w-3xl mx-auto space-y-3 pt-4">
            <Skeleton className="w-full h-5 rounded-lg" />
            <Skeleton className="w-full h-5 rounded-lg" />
            <Skeleton className="w-2/3 h-5 mx-auto rounded-lg" />
          </div>

          <div className="flex justify-center pt-8">
            <Skeleton className="w-56 h-16 rounded-2xl" />
          </div>
          
        </div>
      </div>
    </section>
  )
}
