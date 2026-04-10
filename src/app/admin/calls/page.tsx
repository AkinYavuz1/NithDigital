import type { Metadata } from 'next'
import CallsClient from './CallsClient'

export const metadata: Metadata = {
  title: 'Call List — Nith Digital Admin',
}

export default function CallsPage() {
  return <CallsClient />
}
