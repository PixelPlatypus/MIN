// app/providers.js
'use client'

import dynamic from 'next/dynamic'

const NoticePopup = dynamic(() => import('@/components/shared/NoticePopup'), { ssr: false })

export function ClientProviders({ children }) {
  return (
    <>
      {children}
      <NoticePopup />
    </>
  )
}
