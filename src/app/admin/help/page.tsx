export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import AdminHelpClient from './AdminHelpClient'
export const metadata: Metadata = { title: 'Help Articles — Admin' }
export default function AdminHelpPage() { return <AdminHelpClient /> }
