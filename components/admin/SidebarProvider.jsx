'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Initialize from localStorage and handle resize
  useEffect(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    } else {
      setIsCollapsed(window.innerWidth < 1280)
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobileOpen(false)
      }
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setIsCollapsed(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const newVal = !prev
      localStorage.setItem('admin_sidebar_collapsed', newVal)
      return newVal
    })
  }

  const toggleMobile = () => {
    setIsMobileOpen(prev => !prev)
  }

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      setIsCollapsed, 
      toggleCollapse, 
      isMobileOpen, 
      setIsMobileOpen, 
      toggleMobile 
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
