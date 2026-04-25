import { Skeleton } from "@/components/ui/Skeleton"

export function CardSkeleton() {
  return (
    <div className="glass rounded-[2rem] overflow-hidden border border-border dark:border-border-dark p-6 space-y-6">
      <Skeleton className="w-full aspect-video rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  )
}

export function ContentGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="glass rounded-[2rem] overflow-hidden border border-border dark:border-border-dark">
      <div className="bg-bg-secondary dark:bg-white/5 px-6 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 rounded-lg" />
        ))}
      </div>
      <div className="divide-y divide-border dark:divide-border-dark">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3 rounded-lg" />
              <Skeleton className="h-3 w-1/4 rounded-lg" />
            </div>
            {Array.from({ length: cols - 1 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4 mb-12">
      <Skeleton className="h-10 w-1/3 rounded-xl" />
      <Skeleton className="h-4 w-1/2 rounded-lg" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="glass rounded-[2rem] p-8 space-y-8 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <div className="flex justify-end pt-4">
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="w-4 h-6 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-lg" />
              <div className="flex items-end gap-3">
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-4 w-10 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-3 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-16 rounded-lg" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2 pb-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                  </div>
                  <Skeleton className="h-3 w-48 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-3xl p-8 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-3 w-40 rounded-lg" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
