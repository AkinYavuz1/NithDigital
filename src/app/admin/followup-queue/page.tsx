import type { Metadata } from 'next'
import FollowUpQueueClient from './FollowUpQueueClient'

export const metadata: Metadata = {
  title: 'Follow-Up Queue — Nith Digital Admin',
}

export default function FollowUpQueuePage() {
  return <FollowUpQueueClient />
}
