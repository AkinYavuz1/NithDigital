import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const PublicProposalClient = dynamic(() => import('./PublicProposalClient'), { ssr: false })

export const runtime = 'edge'
export const metadata: Metadata = { title: 'Your Proposal — Nith Digital' }

export default function PublicProposalPage({ params }: { params: { token: string } }) {
  return <PublicProposalClient token={params.token} />
}
