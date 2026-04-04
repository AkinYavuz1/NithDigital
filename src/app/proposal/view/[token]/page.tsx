import type { Metadata } from 'next'
import PublicProposalWrapper from './PublicProposalWrapper'

export const metadata: Metadata = { title: 'Your Proposal — Nith Digital' }

export default function PublicProposalPage({ params }: { params: { token: string } }) {
  return <PublicProposalWrapper token={params.token} />
}
