import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="pt-32 pb-24 space-y-32 container mx-auto px-6 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <Skeleton className="w-40 h-8 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="w-[80%] h-16 md:h-20 rounded-xl" />
        </div>
        <div className="max-w-3xl mx-auto space-y-2">
          <Skeleton className="w-full h-4 rounded-lg" />
          <Skeleton className="w-5/6 h-4 mx-auto rounded-lg" />
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="glass rounded-[3rem] p-12 space-y-6">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="w-48 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-2/3 h-4 rounded-lg" />
          </div>
        </div>
        <div className="glass rounded-[3rem] p-12 space-y-6">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="w-48 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-2/3 h-4 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12">
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="w-32 h-4 mx-auto rounded-lg" />
          <Skeleton className="w-64 h-12 mx-auto rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-3xl p-8 space-y-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="w-32 h-6 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
