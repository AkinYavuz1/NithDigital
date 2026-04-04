'use client'

import dynamic from 'next/dynamic'
import type { ProposalForm } from './ProposalEditor'

const ProposalEditor = dynamic(() => import('./ProposalEditor'), { ssr: false })

export default function ProposalEditorWrapper({ proposal, prefill }: { proposal: null; prefill?: Partial<ProposalForm> }) {
  return <ProposalEditor proposal={proposal} prefill={prefill} />
}
