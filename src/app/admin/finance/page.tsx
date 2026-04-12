export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import AdminFinanceClient from './AdminFinanceClient'

export const metadata: Metadata = { title: 'Finance — Admin' }

export default function AdminFinancePage() {
  return <AdminFinanceClient invoices={[]} expenses={[]} income={[]} />
}
