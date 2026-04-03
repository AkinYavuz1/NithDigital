export const dynamic = 'force-static'

import type { Metadata } from 'next'
import OSEmailsClient from './OSEmailsClient'

export const metadata: Metadata = { title: 'Email Queue — Business OS' }

export default function OSEmailsPage() {
  return <OSEmailsClient initialEmails={[]} clients={[]} />
}
