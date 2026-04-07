
export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import AdminContactsClient from './AdminContactsClient'

export const metadata: Metadata = { title: 'Contact Submissions — Admin' }

export default function AdminContactsPage() {
  return <AdminContactsClient initialSubmissions={[]} />
}
