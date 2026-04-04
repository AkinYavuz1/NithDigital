export const runtime = 'edge'
import dynamic from 'next/dynamic'

const InvoiceDetail = dynamic(() => import('./InvoiceDetail'), { ssr: false })

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetail id={params.id} />
}
