import type { Metadata } from 'next'
import { Suspense } from 'react'
import InvoiceForm from '../InvoiceForm'
export const metadata: Metadata = { title: 'New Invoice — Business OS' }
export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, color: '#5A6A7A' }}>Loading...</div>}>
      <InvoiceForm />
    </Suspense>
  )
}
