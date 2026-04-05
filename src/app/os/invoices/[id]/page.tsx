export const runtime = 'edge'
import InvoiceDetailWrapper from './InvoiceDetailWrapper'

export function generateStaticParams() { return [] }

export default function InvoiceDetailPage() {
  return <InvoiceDetailWrapper />
}
