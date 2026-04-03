import type { Metadata } from 'next'
import OSDashboard from './OSDashboard'

export const metadata: Metadata = {
  title: 'Dashboard — Business OS',
}

export default function OSPage() {
  return <OSDashboard />
}
