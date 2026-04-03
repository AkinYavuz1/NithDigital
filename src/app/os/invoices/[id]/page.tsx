export const runtime = 'edge'
import InvoiceDetail from './InvoiceDetail'

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetail id={params.id} />
}
