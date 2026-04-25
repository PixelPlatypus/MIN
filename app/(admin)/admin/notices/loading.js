import { TableSkeleton } from "@/components/shared/Skeletons"

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-48 bg-primary/10 rounded-xl animate-pulse" />
      <TableSkeleton rows={8} cols={5} />
    </div>
  )
}
