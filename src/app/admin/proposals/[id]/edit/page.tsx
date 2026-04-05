export const runtime = 'edge'
import type { Metadata } from 'next'
import ProposalEditorLoaderWrapper from '../../ProposalEditorLoaderWrapper'

export const metadata: Metadata = { title: 'Edit Proposal — Admin' }

export default function EditProposalPage() {
  return <ProposalEditorLoaderWrapper />
}
