import OSSidebar from './OSSidebar'
import OSTopBar from './OSTopBar'

export default function OSLayout({ children }: { children: React.ReactNode }) {
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
