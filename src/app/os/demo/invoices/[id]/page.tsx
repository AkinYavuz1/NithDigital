export const runtime = 'edge'
import DemoInvoiceDetailWrapper from './DemoInvoiceDetailWrapper'

export function generateStaticParams() { return [] }

export default function DemoInvoiceDetailPage() {
  return <DemoInvoiceDetailWrapper />
}
