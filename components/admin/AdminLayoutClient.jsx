'use client'
import { useSidebar } from '@/components/admin/SidebarProvider'

export default function AdminLayoutClient({ children, sidebar, topbar }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark transition-colors flex">
      {sidebar}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
      >
        {topbar}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
