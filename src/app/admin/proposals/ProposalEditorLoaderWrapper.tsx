'use client'

import dynamic from 'next/dynamic'

const ProposalEditorLoader = dynamic(() => import('./ProposalEditorLoader'), { ssr: false })

export default function ProposalEditorLoaderWrapper({ id }: { id: string }) {
  return <ProposalEditorLoader id={id} />
}
