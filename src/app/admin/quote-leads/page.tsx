export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import AdminQuoteLeadsClient from './AdminQuoteLeadsClient'
export const metadata: Metadata = { title: 'Quote Leads — Admin' }
export default function AdminQuoteLeadsPage() { return <AdminQuoteLeadsClient /> }
