'use client'

import dynamic from 'next/dynamic'

const PublicProposalClient = dynamic(() => import('./PublicProposalClient'), { ssr: false })

export default function PublicProposalWrapper({ token }: { token: string }) {
  return <PublicProposalClient token={token} />
}
