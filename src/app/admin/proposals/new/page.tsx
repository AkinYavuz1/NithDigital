import type { Metadata } from 'next'
import ProposalEditor from '../ProposalEditor'

export const metadata: Metadata = { title: 'New Proposal — Admin' }

export default function NewProposalPage() {
  return <ProposalEditor proposal={null} />
}
