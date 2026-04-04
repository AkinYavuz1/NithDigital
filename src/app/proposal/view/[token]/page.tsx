import type { Metadata } from 'next'
import PublicProposalClient from './PublicProposalClient'

export const dynamic = 'force-static'
export const metadata: Metadata = { title: 'Your Proposal — Nith Digital' }

export default function PublicProposalPage({ params }: { params: { token: string } }) {
  return <PublicProposalClient token={params.token} />
}
