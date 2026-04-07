export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProposalEditorWrapper from '../ProposalEditorWrapper'

export const metadata: Metadata = { title: 'New Proposal — Admin' }

export default function NewProposalPage() {
  return <Suspense fallback={null}><ProposalEditorWrapper proposal={null} /></Suspense>
}
