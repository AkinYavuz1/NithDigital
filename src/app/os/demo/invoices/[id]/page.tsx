export const runtime = 'edge'

import DemoInvoiceDetailWrapper from './DemoInvoiceDetailWrapper'

export default function DemoInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <DemoInvoiceDetailWrapper params={params} />
}
