'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const DemoInvoiceDetailClient = dynamic(() => import('./DemoInvoiceDetailClient'), { ssr: false })

export default function DemoInvoiceDetailWrapper() {
  const params = useParams()
  const id = params.id as string
  // DemoInvoiceDetailClient uses use(params) — pass a resolved promise
  const resolvedParams = Promise.resolve({ id })
  return <DemoInvoiceDetailClient params={resolvedParams} />
}
