'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const InvoiceDetail = dynamic(() => import('./InvoiceDetail'), { ssr: false })

export default function InvoiceDetailWrapper() {
  const params = useParams()
  const id = params.id as string
  return <InvoiceDetail id={id} />
}
