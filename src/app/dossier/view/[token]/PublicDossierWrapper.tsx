'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const PublicDossierClient = dynamic(() => import('./PublicDossierClient'), { ssr: false })

export default function PublicDossierWrapper() {
  const params = useParams()
  const token = params.token as string
  return <PublicDossierClient token={token} />
}
