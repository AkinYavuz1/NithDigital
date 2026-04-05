'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import OSSidebar from './OSSidebar'
import OSTopBar from './OSTopBar'

export default function OSLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDemo = pathname.startsWith('/os/demo')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isDemo) return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E6' }}>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            display: 'none',
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 49,
          }}
          className="sidebar-backdrop"
        />
      )}

      <OSSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onMoreToggle={() => setSidebarOpen(o => !o)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="os-main-content">
        <OSTopBar onMenuToggle={() => setSidebarOpen(o => !o)} />
        {children}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-backdrop { display: block !important; }
          .os-main-content { padding-bottom: calc(64px + env(safe-area-inset-bottom)) !important; }
        }
      `}</style>
    </div>
  )
}
