export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import AdminProposalsClient from './AdminProposalsClient'

export const metadata: Metadata = { title: 'Proposals — Admin' }

export default function ProposalsPage() {
  return <AdminProposalsClient />
}
