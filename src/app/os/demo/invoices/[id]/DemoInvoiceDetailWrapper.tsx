'use client'

import dynamic from 'next/dynamic'

const DemoInvoiceDetailClient = dynamic(() => import('./DemoInvoiceDetailClient'), { ssr: false })

export default function DemoInvoiceDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
  return <DemoInvoiceDetailClient params={params} />
}
