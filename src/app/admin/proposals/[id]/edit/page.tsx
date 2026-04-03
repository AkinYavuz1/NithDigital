import type { Metadata } from 'next'
import ProposalEditorLoader from '../../ProposalEditorLoader'

export const metadata: Metadata = { title: 'Edit Proposal — Admin' }

export default function EditProposalPage({ params }: { params: { id: string } }) {
  return <ProposalEditorLoader id={params.id} />
}
