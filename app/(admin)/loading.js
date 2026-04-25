import { PageHeaderSkeleton, TableSkeleton } from '@/components/shared/Skeletons'

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} cols={5} />
    </div>
  )
}
