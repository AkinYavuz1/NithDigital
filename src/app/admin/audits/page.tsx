import type { Metadata } from 'next'
import AdminAuditsClient from './AdminAuditsClient'

export const metadata: Metadata = { title: 'Site Audits — Admin' }

export default function AdminAuditsPage() {
  return <AdminAuditsClient />
}
