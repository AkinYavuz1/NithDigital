import type { Metadata } from 'next'
import ProspectsClient from './ProspectsClient'

export const metadata: Metadata = { title: 'Prospects Outreach — Admin' }

export default function ProspectsPage() {
  return <ProspectsClient />
}
