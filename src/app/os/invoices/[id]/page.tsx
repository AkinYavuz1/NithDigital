export const dynamic = 'force-static'
import InvoiceDetail from './InvoiceDetail'

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetail id={params.id} />
}
