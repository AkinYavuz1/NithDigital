import type { Metadata } from 'next'
import ProposalEditorWrapper from '../ProposalEditorWrapper'

export const metadata: Metadata = { title: 'New Proposal — Admin' }

export default function NewProposalPage() {
  return <ProposalEditorWrapper proposal={null} />
}
