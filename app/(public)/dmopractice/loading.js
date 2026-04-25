import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="pt-32 pb-24 space-y-24 container mx-auto px-6 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-12">
        <div className="flex justify-center">
          <Skeleton className="w-48 h-10 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-[80%] h-16 md:h-24 lg:h-32 rounded-xl" />
        </div>
        <div className="max-w-2xl mx-auto space-y-2">
          <Skeleton className="w-full h-5 rounded-lg" />
          <Skeleton className="w-5/6 h-5 mx-auto rounded-lg" />
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Practice Sets List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton className="w-64 h-10 rounded-lg" />
              <div className="h-px flex-1 bg-border dark:bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 glass rounded-[2.5rem] p-8 space-y-6">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <Skeleton className="w-3/4 h-8 rounded-lg" />
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-4 rounded-lg" />
                    <Skeleton className="w-20 h-4 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton className="w-48 h-10 rounded-lg" />
              <div className="h-px flex-1 bg-border dark:bg-white/10" />
            </div>
            <div className="glass p-8 rounded-[2.5rem] space-y-8">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="space-y-6">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-24 w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
