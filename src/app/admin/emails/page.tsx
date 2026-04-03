export const dynamic = 'force-static'

import type { Metadata } from 'next'
import OSEmailsClient from '@/app/os/emails/OSEmailsClient'

export const metadata: Metadata = { title: 'Email Queue — Admin' }

export default function AdminEmailsPage() {
  return <OSEmailsClient initialEmails={[]} clients={[]} />
}
