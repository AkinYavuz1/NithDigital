import type { Metadata } from 'next'
import PublicProposalWrapper from './PublicProposalWrapper'

export const metadata: Metadata = { title: 'Your Proposal — Nith Digital' }
export function generateStaticParams() { return [] }

export default function PublicProposalPage() {
  return <PublicProposalWrapper />
}
