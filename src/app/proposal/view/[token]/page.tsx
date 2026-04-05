import type { Metadata } from 'next'
import PublicProposalWrapper from './PublicProposalWrapper'

export const dynamic = 'force-static'
export const runtime = 'edge'
export const metadata: Metadata = { title: 'Your Proposal — Nith Digital' }

export default function PublicProposalPage() {
  return <PublicProposalWrapper />
}
