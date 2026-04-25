import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="pt-32 pb-24 space-y-32 container mx-auto px-6 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <Skeleton className="w-40 h-10 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-[80%] h-16 md:h-24 lg:h-32 rounded-xl" />
        </div>
        <div className="max-w-3xl mx-auto space-y-2">
          <Skeleton className="w-full h-5 rounded-lg" />
          <Skeleton className="w-5/6 h-5 mx-auto rounded-lg" />
        </div>
      </section>

      {/* Selection Process Timeline */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="w-64 h-10 mx-auto rounded-lg" />
          <Skeleton className="w-[60%] h-6 mx-auto rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass rounded-3xl p-8 flex flex-col items-center text-center space-y-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <Skeleton className="w-12 h-6 rounded-lg" />
              <Skeleton className="w-24 h-4 rounded-lg" />
              <Skeleton className="w-full h-12 rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* DMO Practice Banner */}
      <section className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-16 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 flex-1">
            <Skeleton className="w-16 h-16 rounded-3xl" />
            <Skeleton className="w-64 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="w-full h-4 rounded-lg" />
              <Skeleton className="w-5/6 h-4 rounded-lg" />
            </div>
          </div>
          <Skeleton className="w-48 h-16 rounded-2xl" />
        </div>
      </section>
    </div>
  )
}
