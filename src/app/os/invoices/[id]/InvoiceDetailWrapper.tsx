'use client'

import dynamic from 'next/dynamic'

const InvoiceDetail = dynamic(() => import('./InvoiceDetail'), { ssr: false })

export default function InvoiceDetailWrapper({ id }: { id: string }) {
  return <InvoiceDetail id={id} />
}
