'use client'
import Link from 'next/link'
export default function Logo({ className = '', size = 'md' }) {
  const sizes = { sm: 'h-8', md: 'h-11', lg: 'h-14', xl: 'h-22' }
  return (
    <Link href="/" className={`inline-flex items-center shrink-0 ${className}`} aria-label="MIN Home">
      <img src="/images/logo-transparent.svg" alt="MIN — Mathematics Initiatives in Nepal" className={`${sizes[size]} w-auto`} />
    </Link>
  )
}
