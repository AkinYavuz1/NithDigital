import type { Metadata } from 'next'
import RecordingsClient from './RecordingsClient'

export const metadata: Metadata = {
  title: 'Call Recordings — Nith Digital Admin',
}

export default function RecordingsPage() {
  return <RecordingsClient />
}
