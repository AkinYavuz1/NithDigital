
export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import OSEmailsClient from '@/app/os/emails/OSEmailsClient'

export const metadata: Metadata = { title: 'Email Queue — Admin' }

export default function AdminEmailsPage() {
  return <OSEmailsClient initialEmails={[]} clients={[]} />
}
