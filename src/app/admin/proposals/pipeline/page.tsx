export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import ProposalsPipelineClient from './ProposalsPipelineClient'

export const metadata: Metadata = { title: 'Proposals Pipeline — Admin' }

export default function ProposalsPipelinePage() {
  return <ProposalsPipelineClient />
}
