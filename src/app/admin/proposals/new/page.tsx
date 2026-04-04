import type { Metadata } from 'next'
import ProposalEditorWrapper from '../ProposalEditorWrapper'
import type { ProposalForm } from '../ProposalEditor'

export const runtime = 'edge'
export const metadata: Metadata = { title: 'New Proposal — Admin' }

interface Props {
  searchParams: Promise<{
    demo_url?: string
    business_name?: string
    contact_name?: string
    contact_email?: string
    notes?: string
    from_audit?: string
  }>
}

export default async function NewProposalPage({ searchParams }: Props) {
  const params = await searchParams
  const prefill: Partial<ProposalForm> = {}
  if (params.demo_url) prefill.demo_url = decodeURIComponent(params.demo_url)
  if (params.business_name) prefill.business_name = decodeURIComponent(params.business_name)
  if (params.contact_name) prefill.contact_name = decodeURIComponent(params.contact_name)
  if (params.contact_email) prefill.contact_email = decodeURIComponent(params.contact_email)
  if (params.notes) prefill.notes = decodeURIComponent(params.notes)
  return <ProposalEditorWrapper proposal={null} prefill={Object.keys(prefill).length > 0 ? prefill : undefined} />
}
