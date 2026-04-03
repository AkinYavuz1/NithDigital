import type { Metadata } from 'next'
import ProposalEditor from '../ProposalEditor'

export const metadata: Metadata = { title: 'New Proposal — Admin' }

interface Props {
  searchParams: Promise<{ demo_url?: string }>
}

export default async function NewProposalPage({ searchParams }: Props) {
  const params = await searchParams
  const prefill = params.demo_url ? { demo_url: decodeURIComponent(params.demo_url) } : undefined
  return <ProposalEditor proposal={null} prefill={prefill} />
}
