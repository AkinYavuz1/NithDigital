export const runtime = 'edge'

import dynamic from 'next/dynamic'

const DemoInvoiceDetailClient = dynamic(() => import('./DemoInvoiceDetailClient'), { ssr: false })

export default function DemoInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <DemoInvoiceDetailClient params={params} />
}
