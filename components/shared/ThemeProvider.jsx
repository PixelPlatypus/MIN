'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect } from 'react'

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'min-theme-storage',
    }
  )
)

export function ThemeProvider({ children }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}

export { useThemeStore }
