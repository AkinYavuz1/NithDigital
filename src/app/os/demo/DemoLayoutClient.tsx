'use client'

import { useState } from 'react'
import DemoSidebar from './DemoSidebar'
import DemoTopBar from './DemoTopBar'
import DemoBanner from './DemoBanner'

export default function DemoLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F0E6' }}>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 49 }}
          className="sidebar-backdrop" />
      )}
      <DemoSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DemoTopBar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <DemoBanner />
        {children}
      </div>
      <style>{`
        @media (max-width: 768px) { .sidebar-backdrop { display: block !important; } }
      `}</style>
    </div>
  )
}
