import type { Metadata } from 'next'
import ReportsClient from './ReportsClient'
export const metadata: Metadata = { title: 'Reports — Business OS' }
export default function ReportsPage() { return <ReportsClient /> }
