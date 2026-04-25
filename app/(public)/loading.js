import { PageHeaderSkeleton, ContentGridSkeleton } from '@/components/shared/Skeletons'

export default function Loading() {
  return (
    <div className="container mx-auto px-6 pt-32 pb-24 space-y-24 animate-in fade-in duration-500">
      <PageHeaderSkeleton />
      <ContentGridSkeleton count={6} />
    </div>
  )
}
