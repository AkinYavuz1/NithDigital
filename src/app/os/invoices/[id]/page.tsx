export const runtime = 'edge'
import InvoiceDetailWrapper from './InvoiceDetailWrapper'

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetailWrapper id={params.id} />
}
