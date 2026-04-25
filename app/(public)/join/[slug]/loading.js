import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen pt-32 pb-40 px-6 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Placeholder */}
        <header className="space-y-6">
          <Skeleton className="w-32 h-4 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="w-40 h-6 rounded-full" />
            <Skeleton className="w-full h-16 md:h-24 rounded-xl" />
            <Skeleton className="w-2/3 h-6 rounded-lg" />
          </div>
        </header>

        {/* Form Placeholder */}
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-border space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`space-y-3 ${i > 3 ? 'md:col-span-2' : ''}`}>
                <Skeleton className="w-24 h-3 rounded-lg" />
                <Skeleton className={`w-full ${i > 3 ? 'h-32' : 'h-14'} rounded-2xl`} />
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-3 rounded-lg" />
                <Skeleton className="w-24 h-3 rounded-lg" />
              </div>
            </div>
            <Skeleton className="w-full md:w-48 h-14 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
