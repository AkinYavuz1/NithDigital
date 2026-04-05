'use client'

import { usePathname } from 'next/navigation'
import OSSidebar from './OSSidebar'
import OSTopBar from './OSTopBar'

export default function OSLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDemo = pathname.startsWith('/os/demo')

  if (isDemo) return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E6' }}>
      <OSSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <OSTopBar />
        {children}
      </div>
    </div>
  )
}
