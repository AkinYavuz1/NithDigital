import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const ProposalEditorLoader = dynamic(() => import('../../ProposalEditorLoader'), { ssr: false })

export const runtime = 'edge'
export const metadata: Metadata = { title: 'Edit Proposal — Admin' }

export default function EditProposalPage({ params }: { params: { id: string } }) {
  return <ProposalEditorLoader id={params.id} />
}
