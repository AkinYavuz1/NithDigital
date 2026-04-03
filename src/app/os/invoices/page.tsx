import type { Metadata } from 'next'
import InvoicesClient from './InvoicesClient'
export const metadata: Metadata = { title: 'Invoices — Business OS' }
export default function InvoicesPage() { return <InvoicesClient /> }
