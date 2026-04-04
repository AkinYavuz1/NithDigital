import type { Metadata } from 'next'
import ProposalEditorLoaderWrapper from '../../ProposalEditorLoaderWrapper'

export const runtime = 'edge'
export const metadata: Metadata = { title: 'Edit Proposal — Admin' }

export default function EditProposalPage({ params }: { params: { id: string } }) {
  return <ProposalEditorLoaderWrapper id={params.id} />
}
