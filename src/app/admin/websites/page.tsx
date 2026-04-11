export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import AdminWebsitesClient from './AdminWebsitesClient'

export const metadata: Metadata = { title: 'Website Projects — Admin' }

export default function AdminWebsitesPage() {
  return <AdminWebsitesClient />
}
