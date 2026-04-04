'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const PublicProposalClient = dynamic(() => import('./PublicProposalClient'), { ssr: false })

export default function PublicProposalWrapper() {
  const params = useParams()
  const token = params.token as string
  return <PublicProposalClient token={token} />
}
