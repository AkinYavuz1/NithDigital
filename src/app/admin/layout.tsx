import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9f8f5' }}>
      <AdminSidebar />
      <main className="admin-main" style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>{children}</main>
      <style>{`
        @media (max-width: 768px) {
          .admin-main {
            width: 100%;
            padding-top: 52px;
          }
        }
      `}</style>
    </div>
  )
}
