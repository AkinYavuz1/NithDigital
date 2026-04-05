import type { Metadata } from 'next'
import ProposalEditorLoaderWrapper from '../../ProposalEditorLoaderWrapper'

export const dynamic = 'force-static'
export const runtime = 'edge'
export const metadata: Metadata = { title: 'Edit Proposal — Admin' }

export default function EditProposalPage() {
  return <ProposalEditorLoaderWrapper />
}
