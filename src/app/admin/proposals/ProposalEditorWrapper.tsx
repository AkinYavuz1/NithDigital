'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { ProposalForm } from './ProposalEditor'

const ProposalEditor = dynamic(() => import('./ProposalEditor'), { ssr: false })

function ProposalEditorWithParams({ proposal }: { proposal: null }) {
  const searchParams = useSearchParams()
  const prefill: Partial<ProposalForm> = {}
  const demoUrl = searchParams.get('demo_url')
  const businessName = searchParams.get('business_name')
  const contactName = searchParams.get('contact_name')
  const contactEmail = searchParams.get('contact_email')
  const notes = searchParams.get('notes')
  if (demoUrl) prefill.demo_url = decodeURIComponent(demoUrl)
  if (businessName) prefill.business_name = decodeURIComponent(businessName)
  if (contactName) prefill.contact_name = decodeURIComponent(contactName)
  if (contactEmail) prefill.contact_email = decodeURIComponent(contactEmail)
  if (notes) prefill.notes = decodeURIComponent(notes)
  return <ProposalEditor proposal={proposal} prefill={Object.keys(prefill).length > 0 ? prefill : undefined} />
}

export default function ProposalEditorWrapper({ proposal }: { proposal: null }) {
  return (
    <Suspense fallback={null}>
      <ProposalEditorWithParams proposal={proposal} />
    </Suspense>
  )
}
