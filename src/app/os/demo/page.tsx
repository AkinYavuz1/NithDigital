import type { Metadata } from 'next'
import DemoDashboard from './DemoDashboard'

export const metadata: Metadata = {
  title: 'Dashboard — Business OS Demo',
}

export default function DemoDashboardPage() {
  return <DemoDashboard />
}
