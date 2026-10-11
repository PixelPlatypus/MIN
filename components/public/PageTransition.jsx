'use client'
import { usePathname } from 'next/navigation'

// Opacity-only fade keyed on the route. No exit animation (the App Router unmounts the old
// page immediately) and no transform, which would break fixed/sticky children.
export default function PageTransition({ children }) {
  const pathname = usePathname()
  return <div key={pathname} className="animate-page-in">{children}</div>
}
