import { createClient } from '@/lib/supabase/server'
import TeamView from '@/components/public/TeamView'
import TeamHero from '@/components/public/TeamHero'

export default async function TeamPage() {
  const supabase = await createClient()

  // Fetch settings and tenures in parallel
  const [
    { data: settings },
    { data: tenuresData }
  ] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').single(),
    supabase.rpc('get_team_tenures') // Assuming this exists or using fallback below
  ])

  // Fallback for tenures if RPC not available
  let tenures = tenuresData || []
  if (!tenuresData || tenuresData.length === 0) {
    const { data } = await supabase.from('team_members').select('tenure').not('tenure', 'is', null)
    if (data && data.length > 0) {
      tenures = [...new Set(data.map(d => d.tenure))].sort((a, b) => b - a)
    } else {
      tenures = []
    }
  }

  const activeTenure = tenures[0]
  let initialMembers = []

  if (activeTenure) {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .neq('status', 'REMOVED')
    
    if (data) {
      const filterYear = parseInt(activeTenure)
      const filtered = data
        .filter(member => {
          const joinedYear = parseInt(member.tenure)
          if (isNaN(joinedYear)) return member.tenure === activeTenure
          
          let leftYear = joinedYear
          if (member.farewell_date) {
            const farewellDate = new Date(member.farewell_date)
            const year = farewellDate.getFullYear()
            const month = farewellDate.getMonth()
            leftYear = month >= 6 ? year : year - 1
            if (leftYear < joinedYear) leftYear = joinedYear
          } else if (member.status === 'ACTIVE') {
            leftYear = new Date().getFullYear()
          }
          
          return filterYear >= joinedYear && filterYear <= leftYear
        })
        .map(member => {
          const roleHistory = member.social_links?.role_history
          if (Array.isArray(roleHistory) && roleHistory.length > 0) {
            const historicalRole = roleHistory.find(h => parseInt(h.year) === filterYear)
            if (historicalRole?.position) {
              return { ...member, position: historicalRole.position }
            }
          }
          return member
        })
      
      const rolePriority = { 'President': 1, 'Manager': 2, 'MINion': 3 }
      const statusPriority = { 'ACTIVE': 1, 'ALUMNI': 2, 'INACTIVE': 3 }

      initialMembers = filtered.sort((a, b) => {
        const priRoleA = rolePriority[a.position] || 99
        const priRoleB = rolePriority[b.position] || 99
        if (priRoleA !== priRoleB) return priRoleA - priRoleB
        const yearA = new Date(a.joined_date || 0).getFullYear()
        const yearB = new Date(b.joined_date || 0).getFullYear()
        if (yearA !== yearB) return yearA - yearB
        const priStatA = statusPriority[a.status] || 99
        const priStatB = statusPriority[b.status] || 99
        if (priStatA !== priStatB) return priStatA - priStatB
        return (a.name || '').localeCompare(b.name || '')
      })
    }
  }

  return (
    <div className="pt-32 pb-24 space-y-24">
      <TeamHero settings={settings} />
      
      <TeamView 
        initialTenures={tenures}
        initialMembers={initialMembers}
        initialTenure={activeTenure}
        fallbackImage={settings?.default_team_photo}
      />
    </div>
  )
}
