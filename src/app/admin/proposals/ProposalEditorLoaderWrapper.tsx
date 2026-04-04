'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const ProposalEditorLoader = dynamic(() => import('./ProposalEditorLoader'), { ssr: false })

export default function ProposalEditorLoaderWrapper() {
  const params = useParams()
  const id = params.id as string
  return <ProposalEditorLoader id={id} />
}
