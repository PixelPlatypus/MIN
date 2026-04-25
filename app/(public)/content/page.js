import { createClient } from '@/lib/supabase/server'
import ContentLibraryView from '@/components/public/ContentLibraryView'
import ContentLibraryHero from '@/components/public/ContentLibraryHero'

export default async function ContentLibraryPage() {
  const supabase = await createClient()

  // Fetch settings and initial content in parallel with error logging
  const [
    settingsResult,
    contentResult
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').single(),
    supabase.from('content')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(12)
  ])

  if (settingsResult.error) {
    console.error('ContentPage: Settings Fetch Error:', settingsResult.error)
  }
  if (contentResult.error) {
    console.error('ContentPage: Content Fetch Error:', contentResult.error)
  }

  const settings = settingsResult.data
  const initialContent = contentResult.data || []
  const fallbackImage = settings?.default_notice_image || null

  return (
    <div className="pt-32 pb-24 space-y-24">
      <ContentLibraryHero />
      
      <ContentLibraryView 
        initialContent={initialContent}
        fallbackImage={fallbackImage}
      />
    </div>
  )
}
